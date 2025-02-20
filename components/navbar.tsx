"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Moon, Sun, Search, Menu, X } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ThemeToggle } from "./ThemeToggle"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/recent",
    label: "Recent",
  },
  {
    href: "/popular",
    label: "Popular",
  },
  {
    href: "/genres",
    label: "Genres",
  },
]

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById('mobile-menu');
      const menuButton = document.getElementById('menu-button');
      const mobileMenuContainer = document.getElementById('mobile-menu-container');
      
      if (
        isMenuOpen && 
        !menuButton?.contains(target) && 
        !mobileMenu?.contains(target) &&
        !mobileMenuContainer?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black/60 backdrop-blur-lg supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex w-full justify-between items-center gap-2 sm:gap-6 md:gap-10">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-bold text-base sm:text-xl shrink-0 hover:text-primary transition-colors"
          >
            AnimeStream
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center gap-8 -ml-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={`text-sm font-medium relative group ${
                      route.href === pathname ? 'text-primary' : ''
                    }`}
                  >
                    {route.label}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center justify-end flex-1 space-x-2 sm:space-x-4">
            <ThemeToggle />
            <form onSubmit={handleSearch} className="hidden md:flex relative mx-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime..."
                className="w-[200px] pl-9 focus:w-[300px] transition-all"
                value={searchQuery}
                onChange={handleSearchInput}
              />
            </form>
            <Button
              id="menu-button"
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-muted p-1 sm:p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-muted ml-2 sm:ml-4">
                    <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                      <AvatarFallback className="bg-primary/10">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <span className="flex-1">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist" className="flex items-center">
                      <span className="flex-1">Watchlist</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-500 focus:text-red-500"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" asChild className="shadow-sm text-xs sm:text-sm px-2 sm:px-4">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <div 
        id="mobile-menu-container"
        className={`
          fixed top-14 left-0 right-0 z-50 transform transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}
          border-b bg-black dark:bg-white md:hidden w-full overflow-x-hidden min-w-[300px]
          overscroll-none will-change-transform text-white dark:text-black
        `}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <nav id="mobile-menu" className="container max-w-7xl mx-auto px-3 py-4 w-full">
          <div className="flex flex-col space-y-4 w-full">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-muted ${
                  route.href === pathname ? 'text-primary bg-muted' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
            <div className="pt-2 w-full">
              <form onSubmit={(e) => {
                handleSearch(e)
                setIsMenuOpen(false)
              }} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search anime..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />
              </form>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}