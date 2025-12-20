import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { blogPosts, categories, BlogPost } from "@/data/blogPosts";

export default function Blog() {
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [postsToShow, setPostsToShow] = useState(9);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...blogPosts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case "oldest":
          return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
        case "a-z":
          return a.title.localeCompare(b.title);
        case "reading-time":
          return parseInt(a.readTime) - parseInt(b.readTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, sortBy]);

  // Pagination
  const visiblePosts = filteredPosts.slice(0, postsToShow);
  const hasMore = postsToShow < filteredPosts.length;

  // Featured posts (separate from main listing)
  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  //Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTags([]);
    setSortBy("latest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <FloatingWhatsAppButton />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-primary/10 via-blue-accent/5 to-beige pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark mb-4 sm:mb-6 tracking-tight">
              Travel & Wellness Insights
            </h1>
            <p className="text-base sm:text-lg text-text-dark/70 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Expert guides, cultural insights, and wellness tips to enrich your journey through South Asia and beyond.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-dark/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border bg-white shadow-premium-sm focus:border-green-primary focus:outline-none transition-colors text-text-dark placeholder:text-text-dark/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark/40 hover:text-text-dark transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {!searchQuery && !hasActiveFilters && featuredPosts.length > 0 && (
        <section className="py-12 sm:py-16 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl font-black text-green-primary mb-6 sm:mb-8">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {featuredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium transition-all duration-300 border border-border"
              >
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-green-primary text-white text-xs font-bold rounded-full mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-text-dark/70 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-text-dark/60">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{post.author.name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Filters and Blog Grid */}
      <section className="flex-grow py-8 sm:py-12 px-3 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedCategory === category
                      ? "bg-green-primary text-white shadow-lg"
                      : "bg-white text-text-dark border border-border hover:border-green-primary"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-white text-text-dark font-semibold text-sm focus:border-green-primary focus:outline-none cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A-Z</option>
              <option value="reading-time">Reading Time</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-text-dark/60 mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 12).map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedTags.includes(tag)
                        ? "bg-blue-accent text-white"
                        : "bg-white text-text-dark border border-border hover:border-blue-accent"
                      }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-text-dark/60">
            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
          </p>
        </div>

        {/* Blog Grid */}
        <AnimatePresence mode="wait">
          {visiblePosts.length > 0 ? (
            <motion.div
              key="blog-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {visiblePosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-premium-sm hover:shadow-premium transition-all duration-300 border border-border flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 bg-green-primary text-white text-xs font-bold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-black text-text-dark text-lg mb-2 line-clamp-2 group-hover:text-green-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-dark/70 text-sm mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-text-dark/60">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-dark/60">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-beige text-text-dark/60 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-primary/10 rounded-full mb-4">
                <Search className="h-8 w-8 text-green-primary" />
              </div>
              <h3 className="text-2xl font-black text-text-dark mb-2">No Articles Found</h3>
              <p className="text-text-dark/60 mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-green-primary text-white font-bold rounded-lg hover:bg-green-primary/90 transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setPostsToShow(prev => prev + 9)}
              className="px-8 py-4 bg-white border-2 border-green-primary text-green-primary font-bold rounded-lg hover:bg-green-primary hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto shadow-premium-sm hover:shadow-premium"
            >
              Load More Articles
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="text-sm text-text-dark/60 mt-3">
              Showing {visiblePosts.length} of {filteredPosts.length}
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
