'use client';
import { motion } from 'framer-motion';

export const SIINVisual = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-neutral-50 group-hover:bg-neutral-100 transition-colors duration-500">
      <div className="absolute inset-0 opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#002FA7] rounded-full"
            style={{
              width: Math.random() * 10 + 4 + "px",
              height: Math.random() * 10 + 4 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
          />
        ))}
         <svg className="absolute inset-0 w-full h-full stroke-[#002FA7] opacity-30" style={{strokeWidth: 0.5}}>
             <line x1="10%" y1="20%" x2="40%" y2="50%" />
             <line x1="40%" y1="50%" x2="80%" y2="30%" />
             <line x1="20%" y1="80%" x2="40%" y2="50%" />
         </svg>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-2">
         <div className="w-24 h-24 rounded-full border border-[#002FA7]/20 flex items-center justify-center bg-white shadow-sm relative">
             <div className="absolute inset-0 rounded-full border border-[#002FA7]/10 animate-ping" />
             <div className="w-3 h-3 bg-[#002FA7] rounded-full" />
         </div>
      </div>
    </div>
  );
};

export const MAANGVisual = () => {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-white group-hover:bg-gray-50 transition-colors duration-500">
      <div className="grid grid-cols-7 gap-1 opacity-50">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-[2px] ${
              Math.random() > 0.6 ? "bg-[#002FA7]" : "bg-gray-100"
            }`}
            style={{ opacity: Math.random() * 0.5 + 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export const AuthVisual = () => {
  return (
    <div className="absolute inset-0 bg-[#1e1e1e] p-4 font-mono text-xs overflow-hidden flex flex-col">
       <div className="flex gap-1.5 mb-3 opacity-50">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
       </div>
       <div className="flex flex-col gap-1 text-green-400 opacity-80">
          <span className="opacity-50">$ init pentest --target api</span>
          <span>&gt; Scanning ports...</span>
          <span className="text-yellow-400">&gt; [WARN] Auth bypass detected</span>
          <span className="animate-pulse">_</span>
       </div>
    </div>
  );
};

export const ConstructionVisual = () => {
   return (
    <div className="absolute inset-0 bg-[#F5F5F7] flex items-center justify-center overflow-hidden">
        {/* Abstract "Swipe" Cards */}
        <div className="relative w-32 h-40">
            <div className="absolute inset-0 bg-neutral-200 rounded-xl rotate-[-12deg] border border-neutral-300 transform origin-bottom-left" />
            <div className="absolute inset-0 bg-neutral-300 rounded-xl rotate-[-6deg] border border-neutral-400 transform origin-bottom-left" />
            <div className="absolute inset-0 bg-white rounded-xl shadow-lg border border-neutral-200 flex flex-col items-center justify-center p-2 group-hover:rotate-[12deg] transform transition-transform duration-500 origin-bottom-left z-10">
                <div className="w-12 h-12 bg-[#002FA7]/10 rounded-full mb-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#002FA7] rounded-full animate-ping" />
                </div>
                <div className="w-16 h-2 bg-neutral-100 rounded-full mb-1" />
                <div className="w-10 h-2 bg-neutral-100 rounded-full" />
            </div>
             {/* Dynamic Construction Label */}
             <div className="absolute -bottom-8 left-0 right-0 text-center">
                 <span className="font-mono text-[10px] font-bold text-[#002FA7] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Swipe to Connect
                 </span>
            </div>
        </div>
    </div>
   )
}
