const { Url } = require("../models/Url");
const { Click } = require("../models/click");
const { nanoid } = require("nanoid")
const axios = require("axios");

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const getGeoInfo = async (ip) => {
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        return response.data.country_name; // e.g., "India"
    } catch (err) {
        console.error('Geo error:', err.message);
        // return null;
        return "Germany"; // Default to India if there's an error
    }
};

async function handleHomePage(req, res) {
    const { url } = req.body;
    const user = req.user;

    const length = url.length;
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();

    if (!url) {
        return res.status(400).json({ success: false, message: "URL is required" });
    }

    if (!ip) {
        return res.status(400).json({ success: false, message: "IP address is required" });
    }

    let country_name = await getGeoInfo(ip) || "India"; // Default to India if geo info is not available
    if (!country_name) {
        country_name = "India";
    }

    const shortId = nanoid(8);
    const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
    const shortUrl = `${BASE_URL}/api/${shortId}`;

    const newUrl = await Url.create({

        url,
        length,
        shortId,
        shortUrl,
        user: user.id,
        countryName: country_name,
        clickCounts: 0
    })

    if (!newUrl) {
        return res.status(500).json({ success: false, message: "Failed to create short URL" });
    }

    const reqUrl = {
        url,
        shortId,
        shortUrl,
        length,
        createdAt: newUrl.createdAt,
        country_name,
        clickCounts: newUrl.clickCounts
    }

    req.url = reqUrl;

    return res.status(201).json({
        success: true,
        message: "Short URL created successfully",
        shortId: newUrl.shortId,
        shortUrl: newUrl.shortUrl,
    });
}


async function handleOpenShortId(req, res) {
    const shortId = req.params.id;
    const user = req.user;

    if (!user) {
        return res.status(401).json({ success: false, message: "User not authenticated", redirectTo: '/login' });
    }

    if (!shortId) {
        return res.status(400).json({ success: false, message: "shortId is Empty" });
    }

    try {
        const newUrl = await Url.findOneAndUpdate(
            { shortId },
            { $inc: { clickCounts: 1 } },  // increment clickCount
            { new: true }                 // return the updated document
        );

        if (!newUrl) {
            return res.status(404).json({ success: false, message: "URLs not found", redirectTo: '/home' });
        }


        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        const rawUserAgent = req.headers['user-agent'];  // full userAgent string
        const ua = req.useragent || {};

        const browser = ua.browser || 'Unknown';
        const os = ua.os || 'Unknown';

        let deviceType = 'Unknown';

        if (ua.isMobile) {
            deviceType = 'Mobile';
        } else if (ua.isTablet) {
            deviceType = 'Tablet';
        } else if (ua.isDesktop) {
            deviceType = 'Desktop';
        }

        let country_name

        try {

            country_name = await getGeoInfo(ip) || "Germany"; // Default to India if geo info is not available

        } catch (err) {
            console.error('Geo error: at handleOpenShortId ', err.message);
        }

        if (!country_name) {
            country_name = "Germany"; // Default to India if geo info is not available
        }

        try {
            const clickData = await Click.create({
                shortId,
                urlId: newUrl._id,
                userId: user.id,
                ipAddress: ip,
                country: country_name,
                userAgent: rawUserAgent,
                browser,
                device: deviceType,
                os
            })
        } catch (err) {
            console.error('Error creating click data:', err);
            return res.status(500).json({ success: false, message: "Failed to log click data", redirectTo: '/home' });
        }

        return res.redirect(newUrl.url); // Redirect to the original URL
    }

    catch (err) {
        console.error("Error in handleOpenShortId:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error", redirectTo: '/home' });
    }
}

async function handleGetUrls(req, res) {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    try {
        const urls = await Url.find({ user: user.id }).sort({ createdAt: -1 });

        if (!urls || urls.length === 0) {
            return res.status(404).json({ success: false, message: "No URLs found for this user" });
        }

        return res.status(200).json({ success: true, urls });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


module.exports = {
    handleHomePage,
    handleOpenShortId,
    handleGetUrls
}