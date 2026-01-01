import { useState, useEffect } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";

// Interfaces to match the content structure
// Hero: title, subtitle
// Story: title, content (array of paragraphs?), quote, quoteAuthor
// Milestones: { year, title, description, image }[]
// Team: { name, role, bio, image, linkedin, instagram }[]
// Stats: { number, label, icon }[] (maybe fixed icons for now?)
// Partners: { name, logo (emoji or url) }[]

interface Milestone {
    year: string;
    title: string;
    description: string;
    image: string;
}

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    image: string;
    linkedin: string;
    instagram: string;
}

interface Partner {
    name: string;
    logo: string;
}

interface Stat {
    number: string;
    label: string;
    icon: string;
}

interface AboutPageContent {
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
    milestones: Milestone[];
    team: TeamMember[];
    partners: Partner[];
    stats: Stat[];
}

const defaultContent: AboutPageContent = {
    hero: {
        title: "About Eraya",
        subtitle: "Discover our mission to create meaningful adventure travel experiences that transform lives",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"
    },
    story: {
        title: "From a Trek to a Movement",
        paragraphs: [
            "It all started in 2023 when our founder, Reeju, was trekking to Annapurna Base Camp. He met a local Sherpa family struggling to preserve their cultural heritage while adapting to mass tourism. That conversation changed everything.",
            "We realized travelers wanted more than selfies at mountaintops—they craved authentic connections. Local communities needed sustainable income, not exploitative tourism. Eraya Wellness Travels was born to bridge that gap.",
            "Today, we've facilitated over 2,000+ journeys that empower local guides, preserve cultural traditions, and transform travelers into advocates for responsible exploration."
        ],
        quote: "Travel isn't about ticking boxes on a bucket list. It's about becoming part of a global family that cares for each other and our planet.",
        quoteAuthor: "Reeju, Founder",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=500&fit=crop"
    },
    milestones: [
        {
            year: "2023",
            title: "The Beginning",
            description: "Founded with a mission to transform adventure travel through authentic cultural experiences and sustainable practices.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        }
    ],
    team: [],
    partners: [],
    stats: [
        { number: "2,000+", label: "Happy Travelers", icon: "😊" },
        { number: "20+", label: "Destinations", icon: "🗺️" },
        { number: "4.9/5", label: "Average Rating", icon: "⭐" },
        { number: "200+", label: "Local Partners", icon: "🤝" }
    ]
};

export default function AboutSettings() {
    const [content, setContent] = useState<AboutPageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/content/about_page");
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    // Merge with default content to ensure structure exists
                    setContent({ ...defaultContent, ...data });
                }
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await authenticatedFetch("/api/admin/settings/about_page", {
                method: "PUT",
                body: JSON.stringify({
                    value: content,
                    description: "Content for the About Us page"
                }),
            });

            if (response.ok) {
                alert("Settings saved successfully!");
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    // Helper to update deeply nested state
    const updateHero = (field: keyof AboutPageContent["hero"], value: string) => {
        setContent(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    };

    const updateStory = (field: keyof AboutPageContent["story"], value: any) => {
        setContent(prev => ({ ...prev, story: { ...prev.story, [field]: value } }));
    };

    const updateStoryParagraph = (index: number, value: string) => {
        setContent(prev => {
            const newParagraphs = [...prev.story.paragraphs];
            newParagraphs[index] = value;
            return { ...prev, story: { ...prev.story, paragraphs: newParagraphs } };
        });
    };

    /* Lists Helpers */
    const updateListItem = (listName: "milestones" | "team" | "partners" | "stats", index: number, field: string, value: string) => {
        setContent(prev => {
            const newList = [...(prev[listName] as any[])];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [listName]: newList };
        });
    };

    const addListItem = (listName: "milestones" | "team" | "partners" | "stats", emptyItem: any) => {
        setContent(prev => ({
            ...prev,
            [listName]: [...(prev[listName] as any[]), emptyItem]
        }));
    };

    const removeListItem = (listName: "milestones" | "team" | "partners" | "stats", index: number) => {
        setContent(prev => ({
            ...prev,
            [listName]: (prev[listName] as any[]).filter((_, i) => i !== index)
        }));
    };


    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <AdminLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">About Page Settings</h1>
                        <p className="text-gray-600">Edit content for the public About Us page</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition disabled:opacity-50"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Hero Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <input type="text" value={content.hero.title} onChange={e => updateHero("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <textarea rows={2} value={content.hero.subtitle} onChange={e => updateHero("subtitle", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                                <input type="url" value={content.hero.image} onChange={e => updateHero("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </section>

                    {/* Story Section */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                <input type="text" value={content.story.title} onChange={e => updateStory("title", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Narrative Paragraphs</label>
                                {content.story.paragraphs.map((p, i) => (
                                    <textarea key={i} rows={3} value={p} onChange={e => updateStoryParagraph(i, e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-2" />
                                ))}
                                <button className="text-sm text-green-600 font-medium" onClick={() => updateStory("paragraphs", [...content.story.paragraphs, ""])}>+ Add Paragraph</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                                    <textarea rows={2} value={content.story.quote} onChange={e => updateStory("quote", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote Author</label>
                                    <input type="text" value={content.story.quoteAuthor} onChange={e => updateStory("quoteAuthor", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Story Image URL</label>
                                <input type="url" value={content.story.image} onChange={e => updateStory("image", e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </section>

                    {/* Milestones */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Milestones</h2>
                            <button onClick={() => addListItem("milestones", { year: "2024", title: "", description: "", image: "" })} className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-lg font-medium">+ Add Milestone</button>
                        </div>
                        <div className="space-y-4">
                            {content.milestones.map((item, i) => (
                                <div key={i} className="border p-4 rounded-lg relative bg-gray-50">
                                    <button onClick={() => removeListItem("milestones", i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <input type="text" placeholder="Year" value={item.year} onChange={e => updateListItem("milestones", i, "year", e.target.value)} className="border p-2 rounded" />
                                        <input type="text" placeholder="Title" value={item.title} onChange={e => updateListItem("milestones", i, "title", e.target.value)} className="border p-2 rounded md:col-span-3" />
                                        <textarea placeholder="Description" rows={2} value={item.description} onChange={e => updateListItem("milestones", i, "description", e.target.value)} className="border p-2 rounded md:col-span-4" />
                                        <input type="url" placeholder="Image URL" value={item.image} onChange={e => updateListItem("milestones", i, "image", e.target.value)} className="border p-2 rounded md:col-span-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}

