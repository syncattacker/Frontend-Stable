// Fills the empty side margins on wide viewports with a faint structural
// texture instead of flat black — a grid pattern plus two edge guide-lines
// marking the content column, in the same border tone used between cards
// site-wide (rgba(255,255,255,0.07)/0.04). Fixed position so it reads as one
// continuous backdrop behind every section, not per-section decoration.
const GridBackdrop = () => (
  <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "88px 88px",
      }}
    />
    <div
      className="hidden xl:block absolute top-0 bottom-0"
      style={{ left: "5%", width: "1px", background: "rgba(255,255,255,0.07)" }}
    />
    <div
      className="hidden xl:block absolute top-0 bottom-0"
      style={{ right: "5%", width: "1px", background: "rgba(255,255,255,0.07)" }}
    />
  </div>
);

export default GridBackdrop;
