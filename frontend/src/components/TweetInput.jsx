import { useState } from "react";

export default function TweetInput({ onAnalyze, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) onAnalyze(text);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      
      <textarea
        className="w-full bg-slate-800 text-white rounded-xl p-4 resize-none outline-none border border-slate-700 focus:border-cyan-500 transition-all duration-200"
        rows={4}
        placeholder="Type or paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="mt-3 w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-md shadow-cyan-500/20"
      >
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </button>

    </div>
  );
}