import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { sendEmailVerification } from "firebase/auth";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as any)?.email || null;
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    // If user is not signed in, show message prompting them to sign in after verifying
    if (!auth.currentUser) {
      setMessage("Please verify your email using the link we sent. After verification, sign in to continue.");
    } else if (auth.currentUser && auth.currentUser.emailVerified) {
      // Already verified — navigate to dashboard
      navigate("/dashboard");
    } else {
      setMessage("We sent a verification link. Please check your inbox and click the link to verify.");
    }
  }, [navigate]);

  const handleCheckVerified = async () => {
    if (!auth.currentUser) {
      setMessage("You are signed out. Please sign in after verifying your email.");
      return;
    }

    setIsChecking(true);
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setMessage("Email verified — redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setMessage("Still not verified. Please check your email and click the verification link.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error checking verification status. Try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    if (!auth.currentUser) {
      setMessage("You are signed out. Please sign in to request another verification email.");
      return;
    }
    setResendLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setMessage("Verification email resent — check your inbox.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="glass-card p-6 max-w-lg w-full space-y-4">
        <h2 className="text-lg font-semibold">Verify your email</h2>
        {email && <p className="text-sm text-muted-foreground">We sent a verification link to <strong>{email}</strong>.</p>}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="hero" onClick={handleCheckVerified} disabled={isChecking}>
            {isChecking ? "Checking..." : "I have verified"}
          </Button>
          <Button variant="ghost" onClick={handleResend} disabled={resendLoading}>
            {resendLoading ? "Resending..." : "Resend verification"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">If you don't receive the email, check spam or try the resend button.</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
