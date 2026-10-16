import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Copy, Check, ArrowRight, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useBlogPosts } from "@/hooks/usePublicData";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: posts, isLoading } = useBlogPosts();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const post = posts?.find((p) => p.id === id);
  const allPosts = posts ?? [];
  const currentIndex = allPosts.findIndex((p) => p.id === id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = allPosts.filter((p) => p.id !== id).slice(0, 3);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
            <p className="text-muted-foreground font-medium text-sm">Loading article...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container text-center max-w-md mx-auto">
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Article Not Found</h1>
            <p className="text-muted-foreground font-medium text-sm mb-6">
              The publication you are looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const pageUrl = window.location.href;
  const whatsappShareText = encodeURIComponent(
    `Read "${post.title}" on Progressive Abia Youths: ${pageUrl}`
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast({ title: "Link copied to clipboard!", description: "Share it with your colleagues and friends." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-16 left-0 right-0 h-1 bg-primary z-50 transition-all duration-75 origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden="true"
      />

      <section className="bg-primary py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-secondary/85" />
        <div className="container relative">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-xs sm:text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>
          <div className="mb-3">
            <Badge variant="secondary" className="font-bold text-white text-xs">
              {post.category}
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl max-w-4xl leading-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/95 text-sm sm:text-base font-bold">
            <span className="flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-secondary" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-secondary" />
              {new Date(post.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-secondary" />
              {post.read_time}
            </span>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-4">
            <article className="lg:col-span-3 space-y-10">
              <div className="overflow-hidden rounded-2xl border border-border/80 shadow-md bg-muted">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-72 sm:h-[480px] object-cover"
                />
              </div>

              {/* Excerpt Lead */}
              {post.excerpt && (
                <div className="border-l-4 border-primary pl-6 py-3 font-serif-italic text-xl sm:text-2xl text-foreground/95 bg-primary/5 rounded-r-xl leading-relaxed shadow-xs">
                  {post.excerpt}
                </div>
              )}

              {/* Main Body */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-lg sm:text-xl leading-relaxed text-foreground/90 font-normal">
                <p className="whitespace-pre-wrap leading-[1.85]">{post.content}</p>
              </div>

              {/* Clickable Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t border-border/80">
                  <h3 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Tagged In
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?search=${encodeURIComponent(tag)}`}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/50"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Share Bar */}
              <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Share2 className="h-4 w-4 text-primary" />
                  <span>Share this insight with your network:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#20ba5a]"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    X (Twitter)
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877F2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#166fe5]"
                  >
                    Facebook
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="mr-1 h-3.5 w-3.5 text-green-600" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                </div>
              </div>

              {/* Prev / Next Article Navigation */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.id}`}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 mb-1">
                      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Previous Article
                    </span>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : <div />}

                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.id}`}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between text-right group sm:col-start-2"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-end gap-1 mb-1">
                      Next Article <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>

              {/* In-article CTA */}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-primary/20 p-6 sm:p-8 text-center shadow-xs">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Ready to take civic action?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Join Progressive Abia Youths and become part of the collective voice shaping governance and community development in Abia State.
                </p>
                <Button asChild className="mt-5 font-bold shadow-sm">
                  <Link to="/register">
                    Join Progressive Abia Youths <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs sticky top-24">
                <h3 className="font-display text-base font-extrabold text-foreground mb-4 border-b border-border/60 pb-2">
                  More Articles
                </h3>
                <div className="space-y-3.5">
                  {relatedPosts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/blog/${p.id}`}
                      className="group block border-b border-border/40 pb-3 last:border-0 last:pb-0"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                        {new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
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
