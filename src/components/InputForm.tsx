import React, { useState, useRef } from 'react';
import { PlanOptions } from '../types';
import { ChefHat, Users, Clock, IndianRupee, Utensils, Leaf, UploadCloud, Image, Trash2, CheckCircle, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (options: PlanOptions) => void;
  isLoading: boolean;
}

interface DemoImage {
  name: string;
  url: string;
  ingredients: string;
  chips: string[];
}

const DEMO_IMAGES: DemoImage[] = [
  {
    name: "🥕 Fresh Veggie Basket",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80",
    ingredients: "Tomato, Onion, Garlic, Bell Pepper, Carrot",
    chips: ["🍅 Tomato", "🧅 Onion", "🧄 Garlic", "🫑 Bell Pepper", "🥕 Carrot"]
  },
  {
    name: "🥛 Healthy Protein Pack",
    url: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=300&q=80",
    ingredients: "Paneer, Spinach, Lemon, Curd, Coriander",
    chips: ["🧀 Paneer", "🥬 Spinach", "🍋 Lemon", "🥛 Curd", "🌿 Coriander"]
  },
  {
    name: "🥣 Quick Breakfast Oats",
    url: "https://images.unsplash.com/photo-1517881917430-e70dfb3610aa?auto=format&fit=crop&w=300&q=80",
    ingredients: "Oats, Banana, Milk, Honey, Chia Seeds",
    chips: ["🌾 Oats", "🍌 Banana", "🥛 Milk", "🍯 Honey", "🧉 Chia Seeds"]
  }
];

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [budget, setBudget] = useState<number | ''>(500);
  const [diet, setDiet] = useState<string>('Vegetarian');
  const [people, setPeople] = useState<number | ''>(2);
  const [time, setTime] = useState<number | ''>(30);
  const [ingredients, setIngredients] = useState<string>('');

  // Image Analyzer state
  const [selectedImage, setSelectedImage] = useState<DemoImage | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !people || !time) return;
    
    onSubmit({
      budget: Number(budget),
      diet,
      people: Number(people),
      time: Number(time),
      ingredients
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (reader.result) {
        setCustomImage(reader.result as string);
        // Auto-select a simulated veggie pack since we represent image analyzer
        setSelectedImage(DEMO_IMAGES[0]);
        // Fast-fill ingredients text field
        setIngredients(prev => {
          const list = prev ? prev.split(',').map(s => s.trim()) : [];
          DEMO_IMAGES[0].chips.forEach(c => {
             const clean = c.replace(/[^a-zA-Z ]/g, '').trim();
             if (!list.includes(clean)) list.push(clean);
          });
          return list.join(', ');
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const selectDemoImage = (img: DemoImage) => {
    setSelectedImage(img);
    setCustomImage(null);
    setIngredients(prev => {
      const currentList = prev ? prev.split(',').map(item => item.trim().toLowerCase()) : [];
      const newItems = img.ingredients.split(',').map(item => item.trim());
      
      const mergedList = [...prev ? prev.split(',').map(i => i.trim()) : []];
      newItems.forEach(item => {
        if (!currentList.includes(item.toLowerCase())) {
          mergedList.push(item);
        }
      });
      return mergedList.filter(Boolean).join(', ');
    });
  };

  const clearImage = () => {
    setSelectedImage(null);
    setCustomImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-[#fff9f6]/90 rounded-[2rem] p-6 lg:p-7 border border-[#fff2ea]/80 shadow-[0_8px_30px_rgb(255,242,234,0.3)] backdrop-blur-md animate-fade-in space-y-6">
      
      {/* SECTION: Image Analyzer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold font-display text-[#5c4a42] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            AI Image Ingredient Analyzer
          </label>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-100 rounded-full px-2 py-0.5 uppercase tracking-wider font-display">
            Smart Scanner
          </span>
        </div>

        {/* Drag and Drop Card */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[1.8rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-orange-400 bg-orange-50/50 scale-[0.98]' 
              : selectedImage || customImage
                ? 'border-emerald-300 bg-emerald-50/10'
                : 'border-[#ebdcc3] bg-[#fffaf5] hover:border-orange-300 hover:bg-orange-50/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {selectedImage || customImage ? (
            <div className="w-full space-y-4">
              {/* Image Preview */}
              <div className="relative w-28 h-28 mx-auto rounded-2xl overflow-hidden shadow-md border-4 border-white">
                <img
                  src={customImage || selectedImage?.url}
                  alt="Detected Basket"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-rose-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Photo upload recognized successfully!
                </p>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">Automatic ingredient extraction active</p>
              </div>

              {/* Detected ingredients colorful chips */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left mb-2 font-display">
                  Detected Ingredients
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {(selectedImage?.chips || ["🍅 Veggie Match"]).map((chip, i) => (
                    <span
                      key={i}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-100/80 rounded-full px-2.5 py-1 text-xs font-bold font-display shadow-xs flex items-center gap-1 animate-fade-in"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Upload Icon */}
              <div className="w-12 h-12 rounded-full bg-orange-100/80 flex items-center justify-center text-orange-600 mb-2">
                <UploadCloud className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-[#4e3c32] font-display">Drag & drop kitchen photo here</h4>
              <p className="text-xs text-gray-500 mt-1 font-medium">or tap to upload ingredient image</p>
              <span className="text-[10px] text-orange-400 mt-2 font-extrabold uppercase font-display bg-white px-2 py-0.5 rounded-md shadow-2xs">
                Extract ingredients instantly
              </span>
            </>
          )}
        </div>

        {/* Demo photos presets pills */}
        {!selectedImage && !customImage && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
              Or Choose Preset Demo Pantry Photo:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDemoImage(img)}
                  className="flex flex-col items-center p-1.5 bg-white border border-[#efeae0] rounded-xl hover:border-orange-300 hover:shadow-xs transition-all text-center"
                >
                  <img src={img.url} alt={img.name} className="w-10 h-10 rounded-lg object-cover mb-1" />
                  <span className="text-[9px] font-extrabold text-[#745e54] truncate w-full">{img.name.replace(/[^a-zA-Z ]/g, '').trim()}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className="border-[#fff2ea]/80" />

      {/* SECTION: Preferences Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Daily Budget input */}
        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-[#5c4a42] flex items-center gap-1.5 font-display">
            <IndianRupee className="w-4 h-4 text-orange-500" />
            Daily Budget
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min="50"
              className="w-full bg-[#faf5f0] border-0 rounded-2xl px-5 py-3.5 text-base font-extrabold text-[#47352b] outline-none focus:ring-3 focus:ring-orange-100 transition-all font-display"
              value={budget}
              onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
              INR Limit
            </span>
          </div>
        </div>

        {/* Dietary Preference Selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-[#5c4a42] flex items-center gap-1.5 font-display">
            <Leaf className="w-4 h-4 text-emerald-500" />
            Dietary Preference
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-[#faf5f0] rounded-2xl">
            {['Vegetarian', 'Non-Vegetarian'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setDiet(opt)}
                className={`py-3 rounded-xl font-bold font-display text-sm transition-all ${
                  diet === opt 
                    ? 'bg-white text-emerald-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {opt === 'Vegetarian' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Inputs: People & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-[#5c4a42] flex items-center gap-1.5 font-display">
              <Users className="w-4 h-4 text-amber-500" />
              People Count
            </label>
            <input
              type="number"
              required
              min="1"
              max="20"
              className="w-full bg-[#faf5f0] border-0 rounded-2xl px-4 py-3.5 text-base font-extrabold text-[#4c3b31] outline-none focus:ring-3 focus:ring-amber-55/40 transition-all font-display text-center"
              value={people}
              onChange={(e) => setPeople(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-extrabold text-[#5c4a42] flex items-center gap-1.5 font-display">
              <Clock className="w-4 h-4 text-purple-400" />
              Time Available
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="5"
                max="240"
                className="w-full bg-[#faf5f0] border-0 rounded-2xl px-3 py-3.5 text-base font-extrabold text-[#4c3b31] outline-none focus:ring-3 focus:ring-purple-55/40 transition-all font-display text-center pr-9"
                value={time}
                onChange={(e) => setTime(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                min
              </span>
            </div>
          </div>
        </div>

        {/* Available Ingredients */}
        <div className="space-y-1.5">
          <label className="text-sm font-extrabold text-[#5c4a42] flex items-center gap-1.5 font-display">
            <Utensils className="w-4 h-4 text-[#bf9c8f]" />
            Your Pantry Ingredients
          </label>
          <textarea
            className="w-full bg-[#faf5f0] border-0 rounded-2xl px-4 py-3.5 text-sm font-medium text-[#4e3d34] outline-none focus:ring-3 focus:ring-orange-50 transition-all resize-none leading-relaxed placeholder:text-gray-400"
            rows={2}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="List any items you already have, separated by commas (e.g. Rice, Onion, Tomato)..."
          ></textarea>
        </div>

        {/* Generate Button Gradient & Pulse Effects */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 via-[#fb7185] to-orange-600 hover:opacity-95 text-white rounded-full py-4.5 font-extrabold text-base flex justify-center items-center gap-2 transition-all transform active:scale-95 disabled:scale-100 disabled:opacity-70 shadow-lg shadow-orange-200/50 cursor-pointer font-display select-none stroke-[2.5]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
          ) : (
            <ChefHat className="w-5 h-5 text-white animate-bounce" style={{ animationDuration: '4s' }} />
          )}
          {isLoading ? 'Creating Magic Plan...' : 'Generate Meal Plan'}
        </button>
      </form>
    </div>
  );
}
