import type { Metadata } from 'next';
import { PageEnPreparation } from '@/components/PageEnPreparation';

export const metadata: Metadata = { title: "Qui sommes-nous ?" };

// TODO : contenu à fournir par le client.
export default function Page() {
  return <PageEnPreparation titre="Qui sommes-nous ?" texte="Cette page présentera l'histoire d'Événement Ciel et ses intervenants. Contenu en cours de rédaction." />;
}
