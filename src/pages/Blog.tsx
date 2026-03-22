import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useBlogPosts } from "@/hooks/usePublicData";

const Blog = () => {
  const { data: postsData, isLoading } = useBlogPosts();
  const blogPosts = postsData ?? [];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allCategories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

  const filtered = useMemo(() => {
    let result = blogPosts;
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || (p.tags || []).some((t) => t.includes(q)));
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [blogPosts, search, selectedCategory]);

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-white/85">Insights, stories, and updates from the Progressive Abia Youths movement.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <Button key={cat} variant={selectedCategory === cat ? "secondary" : "ghost"} size="sm" className="font-semibold" onClick={() => setSelectedCategory(cat)}>{cat}</Button>
                ))}
              </div>
              {isLoading ? (
                <p className="text-center text-muted-foreground font-medium py-20">Loading...</p>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                  <p className="font-medium">No articles found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filtered.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="overflow-hidden transition-shadow hover:shadow-md">
                        <div className="flex flex-col sm:flex-row">
                          <div className="h-48 w-full overflow-hidden sm:h-auto sm:w-48 shrink-0">
                            <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
                          </div>
                          <CardContent className="flex-1 p-5">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{post.category}</span>
                              <span className="text-xs font-medium text-muted-foreground">{post.read_time}</span>
                            </div>
                            <h2 className="mb-2 font-sans text-lg font-bold text-foreground">{post.title}</h2>
                            <p className="mb-3 text-sm font-medium text-muted-foreground line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">By {post.author} · {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                              <Link to={`/blog/${post.id}`}><Button variant="ghost" size="sm" className="font-bold text-primary">Read More <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <aside className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-4 font-display text-base font-extrabold text-foreground">Recent Posts</h3>
                  <div className="space-y-3">
                    {blogPosts.slice(0, 4).map((post) => (
                      <div key={post.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                        <h4 className="text-sm font-bold text-foreground line-clamp-2">{post.title}</h4>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">{new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <h3 className="mb-4 font-display text-base font-extrabold text-foreground">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(blogPosts.flatMap((p) => p.tags || []))).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground cursor-pointer hover:bg-muted/80" onClick={() => setSearch(tag)}>#{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
