import { useState, useEffect } from "react";
import axios from "axios";
import TweetInput from "./components/TweetInput";
import NewsSearch from "./components/NewsSearch";
import ResultCard from "./components/ResultCard";
import Charts from "./components/Charts";
import History from "./components/History";
import ExportButton from "./components/ExportButton";

const API = "http://localhost:5000/api/sentiment";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({ analytics: [], trend: [], topConfident: [] });
  const [history, setHistory] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("manual");
  const [newsMessage, setNewsMessage] = useState("");

  useEffect(() => {
    fetchAnalytics();
    fetchHistory();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API}/analytics`);
      setAnalytics(res.data || { analytics: [], trend: [], topConfident: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/history`);
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const analyzeTweet = async (text) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze`, { text });
      setResult(res.data);
      fetchAnalytics();
      fetchHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeNews = async (keyword) => {
  setLoading(true);
  setNewsResults([]);
  setProgress(0);
  setNewsMessage("");

  try {
    const res = await axios.post(`${API}/analyze-news`, { keyword });

    if (res.data.total === 0) {
      setNewsMessage(res.data.message);
      return;
    }

    const results = res.data.results;

    for (let i = 0; i < results.length; i++) {
      await new Promise((r) => setTimeout(r, 150));
      setNewsResults((prev) => [...prev, results[i]]);
      setProgress(Math.round(((i + 1) / results.length) * 100));
    }

    fetchAnalytics();
    fetchHistory();

  } catch (err) {
    console.error(err);
    setNewsMessage("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
  <>
    {/* Sticky Header */}
    <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800 p-4">
      <h1 className="text-lg font-semibold text-cyan-400 text-center">
        MoodScope
      </h1>
    </div>

    {/* Main Content */}
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8">
      <h1 className="text-3xl font-semibold text-center mb-1 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Real-Time Sentiment Intelligence
      </h1>

      <p className="text-center text-slate-400 mb-10 text-sm">
        Analyze sentiment from text and news in real time
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        {["manual", "news"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              activeTab === tab
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {tab === "manual" ? "Manual Input" : "Live News"}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {activeTab === "manual" ? (
          <>
            <TweetInput onAnalyze={analyzeTweet} loading={loading} />
            {result && <ResultCard result={result} />}
          </>
        ) : (
          <NewsSearch
            onAnalyze={analyzeNews}
            loading={loading}
            progress={progress}
            newsResults={newsResults || []}
            message={newsMessage}
          />
        )}

        {analytics?.analytics?.length > 0 && <Charts analytics={analytics} />}

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">
            🕓 Recent History
          </h2>
          <ExportButton />
        </div>

        {history?.length > 0 && <History history={history} />}
      </div>
    </div>
  </>
);
}