require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const sentimentRoutes = require('./routes/sentiment');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/sentiment", sentimentRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Node API is running!!" });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB is connected!");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
.catch(err => console.error("MongoDB connection failed:", err));