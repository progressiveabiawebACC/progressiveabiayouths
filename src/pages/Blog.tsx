import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ArrowRight, X, Clock, Calendar, User, Tag } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useBlogPosts } from "@/hooks/usePublicData";

const Blog = () => {
  const { data: postsData, isLoading } = useBlogPosts();
  const blogPosts = postsData ?? [];
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    const q = searchParams.get("search");
    const cat = searchParams.get("category");
    if (q !== null) setSearch(q);
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  const allCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  }, [blogPosts]);

  const allTags = useMemo(() => {
    return Array.from(new Set(blogPosts.flatMap((p) => p.tags || [])));
  }, [blogPosts]);

  const filtered = useMemo(() => {
    let result = blogPosts;
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          p.author.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [blogPosts, search, selectedCategory]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val) setSearchParams({ search: val });
    else setSearchParams({});
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams(search ? { category: cat, search } : { category: cat });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSearchParams({});
  };

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">Articles & Perspectives</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/90">
            Insights, opinions, policy recommendations, and stories from the youth movement in Abia State.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Main Articles List */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles, topics, or authors..."
                  className="pl-10 pr-9 h-11 text-sm bg-card"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="mb-8 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Topic:
                </span>
                {allCategories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "secondary" : "outline"}
                    size="sm"
                    className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                      selectedCategory === cat ? "font-bold shadow-xs" : "border-border/80"
                    }`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {isLoading ? (
                <div className="py-24 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
                  <p className="text-muted-foreground font-medium text-sm">Loading articles...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-16 text-center max-w-lg mx-auto p-6 bg-card">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                  <h3 className="font-display text-base font-bold text-foreground">No articles found</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1 mb-5">
                    No articles match your current search terms or category selection.
                  </p>
                  <Button onClick={resetFilters} variant="outline" size="sm" className="font-bold">
                    Reset Search & Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filtered.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 border border-border/80 group bg-card">
                        <div className="flex flex-col sm:flex-row">
                          <Link
                            to={`/blog/${post.id}`}
                            className="h-56 w-full overflow-hidden sm:h-auto sm:w-64 shrink-0 bg-muted relative"
                          >
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <Badge className="absolute top-3.5 left-3.5 sm:hidden bg-primary text-white text-xs font-bold px-3 py-1">
                              {post.category}
                            </Badge>
                          </Link>

                          <CardContent className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="mb-3 hidden sm:flex items-center gap-3">
                                <Badge variant="secondary" className="text-xs font-bold px-3 py-0.5">
                                  {post.category}
                                </Badge>
                                <span className="text-xs sm:text-sm font-bold text-foreground/80 flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-secondary" /> {post.read_time}
                                </span>
                              </div>

                              <Link to={`/blog/${post.id}`}>
                                <h2 className="mb-2.5 font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {post.title}
                                </h2>
                              </Link>

                              <p className="mb-4 text-sm sm:text-base font-normal text-foreground/80 line-clamp-2 leading-relaxed">
                                {post.excerpt}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-4 border-t border-border/70 text-sm font-semibold text-foreground/80">
                              <span className="flex items-center gap-2 text-xs sm:text-sm">
                                <User className="h-4 w-4 text-primary shrink-0" />
                                <span className="truncate max-w-[160px] sm:max-w-none">{post.author}</span>
                                <span>•</span>
                                <span>{new Date(post.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
                              </span>
                              <Link to={`/blog/${post.id}`} className="self-start sm:self-auto">
                                <Button variant="ghost" size="sm" className="font-bold text-primary group-hover:translate-x-1 transition-transform p-0 h-auto text-sm">
                                  Read Article <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Recent Articles */}
              <Card className="border border-border/80 shadow-xs">
                <CardContent className="p-5">
                  <h3 className="mb-4 font-display text-base font-extrabold text-foreground border-b border-border/60 pb-2">
                    Recent Articles
                  </h3>
                  <div className="space-y-3.5">
                    {blogPosts.slice(0, 4).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="group block border-b border-border/40 pb-3 last:border-0 last:pb-0"
                      >
                        <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>
                        <p className="mt-1 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags Cloud */}
              {allTags.length > 0 && (
                <Card className="border border-border/80 shadow-xs">
                  <CardContent className="p-5">
                    <h3 className="mb-4 font-display text-base font-extrabold text-foreground border-b border-border/60 pb-2">
                      Explore Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="rounded-full bg-muted/80 px-2.5 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-primary/10 hover:text-primary cursor-pointer border border-border/50"
                          onClick={() => handleSearchChange(tag)}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
