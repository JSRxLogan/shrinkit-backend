const { Url } = require('../models/url');
const { Click } = require('../models/click');

async function handleQuickAnalytics(req, res) {
    const shortId = req.params.id;

    if (!shortId) {
        return res.status(400).json({ success: false, message: "Short ID is required" });
    }

    const newUrl = await Url.findOne({ shortId });

    if (!newUrl) {
        return res.status(404).json({ success: false, message: "URL was not present in the request module" });
    }


    newUrl.user = undefined;
    newUrl._id = undefined;

    return res.status(200).json({ success: true, newUrl, message: "Successful response from handleNewUrl " })
}

async function handleDetailedAnalytics(req, res) {

    const shortId = req.params.id;

    if (!shortId) {
        return res.status(400).json({ success: false, message: "Short ID is required", redirectTo: '/home' });
    }

    let newUrl;
    try {
         newUrl = await Url.findOne({ shortId }).populate('user', 'username');
    } catch (err) {
        console.error('Error fetching URL:', err);
        return res.status(500).json({ success: false, message: "Internal server error", redirectTo: '/home' });
    }

    if (!newUrl) {
        return res.status(404).json({ success: false, message: "URL was not present in the request module", redirectTo: '/home' });
    }

    newUrl.user._id = undefined;
    newUrl._id = undefined;

    let clicks;
    try {
        clicks = await Click.find({ shortId }).sort({ createdAt: -1 });
    } catch (err) {
        console.error('Error fetching clicks:', err);
        return res.status(500).json({ success: false, message: "Internal server error", redirectTo: '/home' });
    }

    // if (!clicks || clicks.length === 0) {
    //     return res.status(404).json({ success: false, message: "No clicks found for this URL", redirectTo: '/home' });
    // }

    const sanitizedClicks = clicks.map(click => ({
        time: click.createdAt,       // consistent date field
        country: click.country || 'Unknown',
        browser: click.browser || 'Unknown',
        device: click.device || 'Unknown',
        os: click.os || 'Unknown'
    }));

    return res.status(200).json({ success: true, newUrl, clicks:sanitizedClicks, message: "Successful response from handleNewUrl " })
}

module.exports = {
    handleQuickAnalytics,
    handleDetailedAnalytics
}