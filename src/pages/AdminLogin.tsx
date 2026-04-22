import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="flex h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ 
          title: "Login failed", 
          description: error.message, 
          variant: "destructive" 
        });
      } else {
        // Wait a small bit for the auth state change to propagate and checkAdmin to run
        // although useAuth useEffect now handles this more reliably
      }
    } catch (error: any) {
      toast({ 
        title: "An error occurred", 
        description: error.message || "Failed to sign in", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // If user is logged in but not an admin, show an access denied state
  if (user && !isAdmin && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <LogIn className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="font-display text-2xl font-extrabold text-foreground">Access Denied</CardTitle>
            <p className="text-sm font-medium text-muted-foreground">
              You do not have administrative privileges to access this area.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full font-bold" onClick={() => window.location.href = "/"}>
              Return to Website
            </Button>
            <Button variant="ghost" className="w-full text-sm font-semibold" onClick={() => (useAuth as any)().signOut()}>
              Sign out and try another account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/progressive-logo.png" alt="PAY" className="mx-auto mb-4 h-16 w-auto" />
          <CardTitle className="font-display text-2xl font-extrabold text-foreground">Admin Login</CardTitle>
          <p className="text-sm font-medium text-muted-foreground">Sign in to manage the website</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full font-bold" disabled={submitting}>
              <LogIn className="mr-2 h-4 w-4" /> {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
