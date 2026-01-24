import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavbarServer } from "@/components/sections/NavbarServer";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { getCollection, formatImageUrl } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { AlertCircle, Code, Zap, TrendingUp, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface StrapiProject {
  id: number;
  documentId?: string;
  Title?: string;
  Slug?: string;
  Summary?: string;
  Description?: string;
  Content?: any;
  Challenge?: string;
  Solution?: string;
  Automation?: string;
  Results?: string;
  Category?: string;
  Cover?: {
    id: number;
    url: string;
    alternativeText?: string | null;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  // Format alternatif avec attributes (si Strapi v4 standard)
  attributes?: {
    title: string;
    slug: string;
    summary?: string;
    content?: string;
    challenge?: string;
    solution?: string;
    automation?: string;
    results?: {
      performance?: string;
      users?: string;
      satisfaction?: string;
    };
    categories?: {
      data?: Array<{
        attributes?: {
          name: string;
        };
      }>;
    };
    cover?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
    publishedAt?: string;
    createdAt?: string;
  };
}

/**
 * Fonction utilitaire pour rendre le Rich Text de Strapi
 * Gère les formats string, array (Strapi Rich Text), ou HTML
 */
function renderRichText(content: any): React.ReactNode {
  if (!content) return null;

  // Si c'est une string simple
  if (typeof content === 'string') {
    // Vérifier si c'est du HTML
    if (content.includes('<')) {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }
    // Sinon, texte simple avec préservation des sauts de ligne
    return <p className="whitespace-pre-line">{content}</p>;
  }

  // Si c'est un array (format Strapi Rich Text)
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((block: any, index: number) => {
          if (block.type === 'paragraph' && block.children) {
            return (
              <p key={index} className="mb-4">
                {block.children.map((child: any, childIndex: number) => {
                  if (child.bold) {
                    return <strong key={childIndex}>{child.text}</strong>;
                  }
                  if (child.italic) {
                    return <em key={childIndex}>{child.text}</em>;
                  }
                  return <span key={childIndex}>{child.text}</span>;
                })}
              </p>
            );
          }
          if (block.type === 'heading' && block.level) {
            const headingProps = { key: index, className: "font-bold mb-4 mt-6" };
            const headingContent = block.children?.map((child: any, childIndex: number) => (
              <span key={childIndex}>{child.text}</span>
            ));
            
            switch (block.level) {
              case 1:
                return <h1 {...headingProps}>{headingContent}</h1>;
              case 2:
                return <h2 {...headingProps}>{headingContent}</h2>;
              case 3:
                return <h3 {...headingProps}>{headingContent}</h3>;
              case 4:
                return <h4 {...headingProps}>{headingContent}</h4>;
              case 5:
                return <h5 {...headingProps}>{headingContent}</h5>;
              case 6:
                return <h6 {...headingProps}>{headingContent}</h6>;
              default:
                return <h2 {...headingProps}>{headingContent}</h2>;
            }
          }
          if (block.type === 'list' && block.children) {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="list-disc pl-6 mb-4">
                {block.children.map((item: any, itemIndex: number) => (
                  <li key={itemIndex}>
                    {item.children?.map((child: any, childIndex: number) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </li>
                ))}
              </ListTag>
            );
          }
          return null;
        })}
      </>
    );
  }

  // Fallback : afficher le contenu brut
  return <pre className="text-sm">{JSON.stringify(content, null, 2)}</pre>;
}

