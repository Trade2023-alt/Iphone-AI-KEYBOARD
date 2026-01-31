
"use client";

import React, { useState } from "react";
import { Copy, Sparkles, Send, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the Tones
const TONES = [
  { id: "negotiator", label: "Professional Negotiator", icon: "💼", color: "from-blue-600 to-cyan-500" },
  { id: "professional_casual", label: "Professional Casual", icon: "👔", color: "from-slate-600 to-slate-400" },
  { id: "business", label: "Business", icon: "📊", color: "from-gray-700 to-gray-900" },
  { id: "casual", label: "Casual Conversation", icon: "🙂", color: "from-green-500 to-emerald-400" },
  { id: "witty", label: "Witty Conversation", icon: "⚡", color: "from-yellow-500 to-orange-400" },
  { id: "flirty", label: "Flirty Conversation", icon: "😉", color: "from-pink-500 to-rose-400" },
  { id: "fun", label: "Fun Conversation", icon: "🎉", color: "from-purple-500 to-indigo-400" },
  { id: "social", label: "Social Media Format", icon: "#️⃣", color: "from-blue-400 to-sky-300" },
  { id: "serious", label: "Serious Format", icon: "😐", color: "from-red-800 to-red-600" },
  { id: "seductive", label: "Seductive Format", icon: "💋", color: "from-red-600 to-pink-600" },
];

export default function KeyboardApp() {
  const [inputText, setInputText] = useState("");
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText) return;
    setLoading(true);
    setResponse(""); // Clear previous

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone: selectedTone.label }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse("Error: Could not generate. Check API Key.");
      }
    } catch (e) {
      setResponse("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      // Could add a toast here
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-md mx-auto h-screen flex flex-col p-6 relative z-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AI Keyboard
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
              {/* User Avatar Placeholder */}
              <img src="https://github.com/shadcn.png" alt="User" />
            </div>
          </Button>
        </header>

        {/* Input Area */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
              Input Message
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a message to reply to, or type a draft..."
                className="relative bg-gray-900/80 border-gray-800 text-base p-4 min-h-[120px] resize-none rounded-xl focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
              Select Persona
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone)}
                  className={cn(
                    "relative overflow-hidden group p-3 rounded-xl border text-left transition-all duration-300",
                    selectedTone.id === tone.id
                      ? "border-transparent bg-gray-800"
                      : "border-gray-800 bg-gray-900/40 hover:bg-gray-800/60"
                  )}
                >
                  {/* Active Gradient Border/Background */}
                  {selectedTone.id === tone.id && (
                    <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-br", tone.color)} />
                  )}

                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="text-2xl">{tone.icon}</span>
                    <span className={cn(
                      "text-sm font-medium leading-tight",
                      selectedTone.id === tone.id ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                    )}>
                      {tone.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Response Area */}
          <AnimatePresence>
            {(response || loading) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-auto"
              >
                <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-indigo-400 flex items-center gap-1">
                        <Sparkles size={12} /> AI Suggestion
                      </span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/10" onClick={handleGenerate} title="Regenerate">
                          <RefreshCw size={12} className={cn(loading && "animate-spin")} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 hover:bg-white/10" onClick={copyToClipboard} title="Copy">
                          <Copy size={12} />
                        </Button>
                      </div>
                    </div>

                    <div className="min-h-[60px] text-sm text-gray-200 leading-relaxed">
                      {loading ? (
                        <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                          Generating magic...
                        </div>
                      ) : (
                        response
                      )}
                    </div>
                  </div>

                  {!loading && response && (
                    <div
                      onClick={copyToClipboard}
                      className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-colors p-2 text-center text-xs font-bold tracking-wide uppercase text-white flex items-center justify-center gap-2"
                    >
                      Copy to Clipboard
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Floating Action Button / Main Trigger */}
        <div className="mt-6">
          <Button
            className={cn(
              "w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-500/20 transition-all duration-300",
              "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient text-white border-0 hover:scale-[1.02] active:scale-[0.98]"
            )}
            onClick={handleGenerate}
            disabled={loading || !inputText}
          >
            {loading ? (
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Response
          </Button>
        </div>

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
