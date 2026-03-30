from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import analyze_sentiment

# Initialize FastAPI app
app = FastAPI(title="Sentiment Analysis API")

# CORS — allows React frontend to talk to this API later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# This defines what the incoming request body should look like
class TweetRequest(BaseModel):
    text: str

# Health check endpoint — just to confirm server is running
@app.get("/")
def root():
    return {"message": "Sentiment API is running!"}

# Main endpoint — accepts a tweet, returns sentiment
@app.post("/analyze")
def analyze(request: TweetRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = analyze_sentiment(request.text)
    return result