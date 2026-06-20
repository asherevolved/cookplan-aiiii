import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultsView } from './components/ResultsView';
import { ChefChatbot } from './components/ChefChatbot';
import { CookingPlan, PlanOptions } from './types';
import { UtensilsCrossed, Sparkles, ChefHat, Flame, Compass, MessageSquare, ArrowRight, ArrowLeft, Heart, Salad, HelpCircle } from 'lucide-react';

export default function App() {
  const [options, setOptions] = useState<PlanOptions | null>(null);
  const [plan, setPlan] = useState<CookingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<'planner' | 'assistant'>('planner');

  const fetchPlan = async (opts: PlanOptions) => {
    setIsLoading(true);
    setError(null);
    setOptions(opts);
    // Auto switch to planner tab to show progress
    setActiveTab('planner');

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opts),
      });

      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || 'Failed to generate plan');
      }

      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Welcome / Onboarding Screen - Apple iOS + Calm/Headspace Theme
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#fffbf8] via-[#fff5ee] to-[#fffbf8] animate-fade-in relative overflow-hidden">
        {/* Soft background glow circles */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-200/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-150/40 rounded-full blur-[100px]" />

        <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden border border-[#f3e9df]/70 shadow-[0_15px_40px_rgba(116,94,84,0.08)] p-8 flex flex-col justify-between min-h-[590px] relative z-10 transition-all">
          
          {/* Top Tag Header */}
          <div className="flex gap-2.5 justify-center mb-6">
             <span className="bg-orange-100/70 text-[#c2512a] px-4 py-2 rounded-full text-[11px] font-black font-display flex items-center gap-1 shadow-2xs select-none">
               🍳 Breakfast
             </span>
             <span className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-[11px] font-black font-display flex items-center gap-1 shadow-2xs select-none">
               🥗 Lunch
             </span>
             <span className="bg-[#fcf3ff] text-[#8630ab] px-4 py-2 rounded-full text-[11px] font-black font-display flex items-center gap-1 shadow-2xs select-none">
               🌙 Dinner
             </span>
          </div>

          {/* Central Logo Motif */}
          <div className="flex flex-col items-center text-center my-6">
             <div className="w-24 h-24 bg-gradient-to-tr from-orange-400 to-[#fb7185] rounded-[2.2rem] flex items-center justify-center mb-5 border-4 border-white shadow-xl shadow-orange-100">
               <ChefHat className="w-12 h-12 text-white animate-bounce" style={{ animationDuration: '3.5s' }} />
             </div>
             
             <h1 className="text-3xl font-black font-display text-[#38261e] tracking-tight">CookPlan AI</h1>
             
             {/* Subtitle tag lines */}
             <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-xs">
                <span className="bg-orange-50 text-orange-700 text-[11px] font-bold px-3 py-1 rounded-full border border-orange-100/50">Smart scanner</span>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100/40 font-display">Budget friendly</span>
                <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-100/40">Zero-waste</span>
             </div>
          </div>

          {/* App description info */}
          <div className="text-center space-y-3.5 px-3">
             <p className="text-sm text-[#745e54] leading-relaxed font-semibold">
               Stop worrying about dinner budget limits. Generate wholesome recipes, custom-tailored to your exact daily budget in seconds.
             </p>
          </div>

          {/* Call-to-action Start button */}
          <div className="mt-8 space-y-4">
             <button
               onClick={() => setShowWelcome(false)}
               className="w-full bg-gradient-to-r from-orange-500 to-[#fb7185] hover:opacity-95 text-white font-extrabold font-display py-4.5 px-6 rounded-full flex items-center justify-center gap-2 group transition-all transform active:scale-95 shadow-lg shadow-orange-100 cursor-pointer select-none"
             >
               <span>Begin Cooking Plan</span>
               <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
             </button>
             
             <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest font-display">
                <span>NVIDIA NIM AI Partner</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>v2.4 App</span>
             </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex justify-center bg-[#fffbf8] relative">
      
      {/* Floating Ambient Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-orange-100/30 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-50/40 rounded-full blur-[120px] -z-10" />

      {/* Main Container: Added pb-28 bottom padding so floating nav bar does not overlap elements */}
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-[380px_1fr] items-start pb-28 relative">
        
        {/* Left Column: Input Preferences Form */}
        <div className="space-y-6">
          <header className="flex items-center justify-between px-1 select-none">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-orange-500 to-[#fb7185] text-white w-12 h-12 rounded-[1.3rem] flex items-center justify-center shadow-md shadow-orange-100">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-display text-[#38261e] tracking-tight">CookPlan AI</h1>
                <p className="text-xs text-gray-500 font-bold font-display mt-0.5">Your Premium Kitchen Companion</p>
              </div>
            </div>
            
            {/* Quick Back to Welcome button */}
            <button 
              onClick={() => setShowWelcome(true)}
              className="text-xs font-black text-gray-500 hover:text-gray-800 bg-[#faf1e8] hover:bg-[#ebd2bf]/40 px-3.5 py-2.5 rounded-full transition-all flex items-center gap-1 shadow-2xs select-none cursor-pointer border border-[#f5ede4]/45"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Start Screen
            </button>
          </header>

          <InputForm onSubmit={fetchPlan} isLoading={isLoading} />
        </div>

        {/* Right Column: Display container results or chatbot */}
        <div className="space-y-6">
          
          <div>
            {error && (
              <div className="bg-rose-50 border border-rose-100/70 text-rose-800 p-5 rounded-[2rem] mb-6 flex gap-3 items-start shadow-sm animate-fade-in outline-none">
                <Flame className="w-5.5 h-5.5 text-rose-550 flex-shrink-0 animate-pulse mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-[#4c2929] font-display text-sm">Chef chatbot encountered an obstacle</h4>
                  <p className="text-xs text-rose-700/90 mt-1 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Render active tabs */}
            {activeTab === 'planner' ? (
              <>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center min-h-[440px] border border-[#f5ede3] rounded-[2.5rem] bg-white p-8 text-center shadow-[0_10px_35px_rgba(116,94,84,0.035)] animate-fade-in">
                     <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
                        <Sparkles className="w-7 h-7 text-orange-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                     </div>
                     <h3 className="text-xl font-black text-gray-900 font-display">Crafting your menu...</h3>
                     <p className="text-xs text-gray-500 mt-2.5 max-w-sm leading-relaxed font-semibold">
                       Chef PlanBot is formulating beautiful, high-efficiency recipes fitting your grocery budget. Give us a brief moment to perfect the ingredients.
                     </p>
                  </div>
                )}

                {!plan && !isLoading && !error && (
                    <div className="flex h-full min-h-[440px] border-2 border-dashed border-[#eadcc3] rounded-[2.5rem] items-center justify-center flex-col text-center p-8 bg-white shadow-[0_10px_35px_rgba(116,94,84,0.015)] select-none animate-fade-in">
                      <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500/80 mb-4 animate-pulse">
                         <Salad className="w-7 h-7" />
                      </div>
                      <h3 className="font-extrabold text-[#523d32] font-display text-lg tracking-tight">Your Cooking Screen is ready</h3>
                      <p className="font-semibold text-xs text-gray-500 max-w-sm mt-2.5 leading-relaxed">
                        Customize daily budget details or upload a quick snapshot of your fridge contents, then click 'Generate Meal Plan' to start your premium culinary guide.
                      </p>
                    </div>
                )}

                {plan && !isLoading && <ResultsView plan={plan} options={options!} />}
              </>
            ) : (
              <ChefChatbot currentPlan={plan} />
            )}
          </div>

        </div>

      </div>

      {/* FLOATING BOTTOM NAVIGATION BAR (Apple iOS/Dribbble spec style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white/95 backdrop-blur-md rounded-full px-5 py-3 shadow-[0_15px_45px_rgba(116,94,84,0.18)] border border-[#ede3da] flex items-center justify-around gap-2 select-none animate-slide-up">
        <button 
          onClick={() => setActiveTab('planner')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black font-display transition-all cursor-pointer ${
            activeTab === 'planner' 
              ? 'bg-gradient-to-r from-orange-500 to-[#fb7185] text-white shadow-md shadow-orange-100' 
              : 'text-[#745e54] hover:text-orange-500 hover:bg-[#fff9f4]'
          }`}
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>Cooking Plan</span>
        </button>

        <button 
          onClick={() => setActiveTab('assistant')} 
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black font-display transition-all cursor-pointer relative ${
            activeTab === 'assistant' 
              ? 'bg-gradient-to-r from-orange-500 to-[#fb7185] text-white shadow-md shadow-orange-100' 
              : 'text-[#745e54] hover:text-orange-500 hover:bg-[#fff9f4]'
          }`}
        >
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
          <span>Ask Chef Bot</span>
          
          {/* Unread dot notifications */}
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping absolute -top-1.5 -right-1" />
          <span className="w-2 h-2 bg-rose-500 rounded-full absolute -top-1.5 -right-1" />
        </button>
      </div>

    </div>
  );
}
