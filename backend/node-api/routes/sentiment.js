const express = require("express");
const router = express.Router();
const axios = require("axios");
const Tweet = require("../models/Tweet");

//new input

router.post("/analyze-news", async (req, res) => {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "Keyword cannot be empty" });
    }

    try {
        const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                qInTitle: keyword,
                language: "en",
                pageSize: 5,
                sortBy: "publishedAt",
                apiKey: process.env.NEWS_API_KEY
            }
        });

        const regex = new RegExp(`\\b${keyword}\\b`, "i");

        const articles = newsResponse.data.articles
            .filter(a => a.title && regex.test(a.title))
            .slice(0, 5);

        if (articles.length === 0) {
            return res.status(404).json({ error: "No articles found" });
        }

        const promises = articles.map(article =>
            axios.post("http://127.0.0.1:8000/analyze", {
                text: article.title
            }).then(response => ({
                article,
                result: response.data
            }))
        );

        const responses = await Promise.all(promises);

        const results = [];

        for (const { article, result } of responses) {
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

        res.json({
            keyword,
            total: results.length,
            results
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch or analyze news" });
    }
});

//single input
router.post("/analyze", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Text cannot be empty" });
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/analyze", {
            text
        });

        const result = response.data;

        const tweet = new Tweet({
            text,
            sentiment: result.sentiment,
            confidence: result.confidence,
            source: "Manual Input"
        });

        await tweet.save();

        res.json({
            text,
            sentiment: result.sentiment,
            confidence: result.confidence
        });

    } catch (error) {
        console.error("Analyze Error:", error.message);
        res.status(500).json({ error: "Failed to analyze text" });
    }
});


//history

router.get("/history", async (req, res) => {
    try {
        const history = await Tweet.find()
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(history);
    } catch (error) {
        console.error("History Error:", error.message);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});


//analysis

router.get("/analytics", async (req, res) => {
  try {
    const data = await Tweet.find();

    const positive = data.filter(x => x.sentiment === "Positive").length;
    const negative = data.filter(x => x.sentiment === "Negative").length;
    const neutral = data.filter(x => x.sentiment === "Neutral").length;

    const analytics = [
      { _id: "Positive", count: positive },
      { _id: "Negative", count: negative },
      { _id: "Neutral", count: neutral }
    ];

    const trend = data.slice(-7);

    const topConfident = [...data]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    res.json({
      analytics,
      trend,
      topConfident
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

module.exports = router;