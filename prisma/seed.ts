import { PrismaClient } from '@prisma/client';

// Sample tour data with authentic Nepal tours
const sampleTours = [
    {
        name: "Cultural Heritage Tour of Kathmandu Valley",
        slug: "cultural-heritage-kathmandu-valley",
        description: "Explore ancient temples, monasteries, and UNESCO World Heritage Sites in Kathmandu Valley",
        longDescription: "Embark on a captivating journey through the heart of Nepal's cultural heritage. This comprehensive tour takes you through the ancient cities of Kathmandu, Patan, and Bhaktapur.",
        location: "Kathmandu Valley, Nepal",
        duration: "5 Days / 4 Nights",
        price: 599,
        currency: "USD",
        difficulty: 1,
        rating: 4.8,
        maxGroupSize: 15,
        minAge: 5,
        coverImage: "/images/kathmandu-heritage.jpg",
        images: ["/images/swayambhunath.jpg", "/images/durbar-square.jpg"],
        highlights: ["Visit UNESCO World Heritage Sites", "Explore ancient Durbar Squares", "Traditional Newari cultural experience"],
        includes: ["Professional English-speaking guide", "All entrance fees to monuments", "4 nights accommodation"],
        excludes: ["International flights", "Nepal visa fees", "Travel insurance"],
        isActive: true,
        isFeatured: true,
        metaTitle: "Cultural Heritage Tour Kathmandu Valley | Nepal Tours",
        metaDescription: "Discover Nepal's rich cultural heritage with our 5-day Kathmandu Valley tour.",
        latitude: 27.7172,
        longitude: 85.324
    },
    {
        name: "Chitwan Jungle Safari Adventure",
        slug: "chitwan-jungle-safari-adventure",
        description: "Wildlife safari in Chitwan National Park - spot rhinos, tigers, and exotic birds",
        longDescription: "Experience the thrill of the jungle in Nepal's premier wildlife destination.",
        location: "Chitwan National Park, Nepal",
        duration: "3 Days / 2 Nights",
        price: 449,
        currency: "USD",
        difficulty: 1,
        rating: 4.9,
        maxGroupSize: 12,
        minAge: 8,
        coverImage: "/images/chitwan-safari.jpg",
        images: ["/images/rhino-chitwan.jpg"],
        highlights: ["Elephant-back jungle safari", "One-horned rhinoceros spotting", "Can ride on Rapti River"],
        includes: ["2 nights jungle lodge accommodation", "All meals", "Professional naturalist guide"],
        excludes: ["International flights", "Travel insurance"],
        isActive: true,
        isFeatured: true,
        metaTitle: "Chitwan Jungle Safari | Nepal Wildlife Tour",
        metaDescription: "Experience Nepal's wildlife with our Chitwan jungle safari.",
        latitude: 27.5291,
        longitude: 84.3542
    },
    {
        name: "Pokhara Wellness & Adventure Retreat",
        slug: "pokhara-wellness-adventure-retreat",
        description: "Combine adventure activities with yoga and wellness in the beautiful lakeside city of Pokhara",
        longDescription: "Find your perfect balance between adventure and relaxation in Pokhara, Nepal's adventure capital.",
        location: "Pokhara, Nepal",
        duration: "4 Days / 3 Nights",
        price: 525,
        currency: "USD",
        difficulty: 2,
        rating: 4.7,
        maxGroupSize: 10,
        minAge: 12,
        coverImage: "/images/pokhara-lake.jpg",
        images: ["/images/paragliding-pokhara.jpg"],
        highlights: ["Tandem paragliding over Pokhara", "Daily yoga sessions", "Boating on Phewa Lake"],
        includes: ["3 nights lakeside resort accommodation", "Daily breakfast and dinner"],
        excludes: ["Flights to/from Pokhara", "Lunches"],
        isActive: true,
        isFeatured: false,
        metaTitle: "Pokhara Wellness & Adventure Retreat | Nepal Tours",
        metaDescription: "Experience the perfect blend of adventure and wellness in Pokhara.",
        latitude: 28.2096,
        longitude: 83.9856
    }
];

