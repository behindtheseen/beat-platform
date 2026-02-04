"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Music } from "lucide-react"
import { useCartStore } from "@/store/cart"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const itemCount = items.length

  const navItems = [
    { href: "/", label: "Beats" },
    { href: "/cart", label: "Cart", showBadge: true },
    { href: "/profile/me", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Music className="h-6 w-6" />
          <span>BeatMarket</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.href === "/cart" ? (
                <div className="relative flex items-center gap-1">
                  <ShoppingCart className="h-5 w-5" />
                  Cart
                  {item.showBadge && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