export async function generateStaticParams() {
  try {
    const response = await getCollection<StrapiProject>('projects', {
      populate: '*',
    });

    if (response?.data && Array.isArray(response.data)) {
      return response.data
        .filter((project) => {
          // Gérer les deux formats : PascalCase direct ou attributes
          const slug = (project as any).Slug || (project as any).attributes?.slug;
          return !!slug;
        })
        .map((project) => {
          const slug = (project as any).Slug || (project as any).attributes?.slug;
          return { slug };
        });
    }
  } catch (error) {
    console.warn('Failed to generate static params, Strapi may be unavailable:', error);
  }

  // Retourner un tableau vide si Strapi n'est pas disponible
  return [];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let projectData: any = null;
  let allProjects: Array<{ slug: string; title: string }> = [];
  let currentIndex = -1;

  try {
    console.log('[ProjectDetail] Fetching project with slug:', params.slug);
    
    // Récupérer tous les projets pour la pagination
    const allProjectsResponse = await getCollection<StrapiProject>('projects', {
      populate: '*',
      sort: 'createdAt:desc',
    });
    
    if (allProjectsResponse?.data && Array.isArray(allProjectsResponse.data)) {
      allProjects = allProjectsResponse.data.map((item: any) => {
        const data = item.attributes || item;
        return {
          slug: data.Slug || data.slug || '',
          title: data.Title || data.title || 'Sans titre',
        };
      });
      
      // Trouver l'index du projet actuel
      currentIndex = allProjects.findIndex(p => p.slug === params.slug);
    }
    
    // Essayer d'abord avec Slug (PascalCase)
    let response = await getCollection<StrapiProject>('projects', {
      populate: '*',
      filters: {
        Slug: {
          $eq: params.slug,
        },
      },
    });
    
    // Si pas de résultat, essayer avec slug (camelCase)
    if (!response?.data || response.data.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProjectDetail] Retry with slug (camelCase)...');
      }
      response = await getCollection<StrapiProject>('projects', {
        populate: '*',
        filters: {
          slug: {
            $eq: params.slug,
          },
        },
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[ProjectDetail] Response:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        dataLength: response?.data?.length || 0,
      });
    }

    if (response?.data && response.data.length > 0) {
      const item = response.data[0] as any;
      // Gérer les deux formats : PascalCase direct ou attributes
      projectData = item.attributes || item;
      if (process.env.NODE_ENV === 'development') {
        console.log('[ProjectDetail] Project data keys:', Object.keys(projectData).slice(0, 10));
      }
    }
  } catch (error) {
    console.warn('Failed to fetch project from Strapi:', error);
  }

  // Si le projet n'existe pas, afficher 404
  if (!projectData) {
    console.warn('[ProjectDetail] Project not found for slug:', params.slug);
    notFound();
  }

  // Extraire les données en gérant les deux formats
  const title = projectData.Title || projectData.title || 'Sans titre';
  const slug = projectData.Slug || projectData.slug || '';
  const summary = projectData.Summary || projectData.summary;
  const description = projectData.Description || projectData.description;
  
  // Extraire les champs Rich Text depuis sections (composants Strapi)
  let challenge = projectData.Challenge || projectData.challenge;
  let solution = projectData.Solution || projectData.solution;
  let automation = projectData.Automation || projectData.automation;
  let results = projectData.Results || projectData.results;
  
  // Si les champs sont dans sections (composable Strapi)
  if (projectData.sections && Array.isArray(projectData.sections)) {
    projectData.sections.forEach((section: any) => {
      // Challenge
      if (section.__component === 'challenge.challenge' || section.__component === 'sections.challenge') {
        challenge = section.Challenge || section.content || section.text || challenge;
      }
      // Solution
      if (section.__component === 'solution.solution' || section.__component === 'sections.solution') {
        solution = section.Solution || section.content || section.text || solution;
      }
      // Automation
      if (section.__component === 'automation.automation' || section.__component === 'sections.automation') {
        automation = section.Automation || section.content || section.text || automation;
      }
      // Results (peut être Result au singulier)
      if (section.__component === 'result.result' || section.__component === 'results.results' || section.__component === 'sections.results') {
        results = section.Result || section.Results || section.content || section.text || results;
      }
    });
  }
  
  const category = projectData.Category || projectData.category;
  
  // Logs de debug pour voir ce qui est récupéré (uniquement en développement)
  if (process.env.NODE_ENV === 'development') {
    console.log('[ProjectDetail] Extracted data:', {
      title,
      hasChallenge: !!challenge,
      hasSolution: !!solution,
      hasAutomation: !!automation,
      hasResults: !!results,
      hasSections: !!projectData.sections,
      sectionsLength: projectData.sections?.length || 0,
      sectionsComponents: projectData.sections?.map((s: any) => s.__component) || [],
    });
  }
  
  // Gérer Cover
  let coverUrl: string | null = null;
  let coverAlt: string | undefined;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[ProjectDetail] Cover data:', {
      hasCover: !!projectData.Cover,
      coverType: typeof projectData.Cover,
      coverUrl: projectData.Cover?.url,
    });
  }
  
  if (projectData.Cover) {
    if (typeof projectData.Cover === 'string') {
      // Cover est directement une URL
      coverUrl = projectData.Cover;
    } else if (projectData.Cover.url) {
      // Cover est un objet avec url directement
      coverUrl = projectData.Cover.url;
      coverAlt = projectData.Cover.alternativeText || projectData.Cover.name;
    }
  } else if (projectData.cover?.data?.attributes?.url) {
    coverUrl = projectData.cover.data.attributes.url;
    coverAlt = projectData.cover.data.attributes.alternativeText;
  }
  
  const formattedCoverUrl = coverUrl ? formatImageUrl(coverUrl) : null;

  const categories = category ? [category] : [];
  const date = projectData.publishedAt 
    ? new Date(projectData.publishedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : projectData.createdAt
    ? new Date(projectData.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  // Déterminer les projets précédent et suivant
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16"></div>
      <NavbarServer />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 sm:pb-32">
        {/* Bouton Retour */}
        <div className="max-w-4xl mx-auto mb-8">
          <Button variant="ghost" asChild className="group">
            <Link href="/work" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Retour aux réalisations</span>
            </Link>
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary">Projet</Badge>
            )}
          </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              {title}
            </h1>
            {date && <p className="text-muted-foreground">{date}</p>}
          </div>

          {/* Image de couverture */}
          {formattedCoverUrl && (
            <div className="mb-16">
              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              {formattedCoverUrl.includes('localhost') ? (
                // Pour localhost, utiliser img standard directement
                <img
                  src={formattedCoverUrl}
                  alt={coverAlt || title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                // Pour les autres URLs, utiliser next/image
                <Image
                  src={formattedCoverUrl}
                  alt={coverAlt || title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        )}

          {/* Contenu */}
          <div className="space-y-12">
          {/* Summary */}
          {summary && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-lg text-foreground leading-relaxed prose prose-slate max-w-none">
                {summary}
              </p>
            </div>
          )}

          {/* Section 1: Le Challenge */}
          {challenge && (
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">Le Challenge</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  {renderRichText(challenge)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 2: La Solution */}
          {solution && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">La Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  {renderRichText(solution)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 3: L'Automatisation - Section mise en avant */}
          {automation && (
            <Card className="border-2 border-primary bg-primary/5 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">Expertise Nexiah</Badge>
              </div>
              <CardHeader className="pb-4 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">L&apos;Automatisation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  {renderRichText(automation)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 4: Résultats */}
          {results && (
            <Card className="border-l-4 border-l-green-500 bg-green-50/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Résultats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none prose-strong:font-bold prose-strong:text-foreground prose-ul:list-disc prose-ul:pl-6 prose-li:my-2">
                  {renderRichText(results)}
                </div>
              </CardContent>
            </Card>
          )}
          </div>

          {/* Pagination */}
          <div className="mt-16 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Projet Précédent */}
            {previousProject ? (
              <Link 
                href={`/work/${previousProject.slug}`}
                className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-slate-50 hover:border-primary/50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Précédent</p>
                  <p className="text-base font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {previousProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-4 rounded-lg border border-border opacity-50">
                <div className="flex items-center gap-3">
                  <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Précédent</p>
                    <p className="text-base font-medium text-muted-foreground">Aucun projet précédent</p>
                  </div>
                </div>
              </div>
            )}

            {/* Projet Suivant */}
            {nextProject ? (
              <Link 
                href={`/work/${nextProject.slug}`}
                className="group flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-slate-50 hover:border-primary/50 transition-colors md:flex-row-reverse"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0 text-right md:text-left">
                  <p className="text-sm text-muted-foreground mb-1">Suivant</p>
                  <p className="text-base font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {nextProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-4 rounded-lg border border-border opacity-50 md:flex-row-reverse">
                <div className="flex items-center gap-3 md:flex-row-reverse">
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 text-right md:text-left">
                    <p className="text-sm text-muted-foreground mb-1">Suivant</p>
                    <p className="text-base font-medium text-muted-foreground">Aucun projet suivant</p>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
