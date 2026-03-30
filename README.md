# MoodScope - Sentiment Analysis Dashboard

A full-stack NLP-powered dashboard that analyzes sentiment of any text or live news headlines in real time. Built with a RoBERTa transformer model, FastAPI, Node.js, React, and MongoDB.

---

## ✨ Features

- **Live News Analysis** — fetch real headlines by keyword via NewsAPI and analyze them one by one with a live progress bar
- **Manual Text Input** — paste any text and get instant sentiment prediction
- **5 Interactive Charts** — pie chart, bar chart, confidence trend line, radar chart, and top confident predictions
- **Mood Score** — an overall sentiment score (0–100) calculated from all analyzed results
- **History Feed** — every analyzed article or text stored in MongoDB, shown with source, keyword, and date
- **Export to CSV** — download all results as a spreadsheet with one click
- **Persistent Storage** — all results saved to MongoDB so history survives server restarts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ML Model | `cardiffnlp/twitter-roberta-base-sentiment` (HuggingFace) |
| Python Backend | FastAPI + Uvicorn |
| Node Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Frontend | React + Vite + Tailwind CSS |
| Charts | Recharts |
| News Data | NewsAPI |
| HTTP Client | Axios |

---

## 🏗️ Architecture

```
React Frontend (port 5173)
        ↕
Node/Express API Gateway (port 5000)
        ↕                    ↕
FastAPI ML Server        MongoDB Atlas
   (port 8000)          (sentiment history)
        ↕
HuggingFace RoBERTa Model
```

---

## 📁 Folder Structure

```
sentiment-dashboard/
├── backend/
│   ├── python-api/
│   │   ├── main.py           # FastAPI app + endpoints
│   │   ├── model.py          # HuggingFace model loader
│   │   └── requirements.txt
│   │
│   └── node-api/
│       ├── server.js         # Express server + MongoDB connection
│       ├── .env              # Environment variables
│       ├── routes/
│       │   └── sentiment.js  # API routes
│       └── models/
│           └── Tweet.js      # MongoDB schema
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TweetInput.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   ├── NewsSearch.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── History.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (running locally)
- NewsAPI key → [newsapi.org](https://newsapi.org/register)

---

### 1. Clone the repository

```bash
git clone https://github.com/piyush-2k5/sentiment-dashboard.git
cd sentiment-dashboard
```

---

### 2. Set up Python backend (FastAPI)

```bash
cd backend/python-api
pip install fastapi uvicorn transformers torch
```

> ⚠️ First run will download the RoBERTa model (~500MB). This is a one-time download.

---

### 3. Set up Node backend (Express)

```bash
cd backend/node-api
npm install
```

Create a `.env` file inside `backend/node-api/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sentiment-dashboard
NEWS_API_KEY=your_newsapi_key_here
```

---

### 4. Set up React frontend

```bash
cd frontend
npm install
```

---

## 🚀 Running the Project

You need **3 terminals** running simultaneously 
**Terminal 1 — FastAPI:**
```bash
cd backend/python-api
uvicorn main:app --reload
```

**Terminal 2 — Express:**
```bash
cd backend/node-api
node server.js
```

**Terminal 3 — React:**
```bash
cd frontend
npm run dev
```

Then open → [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints

### FastAPI (port 8000)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/analyze` | Analyze a single text |

### Express (port 5000)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/sentiment/analyze` | Analyze manual text input |
| POST | `/api/sentiment/analyze-news` | Fetch + analyze news by keyword |
| GET | `/api/sentiment/history` | Get last 50 results |
| GET | `/api/sentiment/analytics` | Get counts, trend, top predictions |
| GET | `/api/sentiment/export` | Export all results as JSON for CSV |

---

## 📊 Model Details

- **Model:** `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Type:** RoBERTa (Robustly Optimized BERT Pretraining Approach)
- **Training Data:** ~124M tweets
- **Labels:** Positive, Negative, Neutral
- **Output:** Sentiment label + confidence score (0–100%)

---

## 🔮 Future Improvements

- [ ] Subreddit comparison mode (analyze 2 topics side by side)
- [ ] User authentication with JWT
- [ ] Deploy to Render + Vercel
- [ ] Add multilingual support
- [ ] Batch CSV upload for offline analysis

---

## 📄 License

MIT License — feel free to use and modify for your own projects.

---

## 🙋‍♂️ Author

**Piyush**
- GitHub: [@piyush-2k5](https://github.com/piyush-2k5)
