"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Zap, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatImageUrl } from "@/lib/strapi";

// Interface pour les props
export interface NavigationLink {
  href: string;
  label: string;
}

interface NavbarProps {
  siteName?: string;
  logoUrl?: string | null;
  navigationLinks?: NavigationLink[];
}

// Liens de navigation par défaut (fallback)
const DEFAULT_NAVIGATION_LINKS: NavigationLink[] = [
  { href: "/", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "/work", label: "Réalisations" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({
  siteName = "Nexiah",
  logoUrl = null,
  navigationLinks = DEFAULT_NAVIGATION_LINKS,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Éviter les problèmes d'hydratation avec Radix UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour gérer les liens d'ancres
  const handleLinkClick = (href: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      // Si on est sur la homepage, on scroll vers l'ancre
      if (pathname === "/") {
        if (e) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
        return href;
      }
      // Sinon, navigation Next.js vers la homepage avec l'ancre
      if (e) {
        e.preventDefault();
        router.push(`/${href}`);
      }
      return `/${href}`;
    }
    return href;
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-auto items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label={siteName}>
            {logoUrl ? (
              <div className="relative h-9 md:h-11 w-auto flex-shrink-0">
                {(() => {
                  const formattedLogoUrl = formatImageUrl(logoUrl);
                  const isLocalhost = formattedLogoUrl.includes("localhost");
                  return (
                    <Image
                      src={formattedLogoUrl}
                      alt={siteName}
                      width={300}
                      height={150}
                      className="h-9 md:h-11 w-auto object-contain"
                      unoptimized={isLocalhost}
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="flex h-9 md:h-11 w-9 md:w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-5 md:h-6 w-5 md:w-6" />
              </div>
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={handleLinkClick(link.href)}
                onClick={(e) => handleLinkClick(link.href, e)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Réserver un appel</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col h-full px-6">
                {/* Logo in Sheet */}
                <div className="mb-8">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setOpen(false)}
                    aria-label={siteName}
                  >
                    {logoUrl ? (
                      <div className="relative h-10 w-auto flex-shrink-0">
                        {(() => {
                          const formattedLogoUrl = formatImageUrl(logoUrl);
                          const isLocalhost = formattedLogoUrl.includes("localhost");
                          return (
                            <Image
                              src={formattedLogoUrl}
                              alt={siteName}
                              width={300}
                              height={150}
                              className="h-10 w-auto object-contain"
                              unoptimized={isLocalhost}
                            />
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Zap className="h-5 w-5" />
                      </div>
                    )}
                  </Link>
                </div>

                {/* Navigation Links in Sheet */}
                <nav className="flex flex-col gap-6 flex-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={handleLinkClick(link.href)}
                      onClick={(e) => {
                        handleLinkClick(link.href, e);
                        setOpen(false);
                      }}
                      className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* CTA Button in Sheet */}
                <div className="mt-auto pt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link
                      href="/contact"
                      onClick={() => setOpen(false)}
                    >
                      Réserver un appel
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu"
              disabled
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
