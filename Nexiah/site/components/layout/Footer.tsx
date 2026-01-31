import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-900 text-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">Nexiah</span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="#mentions"
              className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="https://www.linkedin.com/company/nexiah/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
            >
              LinkedIn
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-slate-400">
            © 2026 Nexiah. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
