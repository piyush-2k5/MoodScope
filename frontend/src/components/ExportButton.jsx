import axios from "axios"

export default function ExportButton() {
  const handleExport = async () => {
    const res = await axios.get("http://localhost:5000/api/sentiment/export")
    const data = res.data

    // Convert to CSV
    const headers = ["Text", "Sentiment", "Confidence", "Source", "Keyword", "Date"]
    const rows = data.map(item => [
      `"${item.text.replace(/"/g, "'")}"`,
      item.sentiment,
      item.confidence,
      item.source || "Manual",
      item.keyword || "",
      new Date(item.createdAt).toLocaleDateString()
    ])

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "sentiment_results.csv"
    a.click()
  }

  return (
    <button
      onClick={handleExport}
      className="bg-cyan-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
    >
      Export Data
    </button>
  )
}