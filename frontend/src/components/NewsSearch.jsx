import { useState } from "react";

const badges = {
  Positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Negative: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  Neutral: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
};

export default function NewsSearch({ onAnalyze, loading, progress, newsResults, message }) {
  const [keyword, setKeyword] = useState("");

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <input
          type="text"
          className="w-full bg-slate-800 text-white rounded-xl p-4 border border-slate-700 focus:border-cyan-500 outline-none"
          placeholder="Search news (AI, crypto, stocks...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          onClick={() => keyword && onAnalyze(keyword)}
          disabled={loading}
          className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl shadow-md shadow-cyan-500/20 transition"
        >
          {loading ? `Analyzing... ${progress}%` : "🔍 Analyze News"}
        </button>

        {loading && (
          <div className="mt-4 bg-slate-800 rounded-full h-2">
            <div
              className="bg-cyan-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {message && !loading && (
          <p className="mt-3 text-center text-sm text-amber-400">
            {message}
          </p>
        )}
      </div>

      {newsResults?.length > 0 && (
        <div className="space-y-3">
          {newsResults.map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between hover:bg-slate-800 transition">
              <div>
                <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-200 hover:text-cyan-400 text-sm">
                  {item.text}
                </a>
                <p className="text-xs text-slate-500">{item.source}</p>
              </div>

              <div className="text-right">
                <span className={`text-xs px-3 py-1 rounded-full ${badges[item.sentiment]}`}>
                  {item.sentiment}
                </span>
                <p className="text-xs text-slate-400">{item.confidence}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}