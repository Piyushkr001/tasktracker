'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Facebook, InstagramIcon } from 'lucide-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-t from-slate-200 via-slate-100 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-gray-800 dark:text-gray-200 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo & Description */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="mb-2">
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={140}
              height={40}
            />
          </Link>
          <p className="text-sm text-center md:text-left max-w-xs">
            Empowering teams to manage tasks efficiently.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About</Link>
          <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400">Features</Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex item-center gap-4">
          <Link href="https://github.com" target="_blank" aria-label="GitHub">
            <Github className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400 transition" />
          </Link>
          <Link href="https://x.com/" target="_blank" aria-label="Twitter">
             <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400 transition"/> 
          </Link>
          <Link href="https://Facebook.com/" target="_blank" aria-label="Twitter">
             <Facebook className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400 transition"/> 
          </Link>
          <Link href="https://Instagram.com/" target="_blank" aria-label="Twitter">
             <InstagramIcon className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400 transition"/> 
          </Link>
          <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400 transition" />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-8 pt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} TaskManager. All rights reserved.
      </div>
    </footer>
  );
}

