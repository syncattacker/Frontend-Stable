"use client";
import { motion } from "framer-motion";

const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="fixed inset-0 flex items-center justify-center bg-[#0B0415]/90 backdrop-blur-md z-50"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1
      }}
      className="relative flex items-center justify-center h-80 w-80 rounded-[2rem] backdrop-blur-2xl bg-[#130725]/60 border border-purple-500/20 shadow-[0_0_50px_-12px_rgba(126,34,206,0.4)]"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut",
          delay: 0.3
        }}
        className="loader"
      >
        <span></span>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5,
          delay: 0.8
        }}
        className="font-roundo absolute inset-0 flex items-center justify-center text-purple-300 text-xs tracking-widest uppercase"
      >
        <div className="px-8 py-2 backdrop-blur-lg bg-[#1A0B2E]/80 rounded-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] animate-glitch border border-purple-500/30 whitespace-nowrap text-center">
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Getting things ready for you
          </motion.span>
        </div>
      </motion.div>
    </motion.div>

    <style jsx>{`
      .loader {
        position: relative;
        width: 150px;
        height: 150px;
        background: transparent;
        border-radius: 50%;
        box-shadow: 0 0 40px rgba(126, 34, 206, 0.15), inset 0 0 20px rgba(126, 34, 206, 0.1);
        border: 1px solid rgba(147, 51, 234, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .loader::before {
        content: "";
        position: absolute;
        inset: 20px;
        background: transparent;
        border: 1px dashed rgba(168, 85, 247, 0.3);
        border-radius: 50%;
        box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.5),
          inset 5px 5px 35px rgba(147, 51, 234, 0.1);
      }

      .loader::after {
        content: "";
        position: absolute;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px dashed rgba(168, 85, 247, 0.3);
        box-shadow: inset -5px -5px 25px rgba(0, 0, 0, 0.5),
          inset 5px 5px 35px rgba(147, 51, 234, 0.1);
      }

      .loader span {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 100%;
        background: transparent;
        transform-origin: top left;
        animation: radar81 2s linear infinite;
        border-top: 1px dashed #fff;
      }

      .loader span::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #a855f7;
        transform-origin: top left;
        transform: rotate(-55deg);
        filter: blur(30px) drop-shadow(20px 20px 20px #9333ea);
      }

      @keyframes radar81 {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </motion.div>
);

export default Loader;