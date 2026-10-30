'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Redirect to login page after successful signup
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FDF6F8] to-[#F9F3F5] flex flex-col justify-center items-center px-4 py-12">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8547A]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8A0B0]/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <Image
              src="/images/icons/Beautya.svg"
              alt="Beautya"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-[#3B1A26] tracking-tight">Create Account</h1>
          <p className="text-sm text-[#888] mt-2">Join the Beautya community</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-pink-100/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8547A] opacity-60" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#C8547A] focus:ring-2 focus:ring-[#C8547A]/20 transition-all text-sm bg-white"
                  placeholder="Sarah Johnson"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8547A] opacity-60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#C8547A] focus:ring-2 focus:ring-[#C8547A]/20 transition-all text-sm bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C8547A] opacity-60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#C8547A] focus:ring-2 focus:ring-[#C8547A]/20 transition-all text-sm bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#C8547A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#C8547A] focus:ring-[#C8547A] cursor-pointer"
              />
              <label className="text-xs text-[#888] cursor-pointer">
                I agree to the{' '}
                <Link href="#" className="text-[#C8547A] hover:underline font-medium">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-[#C8547A] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-[#C8547A] to-[#b04468] hover:from-[#b04468] hover:to-[#a03d5a] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#C8547A]/30 hover:shadow-lg hover:shadow-[#C8547A]/50 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[#888]">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-[#888]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#C8547A] font-semibold hover:text-[#b04468] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}