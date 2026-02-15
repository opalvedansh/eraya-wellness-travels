// TypeScript interfaces for Blog Posts

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: string;
    tags: string[];
    authorName: string;
    authorAvatar?: string;
    authorBio?: string;
    publishDate: string;
    readTime?: string;
    featured: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogPostInput {
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category?: string;
    tags: string[];
    authorName?: string;
    authorAvatar?: string;
    authorBio?: string;
    publishDate?: Date;
    readTime?: string;
    featured?: boolean;
    isPublished?: boolean;
}

export interface UpdateBlogPostInput {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    featuredImage?: string;
    category?: string;
    tags?: string[];
    authorName?: string;
    authorAvatar?: string;
    authorBio?: string;
    publishDate?: Date;
    readTime?: string;
    featured?: boolean;
    isPublished?: boolean;
}
