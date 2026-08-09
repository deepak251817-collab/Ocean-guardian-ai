// src/components/ui/AIAssistant.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Waves } from "lucide-react";

// ─── Mock AI responses keyed to predefined questions ────────────────────────
const MOCK_RESPONSES = {
  "What is the current ocean health score?":
    "The current Ocean Health Score is 72/100. This composite index accounts for temperature anomaly (+1.3°C above baseline), pH levels (8.04, slightly acidic), biodiversity index, and plastic pollution. It has improved by +3.2% compared to last month.",
  "Show me the latest critical alerts.":
    "There are 3 active critical alerts: 🔴 Coral Bleaching at Great Barrier Reef (42/100 health, detected 12 min ago). 🔴 Oil Spill Risk near Gulf of Mexico (2 hrs ago). 🔴 Ship Collision Risk at Singapore Strait (8 hrs ago). Immediate review recommended.",
  "How many stations are active?":
    "There are currently 340 active monitoring stations worldwide, covering 68.4% of major ocean zones. 8 deep-sea sensor nodes are actively streaming real-time data across Pacific, Atlantic, Indian, Arctic, and Antarctic regions.",
  "Give me a summary of recent reports.":
    "Recent reports show: Sea surface temperature rose +0.3°C this week. Micro-plastic concentration in the Pacific Garbage Patch increased 12%. A plankton bloom was detected off the coast of Japan. pH dropped 0.05 in the North Atlantic, posing shellfish risks.",
};

const PREDEFINED_QUESTIONS = Object.keys(MOCK_RESPONSES);

// ─── Typing animation — safe to call at component top level ─────────────────
function useTyping(text, delay = 900) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplay("");
    setDone(false);
    const timer = setTimeout(() => {
      setDisplay(text);
      setDone(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return { display, done };
}

// ─── AIMessage — isolated component so useTyping is called at top level ──────
function AIMessage({ content }) {
  const { display, done } = useTyping(content);
  return (
    <div className="flex items-start gap-2 max-w-[85%]">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={12} className="text-white" />
      </div>
      <div className="bg-ocean-800/60 border border-ocean-700/40 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-200 leading-relaxed">
        {!done ? (
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        ) : (
          display
        )}
      </div>
    </div>
  );
}

// ─── UserMessage ─────────────────────────────────────────────────────────────
function UserMessage({ content }) {
  return (
    <div className="flex items-start gap-2 max-w-[85%] self-end flex-row-reverse">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-ocean-500 flex items-center justify-center shrink-0 mt-0.5">
        <User size={12} className="text-white" />
      </div>
      <div className="bg-ocean-400/20 border border-ocean-400/30 rounded-2xl rounded-tr-sm px-3 py-2 text-xs text-ocean-100 leading-relaxed">
        {content}
      </div>
    </div>
  );
}

// ─── Main AIAssistant Component ───────────────────────────────────────────────
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("og_chat_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");

  const chatEndRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save to localStorage when messages change
  useEffect(() => {
    localStorage.setItem("og_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // Click-outside to close
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Don't close if clicking the FAB (it toggles itself)
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const sendMessage = (text) => {
    const question = text.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { sender: "user", content: question }]);
    setInputValue("");

    const response =
      MOCK_RESPONSES[question] ||
      `I've analyzed the ocean data for your query: "${question}". Based on current sensor readings across 340 monitoring stations, the data shows stable conditions with minor anomalies. For specific metrics, try one of the suggested questions above.`;

    // Add AI response (AIMessage handles the typing delay internally)
    setMessages((prev) => [...prev, { sender: "ai", content: response }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleReset = () => {
    setMessages([]);
    localStorage.removeItem("og_chat_history");
    setInputValue("");
  };

  return (
    <>
      {/* ── Floating Action Button ──────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center shadow-lg shadow-ocean-500/30 border border-ocean-400/30 transition-all"
        aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Waves size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge when closed */}
        {!open && messages.length === 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-ocean-900 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-ocean-900" />
          </span>
        )}
      </motion.button>

      {/* ── Chat Window ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Ocean Assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="fixed bottom-36 lg:bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[360px] max-h-[520px] flex flex-col glass border border-ocean-700/50 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-ocean-700/40 bg-ocean-900/40 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-none">Ocean AI</p>
                <p className="text-[10px] text-teal-400 font-medium mt-0.5">● Online · 340 stations active</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="px-2 py-1 text-[10px] text-slate-400 hover:text-white rounded-lg hover:bg-ocean-800/40 transition-all"
                    aria-label="Clear conversation"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-ocean-800/40 transition-all"
                  aria-label="Close AI Assistant"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {/* Welcome state */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={12} className="text-white" />
                    </div>
                    <div className="bg-ocean-800/60 border border-ocean-700/40 rounded-2xl rounded-tl-sm px-3 py-2 text-xs text-slate-200 leading-relaxed">
                      Hello! I'm your Ocean Guardian AI assistant. Ask me anything about ocean health, active alerts, or monitoring data. Try one of these:
                    </div>
                  </div>

                  {/* Predefined questions */}
                  <div className="space-y-1.5 pl-8">
                    {PREDEFINED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-[11px] text-ocean-300 bg-ocean-800/30 hover:bg-ocean-700/40 border border-ocean-700/30 hover:border-ocean-500/40 rounded-xl px-3 py-2 transition-all leading-relaxed"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Conversation */}
              {messages.map((msg, i) =>
                msg.sender === "user" ? (
                  <UserMessage key={i} content={msg.content} />
                ) : (
                  <AIMessage key={i} content={msg.content} />
                )
              )}

              {/* Scroll anchor */}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested quick questions (after first message) */}
            {messages.length > 0 && (
              <div className="px-4 pb-2 shrink-0 border-t border-ocean-700/30 pt-2 flex gap-1.5 overflow-x-auto scrollbar-none">
                {PREDEFINED_QUESTIONS.slice(0, 2).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="shrink-0 text-[10px] text-ocean-300 bg-ocean-800/30 hover:bg-ocean-700/40 border border-ocean-700/30 rounded-full px-2.5 py-1 transition-all whitespace-nowrap"
                  >
                    {q.length > 32 ? q.slice(0, 32) + "…" : q}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="px-3 pb-3 pt-1 shrink-0">
              <div className="flex items-center gap-2 glass-light border border-ocean-700/40 rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about ocean data…"
                  className="flex-1 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none min-w-0"
                  aria-label="Type your question"
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shrink-0"
                  aria-label="Send message"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
