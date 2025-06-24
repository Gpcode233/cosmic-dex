export function Footer() {
  return (
    <footer className="w-full mt-24 py-6 px-4 bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-inner shadow-cosmic-500/10 font-orbitron rounded-t-2xl text-center text-gray-300">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-lg font-bold tracking-wide">
        COSMIC DEX <span className="text-cosmic-400">|</span> Trade in the stars. Powered by Umi.
        </div>
               
      </div>
      <br />
        <div className="text-xs text-gray-400">
          Built for the <span className="text-cosmic-400 font-bold">Umi Try-a-Thon</span> &copy; {new Date().getFullYear()}
        </div> 
    </footer>
  );
} 