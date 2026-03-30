const badges = {
  Positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Negative: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
  Neutral: "bg-amber-500/15 text-amber-400 border border-amber-500/30"
};

export default function History({ history }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-slate-800 px-4 py-3 rounded-xl flex justify-between gap-4 hover:bg-slate-700 transition"
          >
            
            {/* 🔥 FIXED TEXT SECTION */}
            <div className="flex-1 min-w-0">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  title={item.text}
                  className="text-sm text-slate-200 hover:text-cyan-400 truncate block w-full"
                >
                  {item.text}
                </a>
              ) : (
                <p
                  title={item.text}
                  className="text-sm text-slate-200 truncate block w-full"
                >
                  {item.text}
                </p>
              )}

              <div className="text-xs text-slate-500 flex gap-2 mt-1 flex-wrap">
                {item.source && <span>📰 {item.source}</span>}
                {item.keyword && <span>🔍 {item.keyword}</span>}
              </div>
            </div>

            {/* Sentiment */}
            <div className="text-right shrink-0">
              <span
                className={`text-xs px-3 py-1 rounded-full ${badges[item.sentiment]}`}
              >
                {item.sentiment}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {item.confidence}%
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}