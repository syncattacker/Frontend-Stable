// const AnimatedBlurBg = () => (
//   <div
//     className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
//     style={{ background: "#05050C" }}
//   >
//     <div
//       className="absolute inset-0"
//       style={{
//         background:
//           "linear-gradient(135deg, #020205 0%, #050512 40%, #0C061C 100%)",
//       }}
//     />
//     <div
//       className="absolute top-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full opacity-[0.15]"
//       style={{
//         background: "radial-gradient(circle, #4c1d95 0%, transparent 70%)",
//         filter: "blur(120px)",
//         willChange: "auto",
//       }}
//     />
//     <div
//       className="absolute bottom-[-15%] right-[-15%] w-[80vw] h-[80vw] rounded-full opacity-[0.10]"
//       style={{
//         background: "radial-gradient(circle, #1e1b4b 0%, transparent 70%)",
//         filter: "blur(140px)",
//         willChange: "auto",
//       }}
//     />
//     <div
//       className="absolute top-[20%] right-[5%] w-[55vw] h-[55vw] rounded-full opacity-[0.07]"
//       style={{
//         background: "radial-gradient(circle, #5b21b6 0%, transparent 70%)",
//         filter: "blur(120px)",
//         willChange: "auto",
//       }}
//     />
//   </div>
// );
// export default AnimatedBlurBg;

const AnimatedBlurBg = () => (
  <div
    className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
    style={{ background: "#0A0A0A" }}
  >
    {/* Base gradient — pure near-blacks */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #0d0d0d 40%, #111111 100%)",
      }}
    />

    {/* Top-left glow — very faint warm white */}
    <div
      className="absolute top-[-15%] left-[-15%] w-[70vw] h-[70vw] rounded-full opacity-[0.04]"
      style={{
        background: "radial-gradient(circle, #E8E4D9 0%, transparent 70%)",
        filter: "blur(120px)",
        willChange: "auto",
      }}
    />

    {/* Bottom-right glow — near-white, even subtler */}
    <div
      className="absolute bottom-[-15%] right-[-15%] w-[80vw] h-[80vw] rounded-full opacity-[0.025]"
      style={{
        background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        filter: "blur(140px)",
        willChange: "auto",
      }}
    />

    {/* Top-right glow — barely-there white */}
    <div
      className="absolute top-[20%] right-[5%] w-[55vw] h-[55vw] rounded-full opacity-[0.02]"
      style={{
        background: "radial-gradient(circle, #E8E4D9 0%, transparent 70%)",
        filter: "blur(120px)",
        willChange: "auto",
      }}
    />
  </div>
);

export default AnimatedBlurBg;