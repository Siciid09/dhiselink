"use client";

import { motion } from 'framer-motion';
import { AtSign, Lock, ArrowRight } from 'lucide-react';
// import Link from 'next/link'; // Removed for compatibility

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid lg:grid-cols-2 bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200/80">
                
                {/* Left Side - Form */}
                <div className="p-8 md:p-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600 mb-8">Sign in to access your account and opportunities.</p>

                        <form className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">Email Address</label>
                                <div className="relative">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        placeholder="you@example.com" 
                                        className="w-full h-12 pl-12 pr-4 rounded-md bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-1 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="w-full h-12 pl-12 pr-4 rounded-md bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                                    />
                                </div>
                                <div className="text-right mt-2">
                                    <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot Password?</a>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-3 px-6 rounded-md hover:bg-black transition-colors duration-300 shadow-lg shadow-gray-800/20"
                            >
                                Sign In <ArrowRight size={18}/>
                            </motion.button>
                        </form>
                        
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or sign in with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"><img src="https://logo.clearbit.com/google.com" alt="Google" className="w-5 h-5" /> Google</button>
                            <button className="w-full flex items-center justify-center gap-3 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"><img src="https://logo.clearbit.com/linkedin.com" alt="LinkedIn" className="w-5 h-5" /> LinkedIn</button>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-8">
                            Don't have an account? <a href="/register" className="font-bold text-blue-600 hover:underline">Register Now</a>
                        </p>
                    </motion.div>
                </div>
                
                {/* Right Side - Image */}
                <div className="hidden lg:block">
                    <motion.div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop')"}}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    />
                </div>
            </div>
        </div>
    );
}

