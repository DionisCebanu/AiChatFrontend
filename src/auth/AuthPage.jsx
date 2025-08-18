import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import AuthNotice from '@/components/AuthNotice';
import ThemeToggle from '@/components/ThemeToggle';
import { getTheme, setTheme as saveTheme } from '@/services/storage';

const AuthPage = () => {
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [theme, setTheme] = useState(getTheme());
  const shouldReduceMotion = useReducedMotion();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const loginIdentifierRef = useRef(null);
  const loginPasswordRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const validateSignup = () => {
    const newErrors = {};
    if (signupUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
      if (!Object.keys(newErrors).length) usernameRef.current?.focus();
    }
    if (!/\S+@\S+\.\S+/.test(signupEmail)) {
      newErrors.email = 'Please enter a valid email address.';
      if (!Object.keys(newErrors).length) emailRef.current?.focus();
    }
    if (signupPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      if (!Object.keys(newErrors).length) passwordRef.current?.focus();
    }
    if (signupPassword !== signupConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      if (!Object.keys(newErrors).length) confirmPasswordRef.current?.focus();
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await signup({
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        remember: rememberMe
      });
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      await login({
        login: loginIdentifier,
        password: loginPassword,
        remember: rememberMe
      });
    } catch (error) {
      setErrors({ form: error.message });
      loginPasswordRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-destructive text-xs mt-1" role="alert" aria-live="polite">
        {errors[field]}
      </p>
    );

  // Shared card styles
  const cardClass =
    "rounded-2xl border shadow-lg bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 " +
    "border-border p-6 sm:p-8";

  return (
    <div className="min-h-svh relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      {/* Dynamic background blobs (motion-safe) */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="pointer-events-none absolute -top-20 -right-16 h-72 w-72 sm:h-96 sm:w-96 rounded-full blur-3xl bg-gradient-to-br from-indigo-500/40 to-purple-600/40"
          />
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 sm:h-[26rem] sm:w-[26rem] rounded-full blur-3xl bg-gradient-to-br from-sky-400/30 to-emerald-400/30"
          />
        </>
      )}

      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-[520px]"
      >
        {/* Header / Branding */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20 ring-1 ring-white/10 mb-4">
            <span className="text-white text-2xl font-bold tracking-tight">AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Welcome Back!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in or create an account to continue
          </p>
        </div>

        {/* Auth card */}
        <div className={cardClass}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary/10">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary/10">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="mt-5"
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-identifier">Username or Email</Label>
                    <Input
                      ref={loginIdentifierRef}
                      id="login-identifier"
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      required
                      autoComplete="username"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        ref={loginPasswordRef}
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        // shadcn Checkbox can pass boolean | "indeterminate"
                        onCheckedChange={(v) => setRememberMe(!!v)}
                      />
                      <span className="text-sm text-muted-foreground select-none">Remember me</span>
                    </label>
                  </div>

                  {errors.form && (
                    <p className="text-destructive text-sm text-center" role="alert" aria-live="polite">
                      {errors.form}
                    </p>
                  )}

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                </form>
              </motion.div>
            </TabsContent>

            {/* SIGN UP */}
            <TabsContent value="signup">
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-5"
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      ref={usernameRef}
                      id="signup-username"
                      value={signupUsername}
                      onChange={e => setSignupUsername(e.target.value)}
                      required
                      autoComplete="username"
                      className="h-11"
                    />
                    {renderError('username')}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      ref={emailRef}
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="h-11"
                    />
                    {renderError('email')}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        ref={passwordRef}
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="pr-10 h-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {renderError('password')}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      ref={confirmPasswordRef}
                      id="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signupConfirmPassword}
                      onChange={e => setSignupConfirmPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="h-11"
                    />
                    {renderError('confirmPassword')}
                  </div>

                  {errors.form && (
                    <p className="text-destructive text-sm text-center" role="alert" aria-live="polite">
                      {errors.form}
                    </p>
                  )}

                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footnote / helper text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
