'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Cone, X, ArrowRight } from 'lucide-react';

interface ConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConstructionModal = ({ isOpen, onClose }: ConstructionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FFFF00] text-black w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative border-4 border-black"
            >
              {/* Construction Stripes */}
              <div className="h-4 w-full bg-[repeating-linear-gradient(45deg,black,black_10px,#FFFF00_10px,#FFFF00_20px)] border-b-4 border-black" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-black text-white rounded-full hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-8 pt-10 text-center">
                <div className="bg-black text-[#FFFF00] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Cone className="w-8 h-8" />
                </div>
                
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Still Cooking...</h3>
                <p className="font-mono text-sm font-bold mb-8 max-w-[80%] mx-auto">
                  Findora is currently under active development. It's going to be big.
                </p>

                <div className="flex flex-col gap-3">
                  <a 
                    href="mailto:shyamrathore013@gmail.com"
                    className="flex items-center justify-center gap-2 bg-black text-white font-bold py-4 rounded-xl hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all active:translate-y-[0px] active:shadow-none"
                  >
                    Connect for Details <ArrowRight className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={onClose}
                    className="font-mono text-xs font-bold uppercase tracking-wider hover:underline p-2"
                  >
                    Close
                  </button>
                </div>
              </div>

               {/* Construction Stripes Bottom */}
               <div className="h-4 w-full bg-[repeating-linear-gradient(45deg,black,black_10px,#FFFF00_10px,#FFFF00_20px)] border-t-4 border-black" />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
