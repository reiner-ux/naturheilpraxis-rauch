import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Loader2, Mail } from "lucide-react";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isVerifying: boolean;
}

const VerificationDialog = ({
  open,
  onOpenChange,
  email,
  onVerify,
  onResend,
  isVerifying,
}: VerificationDialogProps) => {
  const { language } = useLanguage();
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async () => {
    if (code.length !== 6) return;
    await onVerify(code);
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setCode("");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle className="font-serif">
              {language === "de"
                ? "E-Mail-Verifizierung"
                : "Email Verification"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {language === "de"
              ? "Zur rechtssicheren Übermittlung Ihres Anamnesebogens (§ 126a BGB) haben wir einen 6-stelligen Code an Ihre E-Mail gesendet."
              : "For legally secure transmission of your medical history form (§ 126a BGB), we have sent a 6-digit code to your email."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Email display */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
            <Mail className="w-4 h-4" />
            <span className="font-medium">{email}</span>
          </div>

          {/* OTP Input */}
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p className="text-xs text-muted-foreground text-center">
            {language === "de"
              ? "Der Code ist 10 Minuten gültig."
              : "The code is valid for 10 minutes."}
          </p>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={code.length !== 6 || isVerifying}
            className="w-full gap-2"
            size="lg"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === "de" ? "Wird geprüft..." : "Verifying..."}
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                {language === "de"
                  ? "Code bestätigen & absenden"
                  : "Confirm code & submit"}
              </>
            )}
          </Button>

          {/* Resend */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
            className="text-muted-foreground"
          >
            {isResending
              ? language === "de"
                ? "Wird gesendet..."
                : "Sending..."
              : language === "de"
                ? "Code erneut senden"
                : "Resend code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
