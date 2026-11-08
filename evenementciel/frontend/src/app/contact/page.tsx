import type { Metadata } from 'next';
import { PageEnPreparation } from '@/components/PageEnPreparation';

export const metadata: Metadata = { title: "Contact" };

// TODO : contenu à fournir par le client.
export default function Page() {
  return <PageEnPreparation titre="Contact" texte="Le formulaire de contact arrive bientôt. En attendant, choisissez un atelier dans le catalogue et envoyez-nous votre demande : nous vous répondons sous 48 h." />;
}
