// Simplified AboutPage interface for usage in About.tsx
export interface AboutPageContent {
    hero: {
        title: string;
        subtitle: string;
        image: string;
    };
    story: {
        title: string;
        paragraphs: string[];
        quote: string;
        quoteAuthor: string;
        image: string;
    };
    milestones: {
        year: string;
        title: string;
        description: string;
        image: string;
    }[];
    team: {
        name: string;
        role: string;
        bio: string;
        image: string;
        linkedin: string;
        instagram: string;
    }[];
    partners: {
        name: string;
        logo: string;
    }[];
    stats: {
        number: string;
        label: string;
        icon: string;
    }[];
}
