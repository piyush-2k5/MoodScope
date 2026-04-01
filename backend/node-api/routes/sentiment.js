const express = require("express");
const axios = require("axios");
const Tweet = require("../models/Tweet");

const router = express.Router();

// POST /api/sentiment/analyze
// Single text analysis
router.post("/analyze", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Text cannot be empty" });
    }

    try {
        const fastapiResponse = await axios.post("http://127.0.0.1:8000/analyze", { text });
        const result = fastapiResponse.data;

        const tweet = new Tweet({
            text: result.text,
            sentiment: result.sentiment,
            confidence: result.confidence
        });
        await tweet.save();

        res.json(result);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// POST /api/sentiment/analyze-news
// Fetches news by keyword and analyzes each headline
router.post("/analyze-news", async (req, res) => {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "Keyword cannot be empty" });
    }

    try {
        // Fetch headlines from NewsAPI
        const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: keyword,
                language: "en",
                pageSize: 5,
                sortBy: "publishedAt",
                apiKey: process.env.NEWS_API_KEY
            }
        });

        const articles = newsResponse.data.articles
            .filter(a => a.title && a.title !== "[Removed]")
            .slice(0, 5);

        if (articles.length === 0) {
            return res.status(404).json({ error: "No articles found for this keyword" });
        }

        // Analyze each article headline one by one
        const results = [];

        for (const article of articles) {
            const fastapiResponse = await axios.post("http://127.0.0.1:8000/analyze", {
                text: article.title
            });

            const result = fastapiResponse.data;

            // Save to MongoDB
            const tweet = new Tweet({
                text: article.title,
                sentiment: result.sentiment,
                confidence: result.confidence,
                source: article.source.name || "Unknown",
                url: article.url,
                keyword: keyword
            });
            await tweet.save();

            results.push({
                text: article.title,
                sentiment: result.sentiment,
                confidence: result.confidence,
                source: article.source.name || "Unknown",
                url: article.url
            });
        }

        res.json({ keyword, total: results.length, results });

    } catch (error) {
        console.error("NewsAPI Error:", error.message);
        res.status(500).json({ error: "Failed to fetch or analyze news" });
    }
});

// GET /api/sentiment/history
router.get("/history", async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

// GET /api/sentiment/analytics
router.get("/analytics", async (req, res) => {
    try {
        const analytics = await Tweet.aggregate([
            { $group: { _id: "$sentiment", count: { $sum: 1 } } }
        ]);

        // Confidence trend — last 20 records
        const trend = await Tweet.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .select("confidence sentiment createdAt");

        // Top 5 most confident predictions
        const topConfident = await Tweet.find()
            .sort({ confidence: -1 })
            .limit(5)
            .select("text sentiment confidence");

        res.json({ analytics, trend, topConfident });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch analytics" });
    }
});

// GET /api/sentiment/export
// Returns all data as JSON for CSV export
router.get("/export", async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .sort({ createdAt: -1 })
            .select("text sentiment confidence source keyword createdAt");
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ error: "Could not export data" });
    }
});

module.exports = router;