import { useState, useEffect } from 'react';
import { CookingPlan, PlanOptions } from '../types';
import { Coffee, Sun, Moon, ShoppingCart, RefreshCcw, Wallet, CheckCircle, AlertTriangle, AlertCircle, Heart, Star, Clock, IndianRupee, ArrowRight } from 'lucide-react';

interface ResultsViewProps {
  plan: CookingPlan;
  options: PlanOptions;
}

// Map real visual food covers to match delicious look depending on meal title of Indian / Global food
const getMealImage = (mealTitle: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
  const norm = mealTitle.toLowerCase();
  if (norm.includes('oat') || norm.includes('porridge') || norm.includes('muesli')) {
    return "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=400&q=80"; // Oats Bowl
  }
  if (norm.includes('poha') || norm.includes('upma') || norm.includes('idli') || norm.includes('dosa')) {
    return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80"; // South indian premium Dosa / Poha look
  }
  if (norm.includes('egg') || norm.includes('scramble') || norm.includes('omelette')) {
    return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80"; // Premium Eggs
  }
  if (norm.includes('sandwich') || norm.includes('toast') || norm.includes('bread')) {
    return "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80"; // Club Sandwich toast
  }
  if (norm.includes('pulao') || norm.includes('rice') || norm.includes('biryani') || norm.includes('khichdi')) {
    return "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80"; // Rice dish
  }
  if (norm.includes('paneer') || norm.includes('tofu') || norm.includes('curry') || norm.includes('kadai') || norm.includes('masala')) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80"; // Paneer dish / Indian Curry
  }
  if (norm.includes('pasta') || norm.includes('spaghetti') || norm.includes('noodle')) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"; // Pasta Bolognese
  }
  if (norm.includes('wrap') || norm.includes('roll') || norm.includes('taco') || norm.includes('quesadilla')) {
    return "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=400&q=80"; // Wrap / Shawarma Roll
  }
  if (norm.includes('dal') || norm.includes('soup') || norm.includes('stew') || norm.includes('lentil')) {
    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80"; // Warm stew
  }

  // Fallbacks per meal type
  if (mealType === 'breakfast') {
    return "https://images.unsplash.com/photo-1496042399014-dc73c4f2bde1?auto=format&fit=crop&w=400&q=80";
  } else if (mealType === 'lunch') {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80";
  } else {
    return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80";
  }
};

