import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../../client/data/blogPosts";

const prisma = new PrismaClient();

async function migrateBlogPosts() {
    console.log(`\n🚀 Starting migration of ${blogPosts.length} blog posts...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const post of blogPosts) {
        try {
            await prisma.blogPost.create({
                data: {
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    featuredImage: post.featuredImage,
                    category: post.category,
                    tags: post.tags,
                    authorName: post.author.name,
                    authorAvatar: post.author.avatar,
                    authorBio: post.author.bio,
                    publishDate: new Date(post.publishDate),
                    readTime: post.readTime,
                    featured: post.featured,
                    isPublished: true, // Make all existing posts published by default
                },
            });
            console.log(`✅ Migrated: "${post.title}"`);
            successCount++;
        } catch (error: any) {
            console.error(`❌ Failed to migrate: "${post.title}"`);
            console.error(`   Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${blogPosts.length}\n`);

    await prisma.$disconnect();
    process.exit(errorCount > 0 ? 1 : 0);
}

migrateBlogPosts().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
});
