// TypeScript interfaces for Spiritual Posts

export interface SpiritualPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category: string;
    tags: string[];
    author: string;
    publishDate: string;
    isPublished: boolean;
    isFeatured: boolean;
    readTime?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSpiritualPostInput {
    title: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category?: string;
    tags: string[];
    author?: string;
    publishDate?: Date;
    isPublished?: boolean;
    isFeatured?: boolean;
    readTime?: string;
}

export interface UpdateSpiritualPostInput {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    category?: string;
    tags?: string[];
    author?: string;
    publishDate?: Date;
    isPublished?: boolean;
    isFeatured?: boolean;
    readTime?: string;
}
