import { PrismaClient } from '../generated/prisma/client.js';
import pkg from 'pg';
const { Pool } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config();

const tours = [
    {
        name: "Himalayan Heritage Explorer",
        slug: "nepal-mountain-explorer",
        location: "Nepal",
        description: "Experience the majestic Himalayan peaks and cultural heritage of Nepal.",
        price: 1299,
        duration: "10 days",
        difficulty: 3,
        images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"],
        highlights: ["UNESCO sites", "Pokhara lakes", "Nepalese culture", "Annapurna views"],
        includes: ["Hotels & lodges", "Meals", "Transfers", "Guide", "Permits"],
        excludes: ["International flights", "Insurance", "Personal expenses"],
    },
    {
        name: "Royal Cities Discovery Tour",
        slug: "tibet-sacred-journey",
        location: "Tibet",
        description: "Discover ancient monasteries, sacred pilgrimage sites, and Tibet's spiritual practices.",
        price: 1599,
        duration: "12 days",
        difficulty: 2,
        images: ["https://images.unsplash.com/photo-1548013146-72d440642117?w=1200&h=600&fit=crop"],
        highlights: ["Potala Palace", "Jokhang Temple", "Monastery debates", "Sacred sites"],
        includes: ["Guesthouses", "All meals", "Transport", "Tibetan guide", "Permits"],
        excludes: ["International flights", "Insurance", "Souvenirs"],
    },
    {
        name: "Mystic Valley Cultural Tour",
        slug: "bhutan-wellness-retreat",
        location: "Bhutan",
        description: "Immerse in Bhutanese culture and wellness practices in the Land of Happiness.",
        price: 1899,
        duration: "8 days",
        difficulty: 1,
        images: ["https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&h=600&fit=crop"],
        highlights: ["Yoga & meditation", "Hot stone baths", "Punakha Dzong", "Organic meals"],
        includes: ["Wellness resort", "All meals", "Spa & yoga", "Cultural tours"],
        excludes: ["International flights", "Insurance", "Gratuities"],
    },
    {
        name: "Sacred Trails Experience",
        slug: "rajasthan-heritage-tour",
        location: "India",
        description: "Explore palaces, temples, and vibrant desert culture in royal Rajasthan.",
        price: 899,
        duration: "7 days",
        difficulty: 1,
        images: ["https://images.unsplash.com/photo-1516214104703-3e691de8e4ad?w=1200&h=600&fit=crop"],
        highlights: ["Heritage hotels", "Amber Fort", "Desert safari", "Folk performances"],
        includes: ["Heritage hotels", "Meals", "Transport", "Guide", "Entry fees"],
        excludes: ["Flights", "Lunch", "Tips"],
    },
    {
        name: "Hidden Lakes & Highlands Journey",
        slug: "kerala-backwater-experience",
        location: "India",
        description: "Serene backwaters, spice plantations, and beach retreats in God's Own Country.",
        price: 799,
        duration: "6 days",
        difficulty: 1,
        images: ["https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1200&h=600&fit=crop"],
        highlights: ["Houseboat cruise", "Spice plantation", "Ayurvedic massage", "Beach resort"],
        includes: ["Beach resort", "Houseboat", "Meals", "Transport", "Massage"],
        excludes: ["Flights", "Watersports", "Alcohol"],
    },
    {
        name: "Timeless Temples Tour",
        slug: "patagonia-adventure",
        location: "Argentina",
        description: "Epic adventure through dramatic landscapes, glaciers, and mountain trekking.",
        price: 2299,
        duration: "14 days",
        difficulty: 4,
        images: ["https://images.unsplash.com/photo-1531065208531-4036c0dba3f5?w=1200&h=600&fit=crop"],
        highlights: ["Perito Moreno Glacier", "Fitz Roy trek", "Torres del Paine", "Wildlife"],
        includes: ["Lodges", "All meals", "Trekking gear", "Guide", "Park fees"],
        excludes: ["International flights", "Insurance", "Personal gear"],
    },
];

const treks = [
    {
        name: "Annapurna Base Camp Trek",
        slug: "annapurna-base-camp",
        location: "Annapurna Region, Nepal",
        description: "Trekking to Annapurna Base Camp is a deeply personal experience.",
        price: 1299,
        duration: "7-12 days",
        difficulty: 3,
        altitude: "4,130m",
        bestSeason: ["Spring (Mar-May)", "Autumn (Sep-Nov)"],
        trekGrade: "Moderate",
        images: ["/annapurna-1.jpg"],
        highlights: ["Base camp at 4,130m", "Rhododendron forests", "Gurung culture"],
        includes: ["Tea houses", "Meals", "Guide", "Permits", "Transfers"],
        excludes: ["International flights", "Insurance", "Snacks"],
    },
    {
        name: "Everest Base Camp Trek",
        slug: "everest-base-camp",
        location: "Everest Region, Nepal",
        description: "A life-changing trek to the base of the world's highest mountain.",
        price: 1499,
        duration: "12 days",
        difficulty: 4,
        altitude: "5,545m",
        bestSeason: ["Autumn (Sep-Nov)", "Spring (Mar-May)"],
        trekGrade: "Challenging",
        images: ["/everest-1.webp"],
        highlights: ["Base camp 5,364m", "Kalapatthar sunrise 5,545m", "Tengboche Monastery"],
        includes: ["Tea houses", "Meals", "Sherpa guide", "Permits", "Lukla flights"],
        excludes: ["International flights", "Insurance", "WiFi"],
    },
    {
        name: "Gokyo Lakes & Renjo La Pass Trek",
        slug: "gokyo-lakes-renjo-la",
        location: "Khumbu Region, Nepal",
        description: "A quieter alternative to EBC with turquoise lakes and dramatic high passes.",
        price: 1549,
        duration: "12 days",
        difficulty: 4,
        altitude: "5,360m",
        bestSeason: ["Autumn (Sep-Nov)", "Spring (Mar-May)"],
        trekGrade: "Challenging",
        images: ["/gokyo-1.jpg"],
        highlights: ["Gokyo Lakes", "Renjo La Pass 5,360m", "Gokyo Ri viewpoint"],
        includes: ["Tea houses", "Meals", "Sherpa guide", "Permits", "Lukla flights"],
        excludes: ["International flights", "Insurance", "WiFi"],
    },
];

async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL required");
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('🚀 Starting migration...\n');

    try {
        console.log('📍 Importing Tours...');
        for (const tour of tours) {
            const created = await prisma.tour.upsert({
                where: { slug: tour.slug },
                update: tour,
                create: tour,
            });
            console.log(`✅ Tour: ${created.name}`);
        }

        console.log('\n⛰️  Importing Treks...');
        for (const trek of treks) {
            const created = await prisma.trek.upsert({
                where: { slug: trek.slug },
                update: trek,
                create: trek,
            });
            console.log(`✅ Trek: ${created.name}`);
        }

        console.log('\n🎉 Migration completed!');
        console.log(`\n📊 Summary:`);
        console.log(`   - ${tours.length} tours`);
        console.log(`   - ${treks.length} treks`);
        console.log(`\nView at /admin/tours and /admin/treks!`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
