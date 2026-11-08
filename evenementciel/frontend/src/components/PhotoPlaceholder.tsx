import { Camera } from 'lucide-react';

/** Affiché tant qu'aucune photo n'est ajoutée dans Strapi. */
export function PhotoPlaceholder({ className = '', label = 'Photo à venir' }: { className?: string; label?: string }) {
  return (
    <div aria-hidden className={`flex flex-col items-center justify-center gap-2 bg-nuage text-[0.85rem] font-bold text-marque ${className}`}>
      <Camera className="size-8" />
      <span>{label}</span>
    </div>
  );
}
