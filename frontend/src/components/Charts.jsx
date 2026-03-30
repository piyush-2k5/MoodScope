import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = {
  Positive: "#10b981",
  Negative: "#f43f5e",
  Neutral: "#f59e0b"
};

export default function Charts({ analytics }) {
  const { analytics: counts, trend, topConfident } = analytics;

  const pieData = counts.map(item => ({
    name: item._id,
    value: item.count
  }));

  const barData = counts.map(item => ({
    sentiment: item._id,
    count: item.count
  }));

  const lineData = [...(trend || [])].reverse().map((item, i) => ({
    index: i + 1,
    confidence: item.confidence
  }));

  // totals
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  const positive = counts.find(c => c._id === "Positive")?.count || 0;
  const negative = counts.find(c => c._id === "Negative")?.count || 0;

  // mood
  const moodScore = total > 0
    ? Math.round(((positive - negative) / total + 1) * 50)
    : 50;

  const moodLabel =
    moodScore >= 65 ? "Positive 😊" :
    moodScore <= 35 ? "Negative 😞" :
    "Neutral 😐";

  const moodColor =
    moodScore >= 65 ? "text-emerald-400" :
    moodScore <= 35 ? "text-rose-400" :
    "text-amber-400";

  return (
    <div className="space-y-6">

      {/* Mood */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-slate-400 text-sm mb-1">Overall Mood</p>

        <p className={`text-5xl font-bold ${moodColor}`}>
          {moodScore}
        </p>

        <p className={`text-lg mt-1 ${moodColor}`}>
          {moodLabel}
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Pie Chart (with % labels) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            🥧 Sentiment Distribution
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map(entry => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => {
                  const percent = total
                    ? ((value / total) * 100).toFixed(1)
                    : 0;
                  return [`${value} (${percent}%)`, "Count"];
                }}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🔥 Progress Bars */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            📊 Sentiment Distribution
          </h2>

          <div className="space-y-8">
            {barData.map(item => {
              const percent = total
                ? (item.count / total) * 100
                : 0;

              return (
                <div key={item.sentiment}>

                  <div className="flex justify-between text-sm text-slate-300">
                    <span>
                      {item.sentiment === "Positive" && "😊 "}
                      {item.sentiment === "Negative" && "😞 "}
                      {item.sentiment === "Neutral" && "😐 "}
                      {item.sentiment}
                    </span>
                    <span>{percent.toFixed(0)}%</span>
                  </div>

                  <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: COLORS[item.sentiment]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Line Chart */}
      {lineData.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            📈 Confidence Trend
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="index" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(val) => `${val}%`} />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#22d3ee"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Predictions */}
      {topConfident?.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">
            🏆 Top Predictions
          </h2>

          <div className="space-y-3">
            {topConfident.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl hover:bg-slate-700 transition"
              >
                <span className="text-slate-500 text-sm w-4 shrink-0">
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <p
                    title={item.text}
                    className="text-sm text-slate-200 truncate"
                  >
                    {item.text}
                  </p>
                </div>

                <span className="text-sm font-semibold text-slate-300 w-16 text-right shrink-0">
                  {item.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}