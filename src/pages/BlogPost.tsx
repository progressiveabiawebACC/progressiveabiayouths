import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { useBlogPosts } from "@/hooks/usePublicData";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading } = useBlogPosts();
  const post = posts?.find((p) => p.id === id);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground font-medium">Loading article...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground font-medium mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog">
              <Button><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl max-w-3xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80 text-sm font-medium">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.read_time}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-4">
            <article className="lg:col-span-3">
              <div className="mb-8 overflow-hidden rounded-lg">
                <img src={post.image_url} alt={post.title} className="w-full h-64 sm:h-80 object-cover" />
              </div>
              <Badge variant="secondary" className="mb-4 font-bold">{post.category}</Badge>
              <div className="prose prose-lg max-w-none">
                <p className="text-base font-medium text-muted-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </article>
            <aside className="space-y-6">
              <div className="rounded-lg border border-border p-5">
                <h3 className="font-display text-base font-extrabold text-foreground mb-4">More Articles</h3>
                <div className="space-y-3">
                  {posts?.filter((p) => p.id !== id).slice(0, 4).map((p) => (
                    <Link key={p.id} to={`/blog/${p.id}`} className="block border-b border-border/50 pb-3 last:border-0 last:pb-0 hover:opacity-80 transition-opacity">
                      <h4 className="text-sm font-bold text-foreground line-clamp-2">{p.title}</h4>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">{new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
