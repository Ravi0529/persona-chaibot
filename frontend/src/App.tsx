import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import hiteshSirImage from "./assets/hitesh-sir-image.png";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ user?: string; bot?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = input;

    setHistory((prev) => [...prev, { user: userMessage }]);
    setInput("");

    try {
      const res = await fetch("https://persona-chatbot.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to fetch response from server.");

      const result = await res.json();

      setHistory((prev) => [...prev, { bot: result.response }]);
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
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-orange-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 p-0.5 flex items-center justify-center">
            <img
              src={hiteshSirImage}
              alt="Hitesh Sir"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-orange-500">
            Tea Talks with ChaiBot
          </h1>
        </div>
        <a
          href="https://github.com/Ravi0529/persona-chaibot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-orange-500 transition-colors"
        >
          <FaGithub size={24} />
        </a>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {history.map((entry, index) => (
          <div key={index}>
            {entry.user && (
              <div className="flex justify-end">
                <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl max-w-[80%] text-right shadow-lg">
                  <span className="font-semibold">You:</span> {entry.user}
                </div>
              </div>
            )}
            {entry.bot && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-2xl max-w-[80%] shadow-lg border border-orange-500/30">
                  <span className="font-semibold text-orange-500">
                    Hitesh Sir:
                  </span>{" "}
                  {entry.bot.replace(/^"(.*)"$/, "$1")}
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-2 rounded-2xl max-w-[80%] shadow-lg border border-orange-500/30">
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-orange-500/30">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="flex-1 p-3 bg-gray-700 text-gray-100 border border-orange-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
