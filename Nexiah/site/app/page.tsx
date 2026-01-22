import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Site vitrine
      </h1>
      <p className="mt-4 mb-8 text-lg">
        Next.js est bien installé 🚀
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">
          Pages disponibles
        </h2>
        <ul className="space-y-3">
          <li>
            <Link 
              href="/page-strapi" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              📄 Page depuis Strapi
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Affiche le contenu de votre single type &quot;page&quot; depuis Strapi
            </p>
          </li>
          <li>
            <Link 
              href="/test" 
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              🧪 Test de connexion Strapi
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Vérifie que la connexion entre Next.js et Strapi fonctionne
            </p>
          </li>
        </ul>
      </div>
    </main>
  )
}