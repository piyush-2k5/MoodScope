const colors = {
  Positive: "text-green-400 border-green-500 bg-green-500/10",
  Negative: "text-red-400 border-red-500 bg-red-500/10",
  Neutral: "text-yellow-400 border-yellow-500 bg-yellow-500/10"
}

const emojis = {
  Positive: "😊",
  Negative: "😞",
  Neutral: "😐"
}

const bars = {
  Positive: "bg-green-500",
  Negative: "bg-red-500",
  Neutral: "bg-yellow-500"
}

export default function ResultCard({ result }) {
  const style = colors[result.sentiment]
  const barColor = bars[result.sentiment]

  return (
    <div className={`rounded-2xl p-6 border ${style} shadow-lg`}>

      {/* Tweet text */}
      <p className="text-gray-300 italic mb-4">"{result.text}"</p>

      {/* Sentiment + Confidence */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Sentiment</p>
          <p className={`text-2xl font-bold ${style.split(" ")[0]}`}>
            {emojis[result.sentiment]} {result.sentiment}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Confidence</p>
          <p className="text-2xl font-bold">{result.confidence}%</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${result.confidence}%` }}
        />
      </div>
      <p className="text-gray-500 text-xs mt-1 text-right">
        Model confidence: {result.confidence}%
      </p>
    </div>
  )
}