// Sample trek data
const sampleTreks = [
    {
        name: "Everest Base Camp Trek",
        slug: "everest-base-camp-trek",
        description: "Experience the ultimate Himalayan adventure to the base of the world's highest peak",
        longDescription: "The Everest Base Camp Trek is the crown jewel of Himalayan trekking adventures.",
        location: "Khumbu Region, Nepal",
        duration: "14 Days",
        price: 1299,
        currency: "USD",
        difficulty: 4,
        rating: 4.9,
        maxGroupSize: 12,
        minAge: 16,
        altitude: "5,364 m",
        trekGrade: "Challenging",
        coverImage: "/images/everest-base-camp.jpg",
        images: ["/images/ebc-panorama.jpg"],
        highlights: ["Stand at Everest Base Camp (5,364m)", "Panoramic views from Kala Patthar", "Visit Tengboche Monastery"],
        includes: ["International airport transfers", "Kathmandu-Lukla flights", "13 nights accommodation"],
        excludes: ["International flights", "Nepal visa fees", "Travel insurance"],
        bestSeason: ["Spring (March-May)", "Autumn (September-November)"],
        isActive: true,
        isFeatured: true,
        metaTitle: "Everest Base Camp Trek - 14 Days | Nepal Trekking",
        metaDescription: "Trek to Everest Base Camp - the ultimate Himalayan adventure.",
        latitude: 27.9881,
        longitude: 86.9250
    },
    {
        name: "Annapurna Circuit Trek",
        slug: "annapurna-circuit-trek",
        description: "Complete circuit of the Annapurna massif crossing the dramatic Thorong La Pass",
        longDescription: "The Annapurna Circuit is considered one of the world's classic long-distance treks.",
        location: "Annapurna Region, Nepal",
        duration: "16 Days",
        price: 1099,
        currency: "USD",
        difficulty: 4,
        rating: 4.8,
        maxGroupSize: 10,
        minAge: 16,
        altitude: "5,416 m",
        trekGrade: "Challenging",
        coverImage: "/images/annapurna-circuit.jpg",
        images: ["/images/thorong-la-pass.jpg"],
        highlights: ["Cross Thorong La Pass (5,416m)", "Visit sacred Muktinath temple", "Explore Manang village"],
        includes: ["Airport transfers in Kathmandu", "15 nights accommodation", "All meals during trek"],
        excludes: ["International flights", "Nepal visa fees", "Travel insurance"],
        bestSeason: ["Spring (March-May)", "Autumn (September-November)"],
        isActive: true,
        isFeatured: true,
        metaTitle: "Annapurna Circuit Trek - 16 Days | Nepal Trekking",
        metaDescription: "Complete the legendary Annapurna Circuit trek.",
        latitude: 28.5967,
        longitude: 83.8202
    },
    {
        name: "Langtang Valley Trek",
        slug: "langtang-valley-trek",
        description: "Discover the hidden valley close to Kathmandu with stunning mountain views and Tamang culture",
        longDescription: "The Langtang Valley Trek offers a perfect combination of natural beauty and cultural richness.",
        location: "Langtang Region, Nepal",
        duration: "10 Days",
        price: 799,
        currency: "USD",
        difficulty: 3,
        rating: 4.7,
        maxGroupSize: 12,
        minAge: 14,
        altitude: "4,984 m",
        trekGrade: "Moderate",
        coverImage: "/images/langtang-valley.jpg",
        images: ["/images/kyanjin-gompa.jpg"],
        highlights: ["Kyanjin Gompa viewpoint", "Langtang Lirung mountain views", "Traditional Tamang villages"],
        includes: ["Kathmandu-Syabrubesi transfers", "9 nights accommodation", "All meals during trek"],
        excludes: ["International flights", "Nepal visa", "Travel insurance"],
        bestSeason: ["Spring (March-May)", "Autumn (September-November)"],
        isActive: true,
        isFeatured: false,
        metaTitle: "Langtang Valley Trek - 10 Days | Nepal Trekking",
        metaDescription: "Trek the beautiful Langtang Valley near Kathmandu.",
        latitude: 28.2333,
        longitude: 85.5500
    },
    {
        name: "Ghorepani Poon Hill Trek",
        slug: "ghorepani-poon-hill-trek",
        description: "Short and scenic trek perfect for beginners with spectacular Annapurna and Dhaulagiri views",
        longDescription: "The Ghorepani Poon Hill Trek is the perfect introduction to Himalayan trekking.",
        location: "Annapurna Region, Nepal",
        duration: "5 Days",
        price: 449,
        currency: "USD",
        difficulty: 2,
        rating: 4.9,
        maxGroupSize: 15,
        minAge: 10,
        altitude: "3,210 m",
        trekGrade: "Easy to Moderate",
        coverImage: "/images/poon-hill-sunrise.jpg",
        images: ["/images/ghorepani-village.jpg"],
        highlights: ["Spectacular sunrise from Poon Hill", "360° Himalayan panorama", "Rhododendron forests"],
        includes: ["Pokhara-Nayapul-Pokhara transfers", "4 nights teahouse accommodation", "All meals"],
        excludes: ["Kathmandu-Pokhara transport", "Travel insurance"],
        bestSeason: ["Spring (March-May)", "Autumn (September-November)"],
        isActive: true,
        isFeatured: true,
        metaTitle: "Poon Hill Trek - 5 Days | Best Short Trek in Nepal",
        metaDescription: "Experience stunning Himalayan views on the Poon Hill trek.",
        latitude: 28.3949,
        longitude: 83.6737
    }
];

async function main() {
    console.log('🌱 Starting database seed...\n');

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    const prisma = new PrismaClient({
        log: ['error', 'warn'],
    });

    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection established\n');

        console.log('📍 Seeding tours...');
        for (const tour of sampleTours) {
            const existing = await prisma.tour.findUnique({ where: { slug: tour.slug } });
            if (existing) {
                console.log(`   ↪ Tour "${tour.name}" already exists, skipping`);
            } else {
                await prisma.tour.create({ data: tour });
                console.log(`   ✓ Created tour: ${tour.name}`);
            }
        }

        console.log('\n⛰️  Seeding treks...');
        for (const trek of sampleTreks) {
            const existing = await prisma.trek.findUnique({ where: { slug: trek.slug } });
            if (existing) {
                console.log(`   ↪ Trek "${trek.name}" already exists, skipping`);
            } else {
                await prisma.trek.create({ data: trek });
                console.log(`   ✓ Created trek: ${trek.name}`);
            }
        }

        const tourCount = await prisma.tour.count();
        const trekCount = await prisma.trek.count();
        const userCount = await prisma.user.count();
        const adminCount = await prisma.user.count({ where: { isAdmin: true } });

        console.log('\n📊 Database Summary:');
        console.log(`   • Tours: ${tourCount}`);
        console.log(`   • Treks: ${trekCount}`);
        console.log(`   • Users: ${userCount}`);
        console.log(`   • Admin Users: ${adminCount}`);

        if (adminCount === 0) {
            console.log('\n⚠️  WARNING: No admin users found!');
            console.log('   Run: tsx scripts/make-admin.ts your-email@example.com\n');
        }

        console.log('\n✅ Seeding completed successfully!\n');

    } catch (error) {
        console.error('\n❌ Error during seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
