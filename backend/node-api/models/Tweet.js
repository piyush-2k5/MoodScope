const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        enum: ["Positive", "Negative", "Neutral"],
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        default: "Manual"
    },
    url: {
        type: String,
        default: ""
    },
    keyword: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Tweet", TweetSchema);