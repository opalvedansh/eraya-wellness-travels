import { PrismaClient } from "@prisma/client";
import { TOURS_TO_MIGRATE } from "./tours-data";
import { TREKS_TO_MIGRATE } from "./treks-data";

const prisma = new PrismaClient();

async function migrateTours() {
    console.log(`\n🚀 Starting migration of ${TOURS_TO_MIGRATE.length} tours...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const tour of TOURS_TO_MIGRATE) {
        try {
            await prisma.tour.create({
                data: {
                    ...tour,
                    currency: "USD",
                    minAge: 5,
                },
            });
            console.log(`✅ Migrated tour: "${tour.name}"`);
            successCount++;
        } catch (error: any) {
            console.error(`❌ Failed to migrate tour: "${tour.name}"`);
            console.error(`   Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`\n📊 Tours Migration Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${TOURS_TO_MIGRATE.length}\n`);

    return { successCount, errorCount };
}

async function migrateTreks() {
    console.log(`\n🚀 Starting migration of ${TREKS_TO_MIGRATE.length} treks...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const trek of TREKS_TO_MIGRATE) {
        try {
            await prisma.trek.create({
                data: {
                    ...trek,
                    currency: "USD",
                    minAge: 12,
                },
            });
            console.log(`✅ Migrated trek: "${trek.name}"`);
            successCount++;
        } catch (error: any) {
            console.error(`❌ Failed to migrate trek: "${trek.name}"`);
            console.error(`   Error: ${error.message}`);
            errorCount++;
        }
    }

    console.log(`\n📊 Treks Migration Summary:`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${TREKS_TO_MIGRATE.length}\n`);

    return { successCount, errorCount };
}

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("  TOUR & TREK MIGRATION SCRIPT");
    console.log("=".repeat(60) + "\n");

    try {
        const toursResult = await migrateTours();
        const treksResult = await migrateTreks();

        console.log("\n" + "=".repeat(60));
        console.log("  OVERALL SUMMARY");
        console.log("=".repeat(60));
        console.log(`\n✅ Total Success: ${toursResult.successCount + treksResult.successCount}`);
        console.log(`❌ Total Failed: ${toursResult.errorCount + treksResult.errorCount}`);
        console.log(`📝 Total Items: ${TOURS_TO_MIGRATE.length + TREKS_TO_MIGRATE.length}\n`);

        await prisma.$disconnect();

        if (toursResult.errorCount > 0 || treksResult.errorCount > 0) {
            process.exit(1);
        } else {
            console.log("🎉 Migration completed successfully!\n");
            process.exit(0);
        }
    } catch (error) {
        console.error("\n❌ Migration failed:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
