'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FacebookLogoIcon, GithubLogoIcon, InstagramLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('/api/newsletter', { email });
      if (response.data.success) {
        toast.success(response.data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(response.data.error || 'Failed to subscribe.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="w-full relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/10 to-purple-50/20 dark:from-zinc-950 dark:via-zinc-900/80 dark:to-indigo-950/30 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 py-16 px-6">
      {/* Top accent line matching the sticky Navbar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80" />

      {/* Decorative ambient background glows */}
      <div className="absolute -left-20 bottom-0 h-64 w-64 bg-gradient-to-tr from-indigo-300/10 to-purple-300/10 dark:from-indigo-900/10 dark:to-purple-900/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -right-20 top-0 h-64 w-64 bg-gradient-to-br from-purple-300/10 to-pink-300/10 dark:from-purple-900/10 dark:to-pink-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        
        {/* Main Footer Links & Branding Info */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="flex flex-col items-start gap-4 max-w-sm w-full">
            <Link href="/" className="transition-opacity hover:opacity-90">
              <Image
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={45}
                priority
                className="h-18 w-auto dark:hidden"
              />
              <Image
                src="/images/logo/logo_dark.svg"
                alt="Logo"
                width={150}
                height={45}
                priority
                className="h-18 w-auto hidden dark:block"
              />
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Empowering teams to track projects, manage tasks, and boost productivity with style and clarity.
            </p>

            {/* Newsletter form */}
            <div className="flex flex-col gap-2.5 w-full mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Subscribe to our newsletter
              </span>
              <form className="flex w-full max-w-sm gap-2" onSubmit={handleSubscribe}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 h-9 text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium border-0 h-9 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-wrap gap-x-16 gap-y-10 lg:gap-x-24">
            
            {/* Product Links */}
            <div className="flex flex-col gap-3.5 min-w-[120px]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Product
              </h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/features" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features
                </Link>
                <Link href="/dashboard" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Profile
                </Link>
              </nav>
            </div>

            {/* Company Links */}
            <div className="flex flex-col gap-3.5 min-w-[120px]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Company
              </h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="/about" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
                <Link href="/contact" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact
                </Link>
                <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Careers
                </Link>
              </nav>
            </div>

            {/* Resources Links */}
            <div className="flex flex-col gap-3.5 min-w-[120px]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Resources
              </h4>
              <nav className="flex flex-col gap-2.5">
                <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Documentation
                </Link>
                <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Use
                </Link>
              </nav>
            </div>

          </div>
        </div>

        {/* Separator Divider */}
        <Separator className="bg-zinc-200/60 dark:bg-zinc-800/60" />

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-xs text-zinc-400 dark:text-zinc-500 text-center sm:text-left">
            © {new Date().getFullYear()} TaskTracker. All rights reserved. Crafted with ❤️ for modern teams.
          </div>

          {/* Social Icons list */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <GithubLogoIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://x.com/"
              target="_blank"
              aria-label="Twitter"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faXTwitter} className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://facebook.com/"
              target="_blank"
              aria-label="Facebook"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <FacebookLogoIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://instagram.com/"
              target="_blank"
              aria-label="Instagram"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <InstagramLogoIcon className="h-4 w-4" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200"
            >
              <LinkedinLogoIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
