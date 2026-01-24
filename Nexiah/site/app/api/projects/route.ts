import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/strapi';

interface StrapiProject {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    cover?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('pagination[limit]') || searchParams.get('limit');
    const populate = searchParams.get('populate') || '*';
    const sort = searchParams.get('sort') || 'createdAt:desc';

    const response = await getCollection<StrapiProject>('projects', {
      populate,
      limit: limit ? parseInt(limit) : undefined,
      sort,
    });

    if (!response) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', data: [] },
      { status: 500 }
    );
  }
}
