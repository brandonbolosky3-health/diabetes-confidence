"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Heart, Check, Eye, EyeOff, CheckCircle2 } from "lucide-react";

// ─── Validation Helpers ─────────────────────────────────────────────────────

function isLettersOnly(v: string) {
  return /^[a-zA-Z\s'-]+$/.test(v);
}

function isAtLeast18(dob: string): boolean {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 18;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function getPasswordStrength(pw: string): { label: string; score: number; color: string } {
  if (pw.length === 0) return { label: "", score: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: "Weak", score: 1, color: "bg-red-400" };
  if (score <= 3) return { label: "Fair", score: 2, color: "bg-amber-400" };
  return { label: "Strong", score: 3, color: "bg-green-500" };
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface FieldErrors {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  }, []);

  // Validate on blur
  const validate = useCallback(
    (field: string) => {
      markTouched(field);
      setErrors((prev) => {
        const next = { ...prev };
        switch (field) {
          case "first_name":
            if (!firstName.trim()) next.first_name = "First name is required";
            else if (!isLettersOnly(firstName))
              next.first_name = "Letters only, no numbers";
            else delete next.first_name;
            break;
          case "last_name":
            if (!lastName.trim()) next.last_name = "Last name is required";
            else if (!isLettersOnly(lastName))
              next.last_name = "Letters only, no numbers";
            else delete next.last_name;
            break;
          case "date_of_birth":
            if (!dob) next.date_of_birth = "Date of birth is required";
            else if (!isAtLeast18(dob))
              next.date_of_birth = "You must be at least 18 years old";
            else delete next.date_of_birth;
            break;
          case "email":
            if (!email.trim()) next.email = "Email is required";
            else if (!isValidEmail(email))
              next.email = "Please enter a valid email";
            else delete next.email;
            break;
          case "password":
            if (!password) next.password = "Password is required";
            else if (password.length < 8)
              next.password = "Password must be at least 8 characters";
            else delete next.password;
            // Re-validate confirm if already touched
            if (touched.has("confirm_password")) {
              if (confirmPassword && confirmPassword !== password)
                next.confirm_password = "Passwords do not match";
              else if (confirmPassword) delete next.confirm_password;
            }
            break;
          case "confirm_password":
            if (!confirmPassword)
              next.confirm_password = "Please confirm your password";
            else if (confirmPassword !== password)
              next.confirm_password = "Passwords do not match";
            else delete next.confirm_password;
            break;
        }
        return next;
      });
    },
    [firstName, lastName, dob, email, password, confirmPassword, touched, markTouched]
  );

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const strength = getPasswordStrength(password);

  const allValid =
    firstName.trim() !== "" &&
    isLettersOnly(firstName) &&
    lastName.trim() !== "" &&
    isLettersOnly(lastName) &&
    dob !== "" &&
    isAtLeast18(dob) &&
    email.trim() !== "" &&
    isValidEmail(email) &&
    password.length >= 8 &&
    confirmPassword === password;

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;

    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
      },
    });

    if (error) {
      setLoading(false);
      return setMessage(error.message);
    }

    // Insert profile row
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dob,
        email: email.trim(),
      });
    }

    setLoading(false);
    setDone(true);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 transition";

  const errorInputClass =
    "w-full px-4 py-3 rounded-xl border border-red-300 bg-[color:var(--background)] text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-red-300/30 transition";

  const getInputClass = (field: string) =>
    touched.has(field) && errors[field as keyof FieldErrors]
      ? errorInputClass
      : inputClass;

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="h-16 flex items-center px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95">
        <Link
          href="/"
          className="flex items-center gap-2"
          style={{ fontWeight: 700 }}
        >
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">Saryn Health</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[color:var(--border)] shadow-sm p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[color:var(--primary)]" />
              </div>
              <h2
                className="text-[1.4rem] text-[color:var(--foreground)] mb-2"
                style={{ fontWeight: 700 }}
              >
                Check your email
              </h2>
              <p className="text-[color:var(--muted-foreground)] text-[0.95rem]">
                We sent a confirmation link to{" "}
                <span
                  className="text-[color:var(--foreground)]"
                  style={{ fontWeight: 500 }}
                >
                  {email}
                </span>
                . Click it to activate your account.
              </p>
              <Link
                href="/login"
                className="inline-block mt-6 text-[color:var(--primary)] text-[0.9rem] hover:underline"
                style={{ fontWeight: 500 }}
              >
                Back to log in
              </Link>
            </div>
          ) : (
            <>
              <h1
                className="text-[1.75rem] text-[color:var(--foreground)] mb-1"
                style={{ fontWeight: 700 }}
              >
                Create your account
              </h1>
              <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mb-8">
                Join Saryn Health and start your personalized health journey.
              </p>

              <form onSubmit={onSignup} className="flex flex-col gap-4">
                {/* First Name / Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[0.85rem] text-[color:var(--foreground)]"
                      style={{ fontWeight: 500 }}
                    >
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => validate("first_name")}
                      placeholder="Jane"
                      className={getInputClass("first_name")}
                    />
                    {touched.has("first_name") && errors.first_name && (
                      <p className="text-[0.75rem] text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-[0.85rem] text-[color:var(--foreground)]"
                      style={{ fontWeight: 500 }}
                    >
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => validate("last_name")}
                      placeholder="Doe"
                      className={getInputClass("last_name")}
                    />
                    {touched.has("last_name") && errors.last_name && (
                      <p className="text-[0.75rem] text-red-500">
                        {errors.last_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[0.85rem] text-[color:var(--foreground)]"
                    style={{ fontWeight: 500 }}
                  >
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    onBlur={() => validate("date_of_birth")}
                    className={getInputClass("date_of_birth")}
                  />
                  {touched.has("date_of_birth") && errors.date_of_birth && (
                    <p className="text-[0.75rem] text-red-500">
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[0.85rem] text-[color:var(--foreground)]"
                    style={{ fontWeight: 500 }}
                  >
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => validate("email")}
                    placeholder="you@example.com"
                    className={getInputClass("email")}
                  />
                  {touched.has("email") && errors.email && (
                    <p className="text-[0.75rem] text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[0.85rem] text-[color:var(--foreground)]"
                    style={{ fontWeight: 500 }}
                  >
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => validate("password")}
                      placeholder="Min. 8 characters"
                      className={`${getInputClass("password")} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <Eye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                  {touched.has("password") && errors.password && (
                    <p className="text-[0.75rem] text-red-500">
                      {errors.password}
                    </p>
                  )}
                  {/* Strength indicator */}
                  {password.length > 0 && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{
                            width: `${(strength.score / 3) * 100}%`,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[0.7rem] font-medium ${
                          strength.score === 1
                            ? "text-red-500"
                            : strength.score === 2
                            ? "text-amber-500"
                            : "text-green-600"
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[0.85rem] text-[color:var(--foreground)]"
                    style={{ fontWeight: 500 }}
                  >
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => validate("confirm_password")}
                      placeholder="Re-enter your password"
                      className={`${getInputClass("confirm_password")} pr-16`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      {passwordsMatch && (
                        <CheckCircle2 className="w-4.5 h-4.5 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4.5 h-4.5" />
                        ) : (
                          <Eye className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {touched.has("confirm_password") &&
                    errors.confirm_password && (
                      <p className="text-[0.75rem] text-red-500">
                        {errors.confirm_password}
                      </p>
                    )}
                </div>

                {message && (
                  <div className="text-[0.875rem] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!allValid || loading}
                  className="w-full py-3 rounded-full bg-[color:var(--primary)] text-white text-[0.95rem] hover:opacity-90 transition-opacity disabled:opacity-40 mt-2"
                  style={{ fontWeight: 600 }}
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>

              <p className="text-center text-[0.875rem] text-[color:var(--muted-foreground)] mt-6">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[color:var(--primary)] hover:underline"
                  style={{ fontWeight: 500 }}
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
