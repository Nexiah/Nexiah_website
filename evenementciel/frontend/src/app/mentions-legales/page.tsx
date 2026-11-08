import type { Metadata } from 'next';
import { PageEnPreparation } from '@/components/PageEnPreparation';

export const metadata: Metadata = { title: "Mentions légales" };

// TODO : contenu à fournir par le client.
export default function Page() {
  return <PageEnPreparation titre="Mentions légales" texte="Mentions légales en cours de rédaction." />;
}
