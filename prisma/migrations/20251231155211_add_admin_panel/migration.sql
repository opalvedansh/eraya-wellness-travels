-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "maxGroupSize" INTEGER NOT NULL DEFAULT 15,
    "minAge" INTEGER NOT NULL DEFAULT 5,
    "coverImage" TEXT,
    "images" TEXT[],
    "highlights" TEXT[],
    "includes" TEXT[],
    "excludes" TEXT[],
    "itinerary" JSONB,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trek" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "altitude" TEXT,
    "maxGroupSize" INTEGER NOT NULL DEFAULT 12,
    "minAge" INTEGER NOT NULL DEFAULT 12,
    "coverImage" TEXT,
    "images" TEXT[],
    "highlights" TEXT[],
    "includes" TEXT[],
    "excludes" TEXT[],
    "itinerary" JSONB,
    "bestSeason" TEXT[],
    "trekGrade" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_slug_idx" ON "Tour"("slug");

-- CreateIndex
CREATE INDEX "Tour_isActive_idx" ON "Tour"("isActive");

-- CreateIndex
CREATE INDEX "Tour_isFeatured_idx" ON "Tour"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "Trek_slug_key" ON "Trek"("slug");

-- CreateIndex
CREATE INDEX "Trek_slug_idx" ON "Trek"("slug");

-- CreateIndex
CREATE INDEX "Trek_isActive_idx" ON "Trek"("isActive");

-- CreateIndex
CREATE INDEX "Trek_isFeatured_idx" ON "Trek"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_key_key" ON "SiteSettings"("key");

-- CreateIndex
CREATE INDEX "SiteSettings_key_idx" ON "SiteSettings"("key");

-- CreateIndex
CREATE INDEX "User_isAdmin_idx" ON "User"("isAdmin");
