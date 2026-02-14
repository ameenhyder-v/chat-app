import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signUp, isSigningUp } = useAuthStore();

    const validateform = () => {
        if (!formData.fullName.trim()) return toast.error("Full Name is required!");
        if (!formData.email.trim()) return toast.error("Email is required!");
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Invalid email format!");
        if (!formData.password.trim()) return toast.error("Password is required!");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateform();

        if (success === true) signUp(formData)
    }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" >
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
            <div className="w-full max-w-md space-y-8">
                {/* LOGO */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/10 group-hover:bg-primary/15 transition-colors">
                            <MessageSquare className="size-8 text-primary" strokeWidth={2} />
                        </div>
                        <h1 className="text-2xl font-bold mt-3 tracking-tight">Create account</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Get started with your free account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="label font-medium">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="size-5 text-muted-foreground z-10" />
                            </div>
                            <input type="text" className="input w-full pl-10 rounded-xl" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="label font-medium">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-muted-foreground z-10" />
                            </div>
                            <input type="email" className="input w-full pl-10 rounded-xl" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="label font-medium">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="size-5 text-muted-foreground z-10" />
                            </div>
                            <input type={showPassword ? "text" : "password"} className="input w-full pl-10 rounded-xl" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff className="size-5 text-muted-foreground z-10" />
                                ) : <Eye className="size-5 text-muted-foreground z-10" />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full rounded-xl font-medium" disabled={isSigningUp}>
                        {isSigningUp ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-muted-foreground">
                        Already have an account? {" "}
                        <Link to="/login" className="text-primary underline hover:opacity-80">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>

        {/* right side */}
        <AuthImagePattern title="Join the community" subtitle="Connect with friends and chat in real time." />
    </div>
  )
}

export default SignupPage