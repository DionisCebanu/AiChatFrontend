import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const navigate = useNavigate();
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
      const res = await signup({ 
        username: signupUsername, 
        email: signupEmail, 
        password: signupPassword,
        remember: rememberMe 
      });
      if (res.ok) {
        setActiveTab('login');
        setLoginIdentifier(signupUsername || signupEmail);
        setLoginPassword('');
        setErrors({ form: 'Account created. Please sign in.' });
      }
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
      //Navigate to chat
      navigate('/chat', {replace: true})
    } catch (error) {
      setErrors({ form: error.message });
      loginPasswordRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const renderError = (field) => errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-white text-3xl font-bold">AI</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back!</h1>
          <p className="text-muted">Sign in or create an account to continue</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
                value="login" 
                className={activeTab === 'login' ? '!bg-blue-500 !text-white' : ''}
                >Login
            </TabsTrigger>
            <TabsTrigger value="signup" className={activeTab === 'signup' ? '!bg-blue-500 !text-white' : ''}>Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6 shadow-lg rounded-[10px]"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)'}}
            >
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-identifier">Username or Email</Label>
                  <Input ref={loginIdentifierRef} id="login-identifier" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input ref={loginPasswordRef} id="login-password" type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                    <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                  </div>
                </div>
                {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </motion.div>
          </TabsContent>
          <TabsContent value="signup">
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)'}}
            >
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-username">Username</Label>
                  <Input ref={usernameRef} id="signup-username" value={signupUsername} onChange={e => setSignupUsername(e.target.value)} required />
                  {renderError('username')}
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input ref={emailRef} id="signup-email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required />
                  {renderError('email')}
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input ref={passwordRef} id="signup-password" type={showPassword ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-muted">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                   {renderError('password')}
                </div>
                <div>
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input ref={confirmPasswordRef} id="signup-confirm-password" type={showPassword ? 'text' : 'password'} value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} required />
                   {renderError('confirmPassword')}
                </div>
                {errors.form && <p className="text-red-500 text-sm text-center">{errors.form}</p>}
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthPage;