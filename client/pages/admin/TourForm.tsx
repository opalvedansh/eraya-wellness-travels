import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { authenticatedFetch } from "@/lib/api";
import ImageUpload from "@/components/ImageUpload";
import RichTextArea from "@/components/RichTextArea";

interface ItineraryItem {
    day: number;
    title: string;
    description: string;
    meals: string; // "Breakfast, Lunch, Dinner"
    accommodation: string;
}

interface FAQItem {
    question: string;
    answer: string;
}

interface TourFormData {
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    difficulty: number;
    rating: number;
    maxGroupSize: number;
    minAge: number;
    coverImage: string;
    images: string[];
    highlights: string[];
    includes: string[];
    excludes: string[];
    itinerary: ItineraryItem[];
    faq: FAQItem[];
    latitude: number | null;
    longitude: number | null;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    isFeatured: boolean;
    tags: string[];
}

const emptyForm: TourFormData = {
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    location: "",
    duration: "",
    price: 0,
    currency: "USD",
    difficulty: 1,
    rating: 5.0,
    maxGroupSize: 15,
    minAge: 5,
    coverImage: "",
    images: [],
    highlights: [],
    includes: [],
    excludes: [],
    itinerary: [],
    faq: [],
    latitude: null,
    longitude: null,
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    isFeatured: false,
    tags: [],
};

