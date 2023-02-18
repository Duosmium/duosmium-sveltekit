import type { LayoutServerLoad } from './$types';

export const load = (({ params }) => {
  return {
    slug: params.slug
  };
}) satisfies LayoutServerLoad;