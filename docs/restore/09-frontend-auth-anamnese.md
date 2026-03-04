# Restore Part 9: Frontend – Auth, AuthContext, Anamnesebogen, VerificationDialog

**Datum:** 04.03.2026

---

## src/contexts/AuthContext.tsx (119 Zeilen) – VOLLSTÄNDIG

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, session: null, loading: true, isAdmin: false, signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
        if (isMounted) setIsAdmin(!error && data === true);
      } catch { if (isMounted) setIsAdmin(false); }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => checkAdminRole(session.user.id), 0);
        if (event === 'SIGNED_IN') {
          supabase.from('audit_log').insert({
            user_id: session.user.id,
            action: 'login',
            details: { method: 'email', email: session.user.email },
          }).then(() => {}, () => {});
        }
      } else { setIsAdmin(false); }
    });

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) await checkAdminRole(session.user.id);
      } finally { if (isMounted) setLoading(false); }
    };

    initializeAuth();
    return () => { isMounted = false; subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    if (user?.id) {
      await supabase.from('audit_log').insert({ user_id: user.id, action: 'logout', details: {} }).then(() => {}, () => {});
    }
    await supabase.auth.signOut();
    setUser(null); setSession(null); setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

## src/pages/Auth.tsx (894 Zeilen) – Kernlogik

**Vollständiger Quellcode im Repo.** Architektur-Dokumentation:

### State
```typescript
type AuthStep = 'credentials' | 'verification' | 'reset_password';
type AuthMode = 'login' | 'registration' | 'password_reset';
```

### Login-Flow (Zeilen 54-133)
1. `signInWithPassword(email, password)`
2. Admin-Check: `supabase.rpc('has_role', { _user_id, _role: 'admin' })`
3. Admin → Direkt-Login, navigate('/')
4. Nicht-Admin → `signOut()` → `request-verification-code` (type: login) → Step: verification

### Registration-Flow (Zeilen 136-203)
1. `request-verification-code` (type: registration, mit password)
2. Ghost-Account-Erkennung (already registered → Switch zu Login)
3. Step: verification

### Password-Reset-Flow (Zeilen 206-251)
1. `signOut()` (stale auth bereinigen)
2. `request-verification-code` (type: password_reset)
3. Step: reset_password

### 2FA Verification (Zeilen 254-300)
1. `verify-code` (type: login) → bekommt `hashed_token`
2. `supabase.auth.verifyOtp({ token_hash, type: 'magiclink' })`
3. navigate('/erstanmeldung')

### Registration Verification (Zeilen 303-350)
1. `verify-code` (type: registration) → email_confirm: true
2. `signInWithPassword(email, password)` → Auto-Login
3. navigate('/erstanmeldung')

### UI
- Titel: **"Praxis-Login"** (neutral für Admins + Patienten)
- Beschreibung: "Sichere Anmeldung mit Passwort und 2FA"
- Tabs: Anmelden / Registrieren
- Passwort-Toggle (Eye/EyeOff)
- Passwort-vergessen Link → password_reset Modus

---

## src/components/anamnese/VerificationDialog.tsx (146 Zeilen) – VOLLSTÄNDIG

```typescript
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
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

const VerificationDialog = ({ open, onOpenChange, email, onVerify, onResend, isVerifying }: VerificationDialogProps) => {
  const { language } = useLanguage();
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async () => { if (code.length !== 6) return; await onVerify(code); };
  const handleResend = async () => { setIsResending(true); try { await onResend(); setCode(""); } finally { setIsResending(false); } };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <DialogTitle className="font-serif">
              {language === "de" ? "E-Mail-Verifizierung" : "Email Verification"}
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {language === "de"
              ? "Zur rechtssicheren Übermittlung Ihres Anamnesebogens (§ 126a BGB) haben wir einen 6-stelligen Code an Ihre E-Mail gesendet."
              : "For legally secure transmission of your medical history form (§ 126a BGB), we have sent a 6-digit code to your email."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
            <Mail className="w-4 h-4" /><span className="font-medium">{email}</span>
          </div>
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground text-center">
            {language === "de" ? "Der Code ist 10 Minuten gültig." : "The code is valid for 10 minutes."}
          </p>
          <Button onClick={handleSubmit} disabled={code.length !== 6 || isVerifying} className="w-full gap-2" size="lg">
            {isVerifying ? <><Loader2 className="w-4 h-4 animate-spin" />{language === "de" ? "Wird geprüft..." : "Verifying..."}</>
              : <><Shield className="w-4 h-4" />{language === "de" ? "Code bestätigen & absenden" : "Confirm code & submit"}</>}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResend} disabled={isResending} className="text-muted-foreground">
            {isResending ? (language === "de" ? "Wird gesendet..." : "Sending...") : (language === "de" ? "Code erneut senden" : "Resend code")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
```

---

## src/pages/Anamnesebogen.tsx (930 Zeilen) – Kernlogik

**Vollständiger Quellcode im Repo.** Architektur-Dokumentation:

### State-Management
- `formData: AnamneseFormData` (initialFormData aus anamneseFormData.ts)
- `selectedLayout: LayoutType` (null → wizard | accordion)
- `wizardStep: number` (0-26)
- `iaaData: Record<string, number>` (IAA-Fragebogen)
- `showVerification: boolean` (VerificationDialog)
- `submissionId, tempUserId` (für 2FA-Flow)

### localStorage-Persistenz (Zeilen 487-558)
- **User-specific:** `anamnesebogen:draft:{userId}`
- **Email-Cache (Fallback):** `anamnesebogen:email-cache:{email}`
- Autosave alle 300ms (debounced)
- Speichert: formData, selectedLayout, wizardStep, openAccordionItems, iaaData
- Draft wird nach erfolgreicher Einreichung gelöscht
- Email-Cache bleibt (für Account-Reset-Szenarien)

### Submit-Flow (Zeilen 574-639)
1. Pflichtfeld-Validierung (Name, Email)
2. Signatur-Validierung (Datum, Name, Bestätigung, Datenschutz, Patientenaufklärung)
3. `submit-anamnesis` action:submit
4. VerificationDialog öffnen

### Verify-Flow (Zeilen 641-715)
1. PDF Base64 generieren (`generateAnamnesePdfBase64`)
2. `submit-anamnesis` action:confirm mit pdfBase64
3. Draft löschen, Email-Cache speichern
4. IAA-Daten speichern (wenn vorhanden)
5. Redirect zu /erstanmeldung (wenn daher gekommen)

### Layout-Komponenten
- **LayoutSelector** (Zeilen 129-248): Wizard vs Accordion Auswahl
- **WizardLayout** (Zeilen 263-381): Schritt-für-Schritt mit Emoji-Progress-Bar
- **AccordionLayout** (Zeilen 397-466): Alle Sektionen aufklappbar

### 27 Sektions-Komponenten (Zeilen 771-829)
Jede Sektion ist eine eigene Komponente mit Props `{ formData, updateFormData }`.
