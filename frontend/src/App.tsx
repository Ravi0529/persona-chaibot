import { useEffect, useRef, useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ user?: string; bot?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://persona-chatbot.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from server.");
      }

      const result = await res.json();
      setHistory(result.history);
      setInput("");
    } catch (err: any) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // auto scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto bg-gray-100">
      <h1 className="text-xl font-bold text-center py-4 bg-white shadow">
        Chat with Hitesh Sir
      </h1>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {history.map((entry, index) => (
          <div key={index}>
            {entry.user && (
              <div className="flex justify-end">
                <div className="bg-green-200 px-4 py-2 rounded-2xl max-w-[80%] text-right">
                  <span className="font-semibold">You:</span> {entry.user}
                </div>
              </div>
            )}
            {entry.bot && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl max-w-[80%] shadow">
                  <span className="font-semibold">Hitesh Sir:</span>{" "}
                  {entry.bot.replace(/^"(.*)"$/, "$1")}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
