router.post("/analyze-news", async (req, res) => {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === "") {
        return res.status(400).json({ error: "Keyword cannot be empty" });
    }

    try {
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
            return res.status(404).json({ error: "No articles found" });
        }

        // 🔥 PARALLEL API CALLS
        const promises = articles.map(article =>
            axios.post("http://127.0.0.1:8000/analyze", {
                text: article.title
            }).then(res => ({
                article,
                result: res.data
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

        res.json({ keyword, total: results.length, results });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch or analyze news" });
    }
});