export function ResultsView({ plan, options }: ResultsViewProps) {
  // Grocery list checkbox checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedItems({});
  }, [plan]);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleFavorite = (mealName: string) => {
    setFavorites(prev => ({ ...prev, [mealName]: !prev[mealName] }));
  };

  const getBudgetInsight = () => {
    const cost = plan.estimatedCost;
    const limit = options.budget;
    const diff = limit - cost;

    if (diff > 0) {
      return {
        status: "Within Budget",
        color: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
        barColor: "bg-emerald-500",
        message: `Perfect! Saved ₹${diff} from your target daily limit.`
      };
    } else if (diff === 0) {
      return {
        status: "Near Budget",
        color: "amber",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-100",
        barColor: "bg-amber-500",
        message: "Exactly aligned! Hit your custom limit perfectly."
      };
    } else {
      return {
        status: "Over Budget",
        color: "rose",
        badgeBg: "bg-rose-50 text-rose-800 border-rose-100",
        barColor: "bg-[#fb7185]",
        message: `Running ₹${Math.abs(diff)} over. Chef PlanBot suggests looking for smart substitutions below.`
      };
    }
  };

  const insight = getBudgetInsight();

  // Simulated ratings/prep time determinations matching nice premium card design
  const getSimulatedDetails = (mealTitle: string, index: number) => {
    const sum = mealTitle.length + index;
    const rating = (4.5 + (sum % 5) * 0.1).toFixed(1);
    const cookTime = 15 + (sum % 3) * 5;
    return { rating, cookTime };
  };

  const bMeta = getSimulatedDetails(plan.breakfast, 1);
  const lMeta = getSimulatedDetails(plan.lunch, 2);
  const dMeta = getSimulatedDetails(plan.dinner, 3);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Visual Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black font-display text-gray-900 tracking-tight flex items-center gap-2">
            <span>✨ Crafted Chef Menu</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium font-display">Fresh recipes customized to your ingredients and budget limit.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#faf5f0] border border-[#f0eae4] rounded-2xl p-1.5 self-start">
          <span className="text-xs font-black font-display text-orange-700 bg-orange-100/70 rounded-xl px-3 py-1">
            {options.people} {options.people === 1 ? 'Guest' : 'Guests'}
          </span>
          <span className="text-xs font-black font-display text-[#796356] bg-white rounded-xl px-3 py-1 shadow-2xs">
            🕒 {options.time}m Max Cook
          </span>
        </div>
      </div>

      {/* Modern Card-Based Architecture: Meal Recipe Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Breakfast Card */}
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Food Image cover */}
            <div className="relative h-44 overflow-hidden bg-orange-100/40">
              <img
                src={getMealImage(plan.breakfast, 'breakfast')}
                alt={plan.breakfast}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-[#fff9f6] text-orange-700 text-[10px] font-black font-display rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs">
                  <Coffee className="w-3 h-3 text-orange-500" /> Breakfast
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-amber-700 text-[10px] font-black font-display rounded-full px-2 py-1 shadow-xs flex items-center gap-0.5">
                  ⭐ {bMeta.rating}
                </span>
              </div>
              
              <button 
                onClick={() => toggleFavorite(plan.breakfast)}
                className="absolute top-3 right-3 bg-white/95 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors shadow-sm"
              >
                <Heart className={`w-3.5 h-3.5 ${favorites[plan.breakfast] ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold font-display flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3 h-3 text-orange-300" /> {bMeta.cookTime} mins
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold font-display text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                {plan.breakfast}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Perfect quick visual protein-packed recipe tailored for a healthy start of the morning.
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 border-t border-gray-50/80 flex items-center justify-between text-[11px] font-bold text-gray-400">
             <span>Estimated cost</span>
             <span className="text-[#a47b5f] font-extrabold text-sm">₹{Math.round(plan.estimatedCost * 0.25)}</span>
          </div>
        </div>

        {/* Lunch Card */}
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Food Image cover */}
            <div className="relative h-44 overflow-hidden bg-blue-100/40">
              <img
                src={getMealImage(plan.lunch, 'lunch')}
                alt={plan.lunch}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-[#f5f9ff] text-blue-700 text-[10px] font-black font-display rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs">
                  <Sun className="w-3 h-3 text-blue-500" /> Lunch
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-amber-700 text-[10px] font-black font-display rounded-full px-2 py-1 shadow-xs flex items-center gap-0.5">
                  ⭐ {lMeta.rating}
                </span>
              </div>
              
              <button 
                onClick={() => toggleFavorite(plan.lunch)}
                className="absolute top-3 right-3 bg-white/95 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors shadow-sm"
              >
                <Heart className={`w-3.5 h-3.5 ${favorites[plan.lunch] ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold font-display flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3 h-3 text-blue-300" /> {lMeta.cookTime} mins
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold font-display text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                {plan.lunch}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                High energy, balanced lunch recipe structured to lock in taste and nutrients efficiently.
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 border-t border-gray-50/80 flex items-center justify-between text-[11px] font-bold text-gray-400">
             <span>Estimated cost</span>
             <span className="text-[#a47b5f] font-extrabold text-sm">₹{Math.round(plan.estimatedCost * 0.45)}</span>
          </div>
        </div>

        {/* Dinner Card */}
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Food Image cover */}
            <div className="relative h-44 overflow-hidden bg-purple-100/40">
              <img
                src={getMealImage(plan.dinner, 'dinner')}
                alt={plan.dinner}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-[#faf5ff] text-purple-700 text-[10px] font-black font-display rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs">
                  <Moon className="w-3 h-3 text-purple-500" /> Dinner
                </span>
                <span className="bg-white/90 backdrop-blur-xs text-amber-700 text-[10px] font-black font-display rounded-full px-2 py-1 shadow-xs flex items-center gap-0.5">
                  ⭐ {dMeta.rating}
                </span>
              </div>
              
              <button 
                onClick={() => toggleFavorite(plan.dinner)}
                className="absolute top-3 right-3 bg-white/95 text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors shadow-sm"
              >
                <Heart className={`w-3.5 h-3.5 ${favorites[plan.dinner] ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <span className="text-white text-xs font-bold font-display flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-lg">
                  <Clock className="w-3 h-3 text-purple-300" /> {dMeta.cookTime} mins
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-5 space-y-2">
              <h4 className="text-base font-bold font-display text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
                {plan.dinner}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                Satiating evening dinner. Light on stomach and resource-saving for late night cook routines.
              </p>
            </div>
          </div>

          <div className="px-5 pb-5 pt-2 border-t border-gray-50/80 flex items-center justify-between text-[11px] font-bold text-gray-400">
             <span>Estimated cost</span>
             <span className="text-[#a47b5f] font-extrabold text-sm">₹{Math.round(plan.estimatedCost * 0.3)}</span>
          </div>
        </div>

      </div>

      {/* Groceries Checklist & Financial Analysis Section */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        
        {/* GROCERY CHECKLIST (with clean rounded checklist chips) */}
        <div className="bg-white rounded-[2rem] p-6 lg:p-7 border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.015)] flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4 select-none">
            <div className="flex items-center gap-2 text-gray-850">
               <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <ShoppingCart className="w-5 h-5" />
               </div>
               <h3 className="font-extrabold font-display text-lg tracking-tight">Shopping Groceries</h3>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100/60 rounded-full px-2.5 py-1">
              Tap items to cross out
            </span>
          </div>

          <p className="text-[11px] text-gray-400 font-medium mb-3.5 leading-relaxed">
            Consolidated shopping list created for {options.people} {options.people === 1 ? 'person' : 'people'}. Existing ingredients from your pantry were automatically deducted.
          </p>

          <div className="flex flex-wrap gap-2 py-2 select-none">
            {plan.groceryList.map((item, idx) => {
              const isChecked = !!checkedItems[item];
              return (
                <button
                  key={idx} 
                  onClick={() => toggleCheck(item)}
                  type="button"
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold font-display border transition-all duration-200 flex items-center gap-2 ${
                    isChecked 
                      ? 'bg-emerald-50 text-emerald-700/60 border-emerald-150 line-through' 
                      : 'bg-orange-50/20 text-[#6B5A51] border-[#fbf2ec] hover:border-orange-200 hover:bg-orange-50/40 shadow-2xs'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center text-[8px] ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
                  }`}>
                    {isChecked ? "✓" : ""}
                  </span>
                  <span>{item}</span>
                </button>
              );
            })}
            {plan.groceryList.length === 0 && (
              <p className="text-gray-400 italic text-sm text-center py-6 w-full">No extra groceries needed today!</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          
          {/* BUDGET ANALYSIS & COST FEASIBILITY CARD */}
          <div className="bg-white rounded-[2rem] p-6 lg:p-7 border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.015)] relative overflow-hidden">
             
             {/* Tiny soft background spot */}
             <div className="absolute top-0 right-0 w-36 h-36 bg-gray-50 rounded-full blur-3xl -z-1" />

             <div className="flex items-center justify-between border-b border-gray-50 pb-4 mb-4">
               <div className="flex items-center gap-2 text-gray-850">
                 <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 animate-pulse">
                    <Wallet className="w-5 h-5" />
                 </div>
                 <h3 className="font-extrabold font-display text-lg tracking-tight">Budget Feasibility</h3>
               </div>
               
               {/* Visual Pill Indicator: Green = Within Budget, Orange = Near, Red = Over */}
               <span className={`text-[10px] font-black font-display border px-3 py-1 rounded-full uppercase tracking-wider ${insight.badgeBg}`}>
                 {insight.status}
               </span>
             </div>

             <div className="grid grid-cols-3 gap-3 my-4">
               {/* Estimated Cost */}
               <div className="bg-[#faf5f0]/40 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estimated Cost</span>
                  <span className="text-xl font-black text-gray-900 font-display mt-1 block">₹{plan.estimatedCost}</span>
               </div>
               
               {/* User budget limit */}
               <div className="bg-[#faf5f0]/45 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Your Limit</span>
                  <span className="text-xl font-bold text-gray-500 font-display mt-1 block">₹{options.budget}</span>
               </div>

               {/* Remaining balance */}
               <div className="bg-[#faf5f0]/40 p-3 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Remaining</span>
                  <span className={`text-xl font-black font-display mt-1 block ${options.budget >= plan.estimatedCost ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {options.budget >= plan.estimatedCost ? '₹' + (options.budget - plan.estimatedCost) : '-₹' + Math.abs(options.budget - plan.estimatedCost)}
                  </span>
               </div>
             </div>

             {/* Dynamic feedback notice */}
             <p className="text-[11px] font-medium text-gray-400 leading-relaxed mt-2.5">
               {insight.message}
             </p>

             {/* Beautiful Gradient Progress Bar */}
             <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${insight.barColor}`}
                  style={{ width: `${Math.min(100, (plan.estimatedCost / options.budget) * 100)}%` }}
                />
             </div>
          </div>

          {/* INGREDIENT SUBSTITUTIONS USING COMPARISON CARDS */}
          <div className="bg-white rounded-[2rem] p-6 lg:p-7 border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.015)]">
            <div className="flex items-center gap-2 text-gray-850 mb-4 border-b border-gray-50 pb-4">
               <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <RefreshCcw className="w-5 h-5 text-amber-500" />
               </div>
               <h3 className="font-extrabold font-display text-lg tracking-tight">Chef Substitutions</h3>
            </div>

            <p className="text-[11px] text-gray-400 font-medium mb-3.5 leading-relaxed">
              Chef-recommended diet alternatives for ingredients based on active budget or allergies.
            </p>

            {plan.substitutions.length > 0 ? (
              <div className="grid gap-2 outline-none">
                {plan.substitutions.map((sub, idx) => {
                   const segments = sub.split('->');
                   const fromIng = segments[0]?.trim() || sub;
                   const toIng = segments[1]?.trim() || '';
                   
                   return (
                     <div key={idx} className="flex items-center justify-between text-sm bg-gradient-to-r from-orange-50/20 to-orange-50/40 border border-orange-100/40 p-3.5 rounded-2xl hover:scale-[1.01] transition-transform">
                        <span className="font-extrabold text-[#745e54] font-display">{fromIng}</span>
                        {toIng && (
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase font-bold text-orange-500 font-display flex items-center gap-1 bg-orange-100/50 px-2 py-0.5 rounded-lg">
                              Swap with <ArrowRight className="w-2.5 h-2.5 text-orange-600 inline-block" />
                            </span>
                            <span className="font-extrabold text-emerald-800 bg-[#effff1] border border-emerald-100/75 px-3 py-1 rounded-xl">
                              {toIng}
                            </span>
                          </div>
                        )}
                     </div>
                   );
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm py-4 text-center">No precise substitutions generated for this recipe block!</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
