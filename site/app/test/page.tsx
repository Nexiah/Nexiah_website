/**
 * Page de test pour vérifier la connexion à Strapi
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default async function TestPage() {
  // Test 1: Vérifier que Strapi répond (en testant un endpoint qui existe toujours)
  let apiTest: { success: boolean; message: string; details?: unknown } = {
    success: false,
    message: '',
  };

  try {
    // Tester un endpoint qui existe toujours dans Strapi (upload/files)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const apiResponse = await fetch(`${STRAPI_URL}/api/upload/files`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    // 200 ou 401/403 signifie que Strapi répond (401/403 = besoin d'authentification, mais l'API fonctionne)
    if (apiResponse.status === 200 || apiResponse.status === 401 || apiResponse.status === 403) {
      apiTest = {
        success: true,
        message: '✅ Connexion à Strapi réussie ! L\'API répond correctement.',
        details: {
          status: apiResponse.status,
          note: apiResponse.status === 401 || apiResponse.status === 403 
            ? 'Authentification requise (normal pour cet endpoint)'
            : 'Accès autorisé'
        },
      };
    } else if (apiResponse.status === 404) {
      apiTest = {
        success: false,
        message: '⚠️ Strapi répond mais l\'endpoint n\'existe pas',
        details: { status: apiResponse.status },
      };
    } else {
      apiTest = {
        success: false,
        message: `❌ Erreur HTTP ${apiResponse.status}`,
        details: await apiResponse.text().catch(() => ''),
      };
    }
  } catch (error) {
    apiTest = {
      success: false,
      message: `❌ Impossible de se connecter à Strapi: ${error instanceof Error ? error.message : String(error)}`,
      details: { 
        url: `${STRAPI_URL}/api/upload/files`,
        note: 'Vérifiez que Strapi est démarré sur le port 1337'
      },
    };
  }


  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Test de connexion Strapi</h1>

      {/* Configuration */}
      <section className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-blue-900">Configuration</h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="font-medium text-blue-800">URL Strapi :</span>
            <code className="bg-blue-100 px-2 py-1 rounded">{STRAPI_URL}</code>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-blue-800">URL API :</span>
            <code className="bg-blue-100 px-2 py-1 rounded">{STRAPI_URL}/api</code>
          </div>
        </div>
      </section>

      {/* Test 1: Connexion de base */}
      <section
        className={`mb-6 border rounded-lg p-4 ${
          apiTest.success
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <h2 className="text-xl font-semibold mb-3">
          Test 1: Connexion à Strapi
        </h2>
        <p className={apiTest.success ? 'text-green-800' : 'text-red-800'}>
          {apiTest.message}
        </p>
        {apiTest.details && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-medium">Détails</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(apiTest.details, null, 2)}
            </pre>
          </details>
        )}
        {!apiTest.success && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-semibold mb-1">Note importante :</p>
            <p>L&apos;erreur 404 sur <code>/api</code> seul est normale. Dans Strapi, vous devez utiliser des endpoints spécifiques comme :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><code>/api/articles</code> (si vous avez créé une collection &quot;articles&quot;)</li>
              <li><code>/api/upload/files</code> (pour les fichiers uploadés)</li>
              <li><code>/api/users-permissions/users</code> (pour les utilisateurs)</li>
            </ul>
          </div>
        )}
      </section>

      {/* Instructions */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-blue-900">
          Comment utiliser l&apos;API Strapi ?
        </h2>
        <div className="text-sm text-blue-800 space-y-3">
          <div>
            <p className="font-semibold mb-2">1. Créer des collections dans Strapi :</p>
            <p>Accédez à <a href={`${STRAPI_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">l&apos;interface d&apos;administration Strapi</a> et créez vos types de contenu (articles, pages, etc.)</p>
          </div>
          <div>
            <p className="font-semibold mb-2">2. Utiliser les endpoints :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Pour une collection : <code className="bg-blue-100 px-1 rounded">/api/nom-de-la-collection</code></li>
              <li>Pour un élément : <code className="bg-blue-100 px-1 rounded">/api/nom-de-la-collection/1</code></li>
              <li>Avec populate : <code className="bg-blue-100 px-1 rounded">/api/nom-de-la-collection?populate=*</code></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">3. Permissions :</p>
            <p>N&apos;oubliez pas de configurer les permissions dans Settings → Users & Permissions → Roles → Public pour permettre l&apos;accès public à vos collections.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
