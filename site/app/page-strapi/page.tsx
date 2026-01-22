/**
 * Page pour afficher le contenu depuis Strapi
 */

import Link from 'next/link';
import { getSingle } from '@/lib/strapi';

interface PageData {
  Titre?: string;
  Slug?: string;
  Texte?: string;
}

export default async function StrapiPage() {
  let pageData: PageData | null = null;
  let error: string | null = null;

  try {
    const response = await getSingle<PageData>('page', '*');
    pageData = response.data;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erreur inconnue';
  }

  if (error) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-4">
            Erreur de chargement
          </h1>
          <p className="text-red-800 mb-4">{error}</p>
          <div className="bg-white p-4 rounded border border-red-200">
            <p className="text-sm text-red-700 font-semibold mb-2">
              Vérifications à faire :
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              <li>Strapi est-il démarré sur http://localhost:1337 ?</li>
              <li>La page est-elle publiée dans Strapi ?</li>
              <li>Les permissions sont-elles configurées dans Strapi Admin → Settings → Users & Permissions → Roles → Public ?</li>
              <li>L&apos;endpoint /api/page est-il accessible ?</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  if (!pageData) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-yellow-900 mb-4">
            Aucune page trouvée
          </h1>
          <p className="text-yellow-800">
            Aucune page n&apos;a été trouvée dans Strapi. Assurez-vous d&apos;avoir créé et publié une page dans l&apos;interface d&apos;administration Strapi.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Link 
        href="/" 
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 underline"
      >
        ← Retour à l&apos;accueil
      </Link>
      <article className="bg-white rounded-lg shadow-lg p-8">
        {pageData.Titre && (
          <h1 className="text-4xl font-bold mb-6 text-gray-900">
            {pageData.Titre}
          </h1>
        )}

        {pageData.Slug && (
          <div className="mb-6">
            <span className="text-sm text-gray-500">Slug :</span>
            <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
              {pageData.Slug}
            </code>
          </div>
        )}

        {pageData.Texte && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Contenu</h2>
            <div 
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: pageData.Texte }}
            />
          </div>
        )}

        {!pageData.Titre && !pageData.Texte && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              La page existe mais ne contient pas encore de contenu. Ajoutez du contenu dans Strapi Admin.
            </p>
          </div>
        )}
      </article>
    </main>
  );
}
