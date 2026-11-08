import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="conteneur flex flex-col items-start gap-5 py-24">
      <h1 className="text-[2.6rem] font-extrabold leading-tight">Page introuvable</h1>
      <p className="text-texte">Cette page n&apos;existe pas ou plus.</p>
      <Link href="/catalogue" className="btn-principal">Voir le catalogue</Link>
    </section>
  );
}
