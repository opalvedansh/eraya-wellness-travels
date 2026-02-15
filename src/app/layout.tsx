import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    weight: ["700", "800"],
});

export const metadata: Metadata = {
    title: "Eraya Wellness Travels - Discover Wellness in the Himalayas",
    description:
        "Journey through breathtaking landscapes where wellness, spirituality, and adventure come together. Explore sacred destinations, trek mountain peaks, and discover wellness through travel.",
    keywords: [
        "wellness travel",
        "himalayan treks",
        "spiritual travel",
        "nepal tours",
        "adventure travel",
        "yoga retreat",
        "meditation",
    ],
    openGraph: {
        title: "Eraya Wellness Travels",
        description: "Discover Wellness in the Himalayas",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
