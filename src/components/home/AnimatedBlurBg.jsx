const AnimatedBlurBg = () => (
  <div
    className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
    style={{ background: "#05050C" }}
  >
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #020205 0%, #050512 40%, #0C061C 100%)",
      }}
    />
    <div
      className="absolute top-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full opacity-[0.15]"
      style={{
        background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)",
        filter: "blur(120px)",
        willChange: "auto",
      }}
    />
    <div
      className="absolute bottom-[-15%] right-[-15%] w-[80vw] h-[80vw] rounded-full opacity-[0.10]"
      style={{
        background: "radial-gradient(circle, #1e1b4b 0%, transparent 70%)",
        filter: "blur(140px)",
        willChange: "auto",
      }}
    />
    <div
      className="absolute top-[20%] right-[5%] w-[55vw] h-[55vw] rounded-full opacity-[0.07]"
      style={{
        background: "radial-gradient(circle, #5b21b6 0%, transparent 70%)",
        filter: "blur(120px)",
        willChange: "auto",
      }}
    />
  </div>
);
export default AnimatedBlurBg;
