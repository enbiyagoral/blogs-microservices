import { MappingTypeMapping } from "@elastic/elasticsearch/api/types";

export const BlogMapping: MappingTypeMapping = {
  properties: {
    id: { type: 'text' },
    title: { type: 'text' },
    description: { type: 'text' },
    context: { type: 'text' },
    publishDate: { type: 'date' },
    slug: { type: 'keyword' },
  },
}