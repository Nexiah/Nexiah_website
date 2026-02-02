"use client";

/**
 * Boundary d'erreur global — remplace le layout racine en cas d'erreur.
 * Évite l'erreur du bundler RSC "global-error.js#default" non trouvé dans le Client Manifest.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
        <h1 className="text-xl font-semibold mb-2">Une erreur est survenue</h1>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          Désolé, quelque chose s&apos;est mal passé. Vous pouvez réessayer.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
