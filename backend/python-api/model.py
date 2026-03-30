from transformers import pipeline

# Load the model once when server starts
# This model is specially trained on tweets
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

def analyze_sentiment(text: str):
    result = sentiment_model(text)[0]
    
    # Map model labels to readable labels
    label_map = {
        "positive": "Positive",
        "negative": "Negative",
        "neutral": "Neutral"
    }
    
    return {
        "text": text,
        "sentiment": label_map.get(result["label"], result["label"]),
        "confidence": round(result["score"] * 100, 2)  # convert to percentage
    }