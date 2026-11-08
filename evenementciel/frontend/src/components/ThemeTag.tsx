import type { Theme } from '@/lib/strapi';

/** Les couleurs viennent de Strapi : le client peut les ajuster par thème. */
export function ThemeTag({ theme }: { theme: Theme }) {
  return (
    <span
      className="rounded-full px-3 py-1 text-[0.78rem] font-bold"
      style={{ backgroundColor: theme.couleurFond, color: theme.couleurTexte }}
    >
      {theme.name}
    </span>
  );
}
