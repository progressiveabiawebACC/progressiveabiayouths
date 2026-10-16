import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { LogIn, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const { isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { success, error } = signIn(password);
      if (!success) {
        toast.error(error || "Incorrect password. Please try again.");
      } else {
        toast.success("Welcome! Signing you into the Admin Console...");
        navigate("/admin");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="border-border/80 shadow-xl">
          <CardHeader className="text-center pb-5">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <img src="/progressive-logo.png" alt="PAY" className="h-10 w-auto object-contain" />
            </div>
            <CardTitle className="font-display text-2xl font-extrabold text-foreground">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progressive Abia Youths CMS
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Admin Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="password"
                    required
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-11 text-sm bg-background"
                    autoComplete="current-password"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {submitting ? "Signing in..." : "Sign in to Admin"}
              </Button>
            </form>

            <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary/60" />
              <p>
                Access is restricted to authorised administrators only. Contact the site owner if you need access.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Progressive Abia Youths
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
