"use client";

import { androidStoreUrl, iosStoreUrl } from "../../urls";

export default function NewsletterSignupCard() {
  return (
    <div className="bg-secondary text-white p-8 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      <h3 className="font-display font-bold text-2xl mb-2 relative z-10">Receba achados semanais</h3>
      <p className="text-stone-200 text-sm mb-6 relative z-10">Curadoria exclusiva direto no seu celular, fique ligado</p>
      <div className="relative z-10 flex flex-wrap gap-3">
        <a
          href={iosStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-black hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <span className="material-icons-outlined text-xl mr-2">apple</span>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px]">Download on the</span>
            <span className="font-bold text-xs">App Store</span>
          </div>
        </a>
        <a
          href={androidStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-black hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-md"
        >
          <span className="material-icons-outlined text-xl mr-2">android</span>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px]">GET IT ON</span>
            <span className="font-bold text-xs">Google Play</span>
          </div>
        </a>
      </div>
    </div>
  );
}
