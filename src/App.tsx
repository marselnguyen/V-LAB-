/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, User, ShoppingBag, ChevronLeft, ChevronRight, 
  Facebook, Instagram, Star, Filter, ChevronDown, MessageCircle, X, Send,
  ArrowRight, Heart, Zap, Award, Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  tag: string | null;
  rating: number;
  image: string;
  category: string;
}

// --- DATA ---
const announcements = [
  { text: "FREE SHIPPING FOR ORDERS OVER 2.000.000đ", link: "#" },
  { text: "NEW PICKLEBALL 2026 COLLECTION DROPPED", link: "#" },
  { text: "RPM Q2 RESTOCKING SOON - PRE-ORDER NOW", link: "#" }
];

const menuData = {
  "Vợt": {
    groups: {
      "A - C": ["1Six24", "Adidas", "AIREO", "Apes", "Avoura", "Bread & Butter🔥", "CRBN"],
      "D - H": ["Enhance", "Facolos", "Franklin", "Friday", "Gearbox", "Holbrook", "Honolulu🌟"],
      "J - L": ["JOOLA🔥", "Kamito", "Legendtek", "Leopard", "Leopik", "Luzz"],
      "M - Q": ["Maverix", "Negin", "Paddletek", "ProKennex", "Proton", "ProXR", "PIKKL"],
      "R - U": ["Ronbus", "RPM🌟", "Selkirk🔥", "Six Zero (6.0)", "Soxter", "Speedup🌟", "Sypik"],
      "T - Z": ["Thrive", "Vatic Pro", "Volair", "Vole🌟", "Wika", "Wilson", "Zocker🌟"]
    },
    banners: [
      { title: "FLASH SALE", subtitle: "UP TO 50% OFF", img: "https://images.unsplash.com/photo-1530915534664-4ac6423816b7?q=80&w=400&h=600&auto=format&fit=crop" },
      { title: "CLEARANCE", subtitle: "FROM 499k", img: "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  },
  "Bộ sưu tập": {
    groups: {
      "Season": ["Spring 2026", "Summer Vibes", "Autumn Classic", "Winter Pro"],
      "Edition": ["Carbon Black", "Limited Series", "Signature Pro", "Rookie Set"],
      "Event": ["Tournament Spec", "Grand Slam", "Open 2026", "V-LAB Origins"]
    },
    banners: [
      { title: "COLLECTION", subtitle: "2026 ARRIVALS", img: "https://images.unsplash.com/photo-1617083266333-5a5052feef92?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  },
  "Áo": {
    groups: {
      "Men": ["Pro Tees", "Performance Polos", "Compression", "Jackets"],
      "Women": ["Sport Skirts", "Fit Tanks", "Elite Bras", "Light Wraps"],
      "Tech": ["Dri-Fit Max", "AeroCool", "UV Shield", "OdorFree"]
    },
    banners: [
      { title: "APPAREL", subtitle: "NEW DESIGNS", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  },
  "Balo": {
    groups: {
      "Type": ["Tour Bags", "Backpacks", "Sling Bags", "Duffels"],
      "Size": ["Small (2 Rackets)", "Medium (6 Rackets)", "Large (12 Rackets)", "Pro XL"],
      "Brands": ["Selkirk", "JOOLA", "V-LAB Elite", "Franklin"]
    },
    banners: [
      { title: "EQUIPMENT", subtitle: "TOUR READY", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  },
  "Giày": {
    groups: {
      "Surface": ["All Court", "Hard Court", "Indoor / Clay"],
      "Fit": ["Wide Fit", "Standard", "Narrow / Speed"],
      "Tech": ["Carbon Plate", "Nitro Foam", "High Stability", "Lightweight"]
    },
    banners: [
      { title: "FOOTWEAR", subtitle: "PRO STABILITY", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  },
  "Bóng": {
    groups: {
      "Outdoor": ["X-40 Performance", "S1 Pro Extreme", "Core 40", "Power 40"],
      "Indoor": ["Quiet Bounce", "Practice 26", "Elite 26"],
      "Bulk": ["Case (100 Balls)", "Pack (12 Balls)", "Tube (3 Balls)"]
    },
    banners: [
      { title: "ACCESSORIES", subtitle: "PRO SPEC BALLS", img: "https://images.unsplash.com/photo-1612810806563-4cb8265db55f?q=80&w=400&h=600&auto=format&fit=crop" }
    ]
  }
};

const allProducts: Product[] = [
  { id: 1, name: "V-LAB Carbon Friction T700 Pro", brand: "V-LAB", price: 750000, oldPrice: 800000, tag: "Giảm 6%", rating: 5.0, image: "https://images.unsplash.com/photo-1612810806563-4cb8265db55f?q=80&w=400&h=500&auto=format&fit=crop", category: "Vợt" },
  { id: 2, name: "V-LAB PRO-X Power Air 14mm", brand: "V-LAB", price: 890000, oldPrice: 1850000, tag: "Newbie", rating: 4.8, image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400&h=500&auto=format&fit=crop", category: "Vợt" },
  { id: 3, name: "LEGENDTEK Vision Premium", brand: "Legendtek", price: 2150000, oldPrice: 2850000, tag: "Best Seller", rating: 5.0, image: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=400&h=500&auto=format&fit=crop", category: "Vợt" },
  { id: 4, name: "V-LAB Six Zero Quartz Limited", brand: "V-LAB", price: 2450000, oldPrice: null, tag: "Limited", rating: 5.0, image: "https://images.unsplash.com/photo-1617083266333-5a5052feef92?q=80&w=400&h=500&auto=format&fit=crop", category: "Vợt" },
  { id: 5, name: "AeroCool Tech Shirt", brand: "V-LAB", price: 450000, oldPrice: 600000, tag: "Hot", rating: 4.9, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400&h=500&auto=format&fit=crop", category: "Áo" },
  { id: 6, name: "Pro Tour Backpack 2026", brand: "Selkirk", price: 1250000, oldPrice: null, tag: "Premium", rating: 5.0, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&h=500&auto=format&fit=crop", category: "Balo" },
];

export default function App() {
  const [currentAnnounce, setCurrentAnnounce] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBrand, setFilterBrand] = useState("All");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: "Hello! I'm your V-LAB AI assistant. I can help you choose the perfect pickleball racket based on your skill level. Are you a beginner, intermediate, or pro?" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnounce((prev) => (prev + 1) % announcements.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    const newMessages = [...chatMessages, { role: 'user', text: msg } as const];
    setChatMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are V-LAB AI, an expert pickleball coach and equipment consultant. 
      The store is named V-LAB. You help users find the right equipment. 
      Keep answers short, professional, and sports-focused. 
      User said: ${msg}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setChatMessages([...newMessages, { role: 'assistant', text } as const]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages([...newMessages, { role: 'assistant', text: "Sorry, I'm experiencing some network issues. How can I help you otherwise?" } as const]);
    } finally {
      setIsTyping(false);
    }
  };

  const filteredProducts = allProducts
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = filterBrand === "All" || p.brand === filterBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const brands = Array.from(new Set(allProducts.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-white">
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="bg-vlab-black text-white h-8 flex items-center justify-between px-6 relative overflow-hidden text-[10px] font-bold tracking-widest uppercase">
        <button 
          onClick={() => setCurrentAnnounce((prev) => (prev - 1 + announcements.length) % announcements.length)}
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={14} />
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAnnounce}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2"
          >
            <span className="text-vlab-red">●</span>
            <a href={announcements[currentAnnounce].link} className="hover:text-vlab-red transition-colors">
              {announcements[currentAnnounce].text}
            </a>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={() => setCurrentAnnounce((prev) => (prev + 1) % announcements.length)}
          className="opacity-50 hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 2. HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Socials & Regions */}
          <div className="hidden lg:flex items-center space-x-5 w-1/4">
            <div className="flex space-x-3">
              <Facebook size={18} className="hover:text-vlab-red cursor-pointer transition-colors" />
              <Instagram size={18} className="hover:text-vlab-red cursor-pointer transition-colors" />
              <div className="border border-vlab-black px-1.5 py-0.5 text-[9px] font-black hover:bg-vlab-black hover:text-white cursor-pointer transition-all">TIKTOK</div>
            </div>
            <Globe size={18} className="text-gray-300" />
          </div>

          {/* LOGO */}
          <div className="w-1/2 lg:w-1/4 flex justify-start lg:justify-center">
            <h1 className="text-4xl font-black italic tracking-tighter hover:scale-105 transition-transform cursor-pointer select-none">
              V-LAB<span className="text-vlab-red">.</span>
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center justify-end space-x-6 w-1/2 lg:w-1/4">
            <div className="relative group flex items-center border border-gray-100 rounded-full px-4 py-2 hover:border-vlab-black transition-colors focus-within:border-vlab-black">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Find gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent text-xs font-medium focus:outline-none w-24 lg:w-32" 
              />
            </div>
            <User size={22} className="cursor-pointer hover:text-vlab-red transition-colors" />
            <div className="relative cursor-pointer hover:text-vlab-red transition-colors">
              <ShoppingBag size={22} />
              <span className="absolute -top-1.5 -right-1.5 bg-vlab-red text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">2</span>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION & MEGA MENU --- */}
        <nav className="flex justify-center border-t border-gray-50">
          <ul className="flex items-center space-x-10 text-[11px] font-black uppercase tracking-tighter py-3">
            {Object.keys(menuData).concat(["Phụ kiện", "Thông tin"]).map((cat) => (
              <li 
                key={cat}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center space-x-1 group">
                  <span className={`transition-colors ${hoveredCategory === cat ? 'text-vlab-red' : 'text-vlab-black/70 hover:text-vlab-red'}`}>
                    {cat}
                  </span>
                </div>
                
                {hoveredCategory === cat && <motion.div layoutId="underline" className="absolute -bottom-3 left-0 w-full h-[2px] bg-vlab-red" />}
              </li>
            ))}
          </ul>

          <AnimatePresence>
            {hoveredCategory && menuData[hoveredCategory as keyof typeof menuData] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="absolute top-full left-0 w-full bg-white border-t-2 border-vlab-red shadow-2xl py-12"
              >
                <div className="container mx-auto px-6 grid grid-cols-6 gap-10">
                  <div className="col-span-4 grid grid-cols-3 gap-8">
                    {Object.entries(menuData[hoveredCategory as keyof typeof menuData].groups).map(([groupName, items]) => (
                      <div key={groupName}>
                        <h4 className="text-gray-300 font-black text-xs mb-3 border-b pb-1 flex items-center justify-between">
                          {groupName}
                        </h4>
                        <ul className="text-[10px] space-y-2 font-bold">
                          {items.map((item: string) => (
                            <li key={item} className="text-gray-900 hover:text-vlab-red cursor-pointer transition-colors">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2 flex space-x-4">
                    {menuData[hoveredCategory as keyof typeof menuData].banners.map((banner: any, i: number) => (
                      <div key={i} className="relative group flex-1 h-[280px] overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                          src={banner.img} 
                          alt={banner.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700 blur-[1px] group-hover:blur-0" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-vlab-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                          <p className="text-[10px] text-vlab-red font-black tracking-widest uppercase mb-1">{banner.subtitle}</p>
                          <h5 className="text-xl text-white font-black italic tracking-tighter leading-none mb-3">{banner.title}</h5>
                          <button className="w-fit text-white text-[9px] font-black border-b border-white hover:border-vlab-red hover:text-vlab-red transition-all pb-1 uppercase">Shop Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* 3. HERO CALLOUT */}
      <section className="relative h-[25vh] bg-vlab-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=1200&h=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative text-center">
          <h2 className="text-4xl lg:text-6xl font-black italic text-white tracking-[0.1em]">MASTER THE COURT</h2>
          <p className="text-vlab-red text-xs font-black tracking-[0.4em] mt-2">V-LAB PERFORMANCE LAB 2026</p>
        </div>
      </section>

      {/* 4. PRODUCT CATALOG */}
      <main className="bg-vlab-bg-alt flex-1 px-8 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xl font-black italic uppercase leading-none">Danh sách sản phẩm</h2>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Pickleball Professional Gear</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="px-4 py-2 border border-black text-[9px] font-black uppercase rounded-full focus:outline-none appearance-none cursor-pointer hover:bg-black hover:text-white transition-all pr-8"
              >
                <option value="All">Bộ lọc</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-black text-[9px] font-black uppercase rounded-full focus:outline-none appearance-none cursor-pointer hover:bg-black hover:text-white transition-all"
            >
              <option value="default">Sắp xếp</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => addToRecentlyViewed(p)}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-white rounded-2xl overflow-hidden p-4 shadow-sm border border-transparent hover:border-black transition-all duration-300">
                <div className="h-full w-full bg-gray-50 rounded-xl flex items-center justify-center p-4">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-6 left-6">
                  {p.tag && (
                    <span className={`text-[8px] font-black px-2 py-1 rounded-full text-white ${p.tag.includes('%') || p.tag.toLowerCase().includes('hot') ? 'bg-vlab-red' : 'bg-vlab-black'} shadow-sm uppercase`}>
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" /> {p.rating.toFixed(1)}
                </div>

                {/* Animated CTA */}
                <div className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button className="w-full bg-black text-white text-[9px] font-black py-3 rounded-xl uppercase tracking-widest shadow-lg">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>

              <div className="mt-3 text-center px-1">
                <p className="text-[9px] font-black uppercase tracking-tighter line-clamp-1 group-hover:text-vlab-red transition-colors">{p.name}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-vlab-red text-xs font-black">{p.price.toLocaleString()}đ</span>
                  {p.oldPrice && <span className="text-gray-400 text-[9px] line-through font-medium">{p.oldPrice.toLocaleString()}đ</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* 5. RECENTLY VIEWED (Personalization) */}
      {recentlyViewed.length > 0 && (
        <section className="bg-white border-t p-4 flex items-center gap-6 overflow-hidden">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Bạn vừa xem</span>
          <div className="flex gap-4">
            {recentlyViewed.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-all group">
                <div className="w-8 h-8 bg-white rounded overflow-hidden">
                  <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-[7px] font-bold line-clamp-1 w-24 group-hover:text-vlab-red">{p.name}</p>
                  <p className="text-[7px] text-vlab-red font-black">{p.price.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. AI ASSISTANT (Chatbox) */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white shadow-2xl rounded-2xl border border-gray-100 w-64 overflow-hidden flex flex-col h-[400px]"
            >
              {/* Chat Header */}
              <div className="bg-vlab-black p-3 text-white flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black italic">V-LAB AI ASSISTANT</p>
                  <p className="text-[7px] text-gray-400">Tư vấn chọn vợt chuyên nghiệp</p>
                </div>
                <button onClick={() => setIsChatOpen(false)}>
                  <X size={14} className="hover:text-vlab-red transition-colors" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] px-3 py-2 rounded-lg text-[9px] font-medium leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-vlab-black text-white' 
                        : 'bg-white text-vlab-black shadow-sm border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-2 py-1.5 rounded-lg shadow-sm flex items-center space-x-1">
                      <span className="w-1 h-1 bg-vlab-red rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-vlab-red rounded-full animate-bounce delay-100"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-2 border-t flex items-center bg-white">
                <input 
                  type="text" 
                  placeholder="Nhập tin nhắn..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="text-[9px] flex-1 outline-none font-medium px-2" 
                />
                <button 
                  onClick={handleSendMessage}
                  className="text-vlab-red p-1 hover:scale-110 transition-transform"
                >
                  <Send size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-vlab-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative ring-4 ring-white"
        >
          {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
          {!isChatOpen && <div className="absolute top-0 right-0 w-3 h-3 bg-vlab-red border-2 border-white rounded-full"></div>}
        </motion.button>
      </div>

      {/* FOOTER */}
      <footer className="bg-vlab-black text-white pt-20 pb-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-20">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-black italic mb-6">V-LAB<span className="text-vlab-red">.</span></h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-8">Defying the standard of elite sports equipment. Engineered for those who take the court seriously.</p>
            <div className="flex space-x-4">
              <Facebook size={18} className="hover:text-vlab-red transition-colors cursor-pointer" />
              <Instagram size={18} className="hover:text-vlab-red transition-colors cursor-pointer" />
            </div>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-vlab-red mb-6">Categories</h5>
            <ul className="space-y-4 text-xs font-bold text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors">Vợt Pickleball</li>
              <li className="hover:text-white cursor-pointer transition-colors">Elite Apparel</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tour Bags</li>
              <li className="hover:text-white cursor-pointer transition-colors">Pro Balls</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-vlab-red mb-6">Support</h5>
            <ul className="space-y-4 text-xs font-bold text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors">Shipping & Returns</li>
              <li className="hover:text-white cursor-pointer transition-colors">Warranty Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Dealer Inquiries</li>
              <li className="hover:text-white cursor-pointer transition-colors">Custom Gear</li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-vlab-red mb-6">Join the Lab</h5>
            <p className="text-gray-400 text-[10px] mb-4">Get early access to drops and AI consultation tips.</p>
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-2">
              <input type="email" placeholder="Email address" className="bg-transparent flex-1 px-4 text-xs focus:outline-none" />
              <button className="bg-vlab-red text-white p-2 rounded-lg hover:translate-x-1 transition-transform">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest gap-4">
          <p>© 2026 V-LAB PERFORMANCE . ALL RIGHTS RESERVED</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
