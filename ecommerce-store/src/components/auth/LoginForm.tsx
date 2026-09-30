'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121214] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#1E1E24] border border-[#27272a] rounded-2xl p-8 shadow-2xl">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-16 h-16 mb-3">
            <Image
              src="/images/logo.png"
              alt="Nike Logo"
              fill
              className="object-contain invert brightness-200"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#FFFFFF] tracking-tight">Welcome Back</h1>
          <p className="text-sm text-[#A1A1AA] mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-[#FFFFFF] placeholder-[#52525b] focus:outline-none focus:border-[#E11D48] transition-colors text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-4 py-3 text-[#FFFFFF] placeholder-[#52525b] focus:outline-none focus:border-[#E11D48] transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#E11D48] hover:bg-[#be123c] text-[#FFFFFF] font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#E11D48]/20 disabled:opacity-50 text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-[#A1A1AA] mt-6">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#FFFFFF] font-medium hover:text-[#E11D48] transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}