import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { LogIn, Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AdminLogin = () => {
  const { isAdmin, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setSubmitting(true);
    try {
      const { success, error } = await signIn(email, password);
      if (!success) {
        setErrorMessage(error || "Invalid login credentials. Please try again.");
        toast.error(error || "Invalid email or password.");
      } else {
        toast.success("Authentication successful! Welcome to the Admin Portal.");
        navigate("/admin");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        {/* Back Link */}
        <div className="text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Public Website
          </Link>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-5 pt-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <img src="/progressive-logo.png" alt="PAY" className="h-9 w-auto object-contain" />
            </div>
            <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
              Executive Admin Portal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Progressive Abia Youths Secretariat CMS
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-6 pb-8">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Admin Email Address
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="progressiveabiaweb@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11 text-sm bg-background font-medium"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 h-11 text-sm bg-background"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all mt-2"
              >
                <LogIn className="mr-2 h-4 w-4" />
                {submitting ? "Authenticating..." : "Sign in to Admin Console"}
              </Button>
            </form>

            <div className="flex items-start gap-2.5 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <p className="leading-snug">
                Portal protected by session token encryption and rate-limiting brute force cooldowns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