export default function TourForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<TourFormData>(emptyForm);
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);

    // UI Local State for Lists
    const [newHighlight, setNewHighlight] = useState("");
    const [newInclude, setNewInclude] = useState("");
    const [newExclude, setNewExclude] = useState("");
    const [newImage, setNewImage] = useState("");
    const [tagInput, setTagInput] = useState("");

    const isEditMode = !!id;

    useEffect(() => {
        if (id) {
            fetchTour();
        }
    }, [id]);

    const fetchTour = async () => {
        try {
            const response = await authenticatedFetch(`/api/admin/tours/${id}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    ...emptyForm,
                    ...data,
                    itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
                    faq: Array.isArray(data.faq) ? data.faq : [],
                });
            }
        } catch (error) {
            console.error("Failed to fetch tour:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) || 0 : value,
        }));
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.checked,
        }));
    };

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        setFormData(prev => ({ ...prev, slug }));
    };

    const addToArray = (field: keyof TourFormData, value: string) => {
        if (!value.trim() || !Array.isArray(formData[field])) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[]), value.trim()],
        }));
        if (field === "highlights") setNewHighlight("");
        if (field === "includes") setNewInclude("");
        if (field === "excludes") setNewExclude("");
        if (field === "images") setNewImage("");
    };

    const removeFromArray = (field: keyof TourFormData, index: number) => {
        if (!Array.isArray(formData[field])) return;
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index),
        }));
    };

    // Itinerary Handlers
    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...prev.itinerary,
                {
                    day: prev.itinerary.length + 1,
                    title: "",
                    description: "",
                    meals: "",
                    accommodation: ""
                }
            ]
        }));
    };

    const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: any) => {
        setFormData(prev => {
            const newItinerary = [...prev.itinerary];
            newItinerary[index] = { ...newItinerary[index], [field]: value };
            return { ...prev, itinerary: newItinerary };
        });
    };

    const removeItineraryItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_, i) => i !== index)
        }));
    };

    // FAQ Handlers
    const addFAQ = () => {
        setFormData(prev => ({
            ...prev,
            faq: [...prev.faq, { question: "", answer: "" }]
        }));
    };

    const updateFAQItem = (index: number, field: keyof FAQItem, value: string) => {
        setFormData(prev => {
            const newFAQ = [...prev.faq];
            newFAQ[index] = { ...newFAQ[index], [field]: value };
            return { ...prev, faq: newFAQ };
        });
    };

    const removeFAQItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            faq: prev.faq.filter((_, i) => i !== index)
        }));
    };

    // Tag Handlers
    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.slug || !formData.description) {
            alert("Please fill in all required fields");
            return;
        }

        setSaving(true);
        try {
            // Explicitly construct payload with only known fields (Whitelist approach)
            // This prevents sending id, createdAt, updatedAt or any other unknown fields
            const payload: TourFormData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                longDescription: formData.longDescription,
                location: formData.location,
                duration: formData.duration,
                price: formData.price,
                currency: formData.currency,
                difficulty: formData.difficulty,
                rating: formData.rating,
                maxGroupSize: formData.maxGroupSize,
                minAge: formData.minAge,
                coverImage: formData.coverImage,
                images: formData.images,
                highlights: formData.highlights,
                includes: formData.includes,
                excludes: formData.excludes,
                itinerary: formData.itinerary,
                faq: formData.faq,
                latitude: formData.latitude,
                longitude: formData.longitude,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                isActive: formData.isActive,
                isFeatured: formData.isFeatured,
                tags: formData.tags,
            };

            const url = isEditMode ? `/api/admin/tours/${id}` : "/api/admin/tours";
            const method = isEditMode ? "PUT" : "POST";
            const response = await authenticatedFetch(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const bookingLink = `${window.location.origin}/booking/tour/${formData.slug}`;
                const message = `Tour ${isEditMode ? "updated" : "created"} successfully!\n\nBooking Link:\n${bookingLink}\n\nClick OK to copy the link.`;

                if (confirm(message)) {
                    // Copy to clipboard
                    navigator.clipboard.writeText(bookingLink).then(() => {
                        alert("Booking link copied to clipboard!");
                    }).catch(() => {
                        alert("Could not copy link, but you can manually copy it from the URL bar.");
                    });
                }
                navigate("/admin/tours");
            } else {
                const error = await response.json();
                alert(`Failed to save tour: ${error.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Failed to save tour:", error);
            alert("Failed to save tour");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate("/admin/tours")} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? "Edit Tour" : "Add New Tour"}</h1>
                        <p className="text-gray-600 mt-1">{isEditMode ? "Update tour information" : "Create a new tour package"}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={generateSlug} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" placeholder="e.g., Kathmandu Valley Tour" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" placeholder="kathmandu-valley-tour" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                <RichTextArea
                                    name="longDescription"
                                    value={formData.longDescription}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Enter full description. Select text and click Bold to make it bold."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tour Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                                <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent">
                                    <option value="1">1 - Easy</option>
                                    <option value="2">2 - Moderate</option>
                                    <option value="3">3 - Challenging</option>
                                    <option value="4">4 - Difficult</option>
                                    <option value="5">5 - Extreme</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size</label>
                                <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleChange} min="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                                <input type="number" name="minAge" value={formData.minAge} onChange={handleChange} min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitude
                                    <span className="text-xs text-gray-500 ml-1">(for map display)</span>
                                </label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.latitude || ''}
                                    onChange={handleChange}
                                    step="0.000001"
                                    placeholder="e.g. 27.7172"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitude
                                    <span className="text-xs text-gray-500 ml-1">(for map display)</span>
                                </label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.longitude || ''}
                                    onChange={handleChange}
                                    step="0.000001"
                                    placeholder="e.g. 85.3240"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Itinerary Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Itinerary</h2>
                            <button type="button" onClick={addItineraryDay} className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                                <Plus className="w-4 h-4 mr-1" /> Add Day
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.itinerary.map((day, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold shrink-0">
                                                {day.day}
                                            </div>
                                            <input
                                                type="text"
                                                value={day.title}
                                                onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                                                placeholder="Day Title"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary"
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeItineraryItem(index)} className="text-red-500 hover:text-red-700 p-1 ml-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="pl-13 ml-13 space-y-3">
                                        <textarea
                                            value={day.description}
                                            onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                                            placeholder="Detailed description..."
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={day.accommodation || ''}
                                                onChange={(e) => updateItineraryItem(index, 'accommodation', e.target.value)}
                                                placeholder="Accommodation"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={day.meals || ''}
                                                onChange={(e) => updateItineraryItem(index, 'meals', e.target.value)}
                                                placeholder="Meals (e.g. Breakfast, Lunch)"
                                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {formData.itinerary.length === 0 && (
                                <p className="text-center text-gray-500 py-4 italic">No itinerary days added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">FAQ</h2>
                            <button type="button" onClick={addFAQ} className="flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                                <Plus className="w-4 h-4 mr-1" /> Add Question
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.faq.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <input
                                            type="text"
                                            value={item.question}
                                            onChange={(e) => updateFAQItem(index, 'question', e.target.value)}
                                            placeholder="Question"
                                            className="font-medium flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary mb-2"
                                        />
                                        <button type="button" onClick={() => removeFAQItem(index)} className="text-red-500 hover:text-red-700 p-1 ml-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => updateFAQItem(index, 'answer', e.target.value)}
                                        placeholder="Answer"
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-primary text-sm bg-gray-50"
                                    />
                                </div>
                            ))}
                            {formData.faq.length === 0 && (
                                <p className="text-center text-gray-500 py-4 italic">No FAQs added yet.</p>
                            )}
                        </div>
                    </div>


                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
                        <div className="space-y-6">
                            {/* Cover Image with Upload */}
                            <div className="space-y-2">
                                <ImageUpload
                                    label="Cover Image"
                                    type="tour"
                                    currentImage={formData.coverImage}
                                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                                    helpText="Main image for the tour"
                                />
                                <div className="text-xs text-gray-500 mt-2">
                                    Or enter URL manually:
                                </div>
                                <input
                                    type="url"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent text-sm"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div>
                                <div className="mb-4">
                                    <ImageUpload
                                        label="Upload Gallery Image"
                                        type="tour"
                                        onUploadComplete={(url) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                images: [...prev.images, url]
                                            }));
                                        }}
                                        helpText="Upload images one at a time"
                                    />
                                </div>

                                <label className="block text-sm font-medium text-gray-700 mb-1">Or Add URL Manually</label>
                                <div className="flex gap-2">
                                    <input type="url" value={newImage} onChange={(e) => setNewImage(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent text-sm" placeholder="https://example.com/image.jpg"
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addToArray("images", newImage);
                                            }
                                        }} />
                                    <button type="button" onClick={() => addToArray("images", newImage)} className="px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition">Add</button>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img src={img} alt={`Gallery ${index + 1}`} className="w-20 h-20 object-cover rounded-lg" />
                                                <button type="button" onClick={() => removeFromArray("images", index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Highlights</h2>
                        <div className="flex gap-2 mb-3">
                            <input type="text" value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} placeholder="Add a highlight" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addToArray("highlights", newHighlight);
                                    }
                                }} />
                            <button type="button" onClick={() => addToArray("highlights", newHighlight)} className="px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition">Add</button>
                        </div>
                        {formData.highlights.length > 0 && (
                            <ul className="space-y-2">
                                {formData.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                                        <span>✓ {highlight}</span>
                                        <button type="button" onClick={() => removeFromArray("highlights", index)} className="text-red-600 hover:text-red-800">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Includes/Excludes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={newInclude} onChange={(e) => setNewInclude(e.target.value)} placeholder="Add included item" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent text-sm"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addToArray("includes", newInclude);
                                        }
                                    }} />
                                <button type="button" onClick={() => addToArray("includes", newInclude)} className="px-3 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition text-sm">Add</button>
                            </div>
                            {formData.includes.length > 0 && (
                                <ul className="space-y-2">
                                    {formData.includes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                            <span>• {item}</span>
                                            <button type="button" onClick={() => removeFromArray("includes", index)} className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h2>
                            <div className="flex gap-2 mb-3">
                                <input type="text" value={newExclude} onChange={(e) => setNewExclude(e.target.value)} placeholder="Add excluded item" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent text-sm"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addToArray("excludes", newExclude);
                                        }
                                    }} />
                                <button type="button" onClick={() => addToArray("excludes", newExclude)} className="px-3 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition text-sm">Add</button>
                            </div>
                            {formData.excludes.length > 0 && (
                                <ul className="space-y-2">
                                    {formData.excludes.map((item, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                            <span>• {item}</span>
                                            <button type="button" onClick={() => removeFromArray("excludes", index)} className="text-red-600 hover:text-red-800 text-xs">Remove</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
                        <p className="text-sm text-gray-600 mb-4">Add custom tags to highlight this tour (e.g., Best Seller, Popular, New, Limited Seats)</p>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-primary focus:border-transparent"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition"
                            >
                                Add Tag
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-red-600 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {formData.tags.length === 0 && (
                            <p className="text-sm text-gray-500 italic mt-2">No tags added yet</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleCheckbox} className="w-5 h-5 text-green-primary focus:ring-green-primary border-gray-300 rounded" />
                                <div>
                                    <p className="font-medium text-gray-900">Active</p>
                                    <p className="text-sm text-gray-600">Tour is visible to visitors</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleCheckbox} className="w-5 h-5 text-green-primary focus:ring-green-primary border-gray-300 rounded" />
                                <div>
                                    <p className="font-medium text-gray-900">Featured</p>
                                    <p className="text-sm text-gray-600">Show in featured tours section</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={saving} className="flex items-center px-6 py-3 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition disabled:opacity-50">
                            <Save className="w-5 h-5 mr-2" />
                            {saving ? "Saving..." : isEditMode ? "Update Tour" : "Create Tour"}
                        </button>
                        <button type="button" onClick={() => navigate("/admin/tours")} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
