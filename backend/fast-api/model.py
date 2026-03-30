from transformers import pipeline

sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)

def analyze_sentiment(text: str):
    if not text or text.strip() == "":
        return {
            "text": text,
            "sentiment": "Neutral",
            "confidence": 0
        }

    try:
        result = sentiment_model(text)[0]

        label = result["label"].lower()
        label_map = {
            "positive": "Positive",
            "negative": "Negative",
            "neutral": "Neutral"
        }

        sentiment = label_map.get(label, label.capitalize())

        return {
            "text": text,
            "sentiment": sentiment,
            "confidence": round(result["score"] * 100, 2)
        }

    except Exception as e:
        return {
            "text": text,
            "sentiment": "Neutral",
            "confidence": 0,
            "error": str(e)
        }