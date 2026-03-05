"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";
import watermark from "@/img/f2.svg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const numberVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 12 } },
};
const lineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { width: "8rem", opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
};
const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const NotFound = ({ onOpenSignUp, onOpenLogin }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white font-outfit selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar onOpenSignUp={onOpenSignUp} onOpenLogin={onOpenLogin} />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <motion.main
        className="relative z-10 grow flex items-center justify-center px-4 pt-32 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
          <Image src={watermark} alt="gopwnit" fill className="object-contain" priority={false} />
        </div>

        <div className="max-w-lg w-full text-center relative z-10">
          <motion.section className="mb-12" variants={itemVariants}>
            <motion.h1
              className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-purple-400 to-purple-800 mb-6 tracking-tight font-roundo"
              variants={numberVariants}
              aria-label="404 Error"
            >
              404
            </motion.h1>
            <motion.div
              className="w-32 h-0.5 bg-linear-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
              variants={lineVariants}
              role="presentation"
            />
          </motion.section>

          <motion.section className="mb-12" variants={itemVariants}>
            <motion.h2
              className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6"
              variants={itemVariants}
            >
              Page Not Found
            </motion.h2>
            <motion.p
              className="text-zinc-400 text-xl leading-relaxed font-medium max-w-md mx-auto"
              variants={itemVariants}
            >
              The page you&apos;re looking for has vanished into the digital void.
            </motion.p>
          </motion.section>

          <motion.section className="mb-16" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <motion.button
                onClick={() => router.back()}
                className="w-full sm:w-auto min-w-45 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl transition-all duration-300"
                variants={buttonVariants}
                whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label="Go back to previous page"
              >
                Go Back
              </motion.button>
              <motion.button
                onClick={() => router.push("/")}
                className="w-full sm:w-auto min-w-45 border border-white/10 text-white font-black uppercase tracking-widest text-xs py-5 px-8 rounded-2xl transition-all duration-300 backdrop-blur-md bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-500/30"
                variants={buttonVariants}
                whileHover={{ scale: 1.02, y: -4, borderColor: "rgba(168, 85, 247, 0.4)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label="Return to homepage"
              >
                Return Home
              </motion.button>
            </div>
          </motion.section>

          <motion.footer
            className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 space-y-4 pt-10 border-t border-white/5"
            variants={itemVariants}
            role="contentinfo"
          >
            <p>Error Code: Protocol_404</p>
            <p className="leading-relaxed">
              Need assistance? <br />
              <a href="mailto:gopwnit@gmail.com" className="text-purple-500/60 hover:text-purple-500 transition-colors">
                Contact our support team - gopwnit@gmail.com
              </a>
            </p>
          </motion.footer>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default NotFound;