const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-muted via-muted to-primary/5 p-12 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/20 ring-1 ring-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;