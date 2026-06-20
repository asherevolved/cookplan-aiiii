import React, { useState, useRef, useEffect } from 'react';
import { CookingPlan } from '../types';
import { Send, Bot, User, Sparkles, AlertCircle, ChefHat, HelpCircle } from 'lucide-react';

interface ChefChatbotProps {
  currentPlan: CookingPlan | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChefChatbot({ currentPlan }: ChefChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am Chef PlanBot 🧑‍🍳. How can I help you customize your food menu today? You can ask me for step-by-step recipes, alternative ingredients, or nutritional advice!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Handle plan updates - add context reminder if a new plan is generated
  useEffect(() => {
    if (currentPlan) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `🍳 New cooking plan loaded!\n\n• 🍳 Breakfast: ${currentPlan.breakfast}\n• ☀️ Lunch: ${currentPlan.lunch}\n• 🌙 Dinner: ${currentPlan.dinner}\n\nAsk me for custom step-by-step cooking prep instructions or shopping tips for any of these dishes!`
        }
      ]);
    }
  }, [currentPlan]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return;

    setError(null);
    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           messages: newMessages,
           currentPlan
         }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to connect to assistant');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while talking to Chef PlanBot.');
    } finally {
      setIsSending(false);
    }
  };

  const quickQuestions = [
    { label: "📖 Show Recipes", query: "Can you give me step-by-step recipe instructions for today's breakfast, lunch, and dinner?" },
    { label: "🌱 Make it Vegan", query: "How can I easily convert this daily menu into a fully vegan plan? Which items should I substitute?" },
    { label: "⚡ Bulk Prep Tips", query: "Can you provide some advance prep tips or kitchen hacks to make these super quick to cook?" },
  ];

  return (
    <div className="flex flex-col h-[560px] bg-[#fffaf6] rounded-[2.5rem] border border-[#f5ede4] shadow-[0_15px_40px_rgba(235,215,200,0.25)] overflow-hidden animate-fade-in relative">
      
      {/* Dynamic Conversational Header */}
      <div className="p-4 border-b border-[#f3e3d2]/60 bg-gradient-to-r from-orange-400/10 via-orange-500/5 to-white flex items-center justify-between">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-rose-400 text-white rounded-2xl flex items-center justify-center shadow-md shadow-orange-100">
             <ChefHat className="w-5.5 h-5.5 text-white" />
           </div>
           <div>
             <h3 className="font-extrabold font-display text-sm text-[#463730]">Chef PlanBot Chat</h3>
             <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
               Veteren resource conscious Chef active
             </p>
           </div>
         </div>
         <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
      </div>

      {/* ChatGPT Styled Balloon List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#fffaf7]/40 to-[#fff8f3]/25 scrollbar-thin">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={index} 
              className={`flex items-start gap-3 max-w-[85%] animate-fade-in ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Bubble */}
              <div className={`w-8.5 h-8.5 rounded-2xl flex items-center justify-center flex-shrink-0 border shadow-xs ${
                isUser 
                  ? 'bg-rose-50 border-rose-100 text-rose-500' 
                  : 'bg-orange-950 border-orange-950 text-orange-200'
              }`}>
                 {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              {/* Chat Text Balloon */}
              <div className={`p-4 rounded-[1.6rem] text-sm leading-relaxed whitespace-pre-wrap shadow-2xs ${
                isUser 
                  ? 'bg-gradient-to-tr from-[#ff826e] to-[#ff667a] text-white rounded-tr-none' 
                  : 'bg-white text-[#4c3930] border border-[#f7eade]/80 rounded-tl-none font-medium'
              }`}>
                 {msg.content}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3 mr-auto">
            <div className="w-8.5 h-8.5 rounded-2xl bg-orange-950 text-orange-200 flex items-center justify-center border border-orange-950">
               <Bot className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="bg-white p-4 rounded-[1.6rem] rounded-tl-none border border-[#f7eade]/80 shadow-2xs flex items-center gap-1.5 py-3">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-2xl p-3 shadow-2xs">
             <AlertCircle className="w-4 h-4 text-rose-505 flex-shrink-0" />
             <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Fast-Query Quick-pills (ChatGPT-like recommendation panel) */}
      <div className="px-5 py-2.5 bg-[#fffaf6] border-t border-[#f4ede4]/60 overflow-x-auto flex gap-2 whitespace-nowrap scrollbar-none select-none">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={isSending}
            onClick={() => handleSend(q.query)}
            className="text-[11px] font-bold text-[#745e54] hover:text-orange-700 bg-white border border-[#efeae0] hover:border-orange-300 rounded-full px-4 py-1.5 text-left transition-all disabled:opacity-50 shadow-2xs cursor-pointer flex items-center gap-1 font-display"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            {q.label}
          </button>
        ))}
      </div>

      {/* Floating Translucent ChatGPT Styled Input Zone */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
        className="p-3.5 bg-white border-t border-[#f4ede4]/70 flex gap-2.5 items-center justify-between"
      >
         <input
           type="text"
           value={inputValue}
           onChange={(e) => setInputValue(e.target.value)}
           placeholder="Ask PlanBot: 'How to make...', 'Change paneer to tofu'..."
           disabled={isSending}
           className="flex-1 bg-[#faf6f1]/80 hover:bg-[#faf6f1] focus:bg-white border-0 focus:ring-2 focus:ring-orange-100 rounded-2xl px-4 py-3 text-sm text-[#46362e] outline-none transition-all disabled:opacity-75 font-medium placeholder:text-gray-400"
         />
         <button
           type="submit"
           disabled={!inputValue.trim() || isSending}
           className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 text-white p-3 rounded-2xl transition-all flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md shadow-orange-100 hover:scale-[1.03] active:scale-95"
         >
           <Send className="w-4 h-4 text-white" />
         </button>
      </form>

    </div>
  );
}
