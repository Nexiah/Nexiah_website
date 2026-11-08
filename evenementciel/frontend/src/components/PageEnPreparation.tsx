import Link from 'next/link';

/** Page provisoire, en attendant le contenu du client. */
export function PageEnPreparation({ titre, texte }: { titre: string; texte: string }) {
  return (
    <section className="bg-ciel">
      <div className="conteneur flex flex-col items-start gap-5 py-24">
        <h1 className="text-[2.6rem] font-extrabold leading-tight tracking-tight">{titre}</h1>
        <p className="max-w-[40em] text-[1.1rem] text-texte">{texte}</p>
        <Link href="/catalogue" className="btn-principal">Voir le catalogue</Link>
      </div>
    </section>
  );
}
