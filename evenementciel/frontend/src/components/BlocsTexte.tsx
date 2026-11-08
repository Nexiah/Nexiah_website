import type { ReactNode } from 'react';
import type { Bloc } from '@/lib/strapi';

/** Rendu minimal du champ « Rich text (blocks) » de Strapi. */
export function BlocsTexte({ blocs }: { blocs: Bloc[] }) {
  return <div className="flex flex-col gap-4 text-texte">{blocs.map((b, i) => rendreBloc(b, i))}</div>;
}

function rendreEnfants(enfants: Bloc[] = []): ReactNode[] {
  return enfants.map((e, i) => {
    if (e.type === 'link') {
      return (
        <a key={i} href={e.url}>
          {rendreEnfants(e.children)}
        </a>
      );
    }
    let contenu: ReactNode = e.text ?? '';
    if (e.bold) contenu = <strong>{contenu}</strong>;
    if (e.italic) contenu = <em>{contenu}</em>;
    return <span key={i}>{contenu}</span>;
  });
}

function rendreBloc(b: Bloc, cle: number): ReactNode {
  switch (b.type) {
    case 'heading': {
      const Titre = b.level && b.level <= 2 ? 'h3' : 'h4';
      return (
        <Titre key={cle} className="text-[1.25rem] font-bold text-encre">
          {rendreEnfants(b.children)}
        </Titre>
      );
    }
    case 'list': {
      const Liste = b.format === 'ordered' ? 'ol' : 'ul';
      return (
        <Liste key={cle} className={`flex flex-col gap-1.5 pl-6 ${b.format === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
          {(b.children ?? []).map((item, i) => (
            <li key={i}>{rendreEnfants(item.children)}</li>
          ))}
        </Liste>
      );
    }
    case 'quote':
      return (
        <blockquote key={cle} className="border-l-4 border-soleil pl-4 italic">
          {rendreEnfants(b.children)}
        </blockquote>
      );
    default:
      return <p key={cle}>{rendreEnfants(b.children)}</p>;
  }
}
