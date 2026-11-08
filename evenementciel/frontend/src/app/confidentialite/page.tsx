import type { Metadata } from 'next';
import { PageEnPreparation } from '@/components/PageEnPreparation';

export const metadata: Metadata = { title: "Politique de confidentialité" };

// TODO : contenu à fournir par le client.
export default function Page() {
  return <PageEnPreparation titre="Politique de confidentialité" texte="Les données envoyées par le formulaire de demande servent uniquement à traiter votre demande d'atelier. Politique complète en cours de rédaction." />;
}
