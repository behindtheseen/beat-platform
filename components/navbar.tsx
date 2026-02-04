"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Music, Menu, X, Music2 } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const itemCount = items.length
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Beats" },
    { href: "/cart", label: "Cart", showBadge: true },
    { href: "/profile/me", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-zinc-800">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Music2 className="h-8 w-8 text-purple-500" />
          <span className="font-bold text-xl text-white">BeatMarket</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-400",
                pathname === item.href ? "text-purple-400" : "text-zinc-400"
              )}
            >
              {item.href === "/cart" ? (
                <div className="relative flex items-center gap-1">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {item.showBadge && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              ) : (
                item.label
              )}
            </Link>
          ))}
          <Link href="/auth/login">
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-black border-b border-zinc-800 p-4 md:hidden">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-purple-400",
                    pathname === item.href ? "text-purple-400" : "text-zinc-400"
                  )}
                >
                  {item.href === "/cart" ? (
                    <div className="relative flex items-center gap-1">
                      <ShoppingCart className="h-5 w-5" />
                      Cart
                      {item.showBadge && itemCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs">
                          {itemCount}
                        </span>
                      )}
                    </div>
                  ) : (
                    item.label
                  )}
                </Link>
              ))}
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Sign In</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
