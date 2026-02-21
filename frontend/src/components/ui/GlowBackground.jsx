export default function GlowBackground() {
  return (
    <>
      {/* Center radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.25), rgba(16,185,129,0.2), transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Soft outer blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 60%)",
          filter: "blur(120px)",
          zIndex: 0,
        }}
      />
    </>
  );
}