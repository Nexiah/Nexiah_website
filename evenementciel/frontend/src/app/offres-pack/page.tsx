import type { Metadata } from 'next';
import { PageEnPreparation } from '@/components/PageEnPreparation';

export const metadata: Metadata = { title: "Offres pack" };

// TODO : contenu à fournir par le client.
export default function Page() {
  return <PageEnPreparation titre="Offres pack" texte="Nos formules multi-ateliers seront présentées ici. Contenu en cours de rédaction." />;
}
