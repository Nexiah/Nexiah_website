import { getCollection } from "@/lib/strapi";
import { StrapiProject } from "@/lib/types/strapi";
import { FeaturedWork } from "./FeaturedWork";
import { Project } from "@/components/ui/project-grid";

export async function FeaturedWorkServer() {
  let projects: Project[] = [];

  try {
    const response = await getCollection<StrapiProject>('projects', {
      populate: '*',
      limit: 3,
      sort: 'createdAt:desc',
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      type ProjectAttrs = Pick<StrapiProject, "Title" | "title" | "Slug" | "slug" | "Description" | "description" | "Summary" | "summary" | "Cover" | "cover">;
      projects = response.data.map((item) => {
        const raw = item as StrapiProject & { attributes?: ProjectAttrs };
        const itemData: ProjectAttrs = raw.attributes ?? (raw as unknown as ProjectAttrs);
        return {
          title: itemData.Title ?? itemData.title ?? "Sans titre",
          slug: itemData.Slug ?? itemData.slug ?? "",
          description: itemData.Description ?? itemData.description,
          summary: itemData.Summary ?? itemData.summary,
          cover: itemData.Cover ?? itemData.cover,
        };
      });
    }
  } catch {
    // Erreur silencieuse, pas de section
  }

  if (projects.length === 0) {
    return null;
  }

  return <FeaturedWork projects={projects} />;
}
