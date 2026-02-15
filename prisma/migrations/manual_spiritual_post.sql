-- Run this SQL in Supabase SQL Editor to create the SpiritualPost table
-- This is equivalent to running: npx prisma db push

CREATE TABLE IF NOT EXISTS "SpiritualPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Spiritual Insights',
    "tags" TEXT[],
    "author" TEXT NOT NULL DEFAULT 'Eraya Team',
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "readTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpiritualPost_pkey" PRIMARY KEY ("id")
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS "SpiritualPost_slug_key" ON "SpiritualPost"("slug");

-- Create performance indexes
CREATE INDEX IF NOT EXISTS "SpiritualPost_slug_idx" ON "SpiritualPost"("slug");
CREATE INDEX IF NOT EXISTS "SpiritualPost_isPublished_idx" ON "SpiritualPost"("isPublished");
CREATE INDEX IF NOT EXISTS "SpiritualPost_isFeatured_idx" ON "SpiritualPost"("isFeatured");
CREATE INDEX IF NOT EXISTS "SpiritualPost_publishDate_idx" ON "SpiritualPost"("publishDate");
