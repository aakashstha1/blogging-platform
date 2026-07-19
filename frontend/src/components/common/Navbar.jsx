import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Feather,
  Search,
  Menu,
  Moon,
  Sun,
  PenLine,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

// Hand-drawn style ink-stroke underline that animates in on hover/active.
// This is the one "signature" detail for the whole nav.
function InkUnderline({ active }) {
  return (
    <svg
      viewBox="0 0 60 8"
      className={`absolute -bottom-1 left-0 h-2 w-full overflow-visible transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      preserveAspectRatio="none"
    >
      <path
        d="M2 5 C 12 2, 20 7, 30 4 S 48 2, 58 5"
        fill="none"
        stroke="#1F5F5B"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="1"
        className="[stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 ease-out"
        style={active ? { strokeDashoffset: 0 } : undefined}
      />
    </svg>
  );
}

function NavLink({ label, href, active }) {
  return (
    <a
      href={href}
      className="group relative px-1 py-2 text-[15px] font-medium text-[#1C2321]/80 transition-colors hover:text-[#1C2321]"
    >
      {label}
      <InkUnderline active={active} />
    </a>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const activePath = "/";

  return (
    <header
      className={
        isDark
          ? "dark border-b border-[#2A312E] bg-[#14181C]"
          : "border-b border-[#E8E4DC] bg-[#FAFAF8]"
      }
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo / Wordmark */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5F5B] text-[#FAFAF8]">
            <Feather className="h-4 w-4" />
          </span>
          <span
            className={`text-xl tracking-tight ${
              isDark ? "text-[#FAFAF8]" : "text-[#1C2321]"
            }`}
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Quill
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex md:items-center md:gap-7">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={link.href === activePath}
            />
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden items-center sm:flex">
            {searchOpen ? (
              <Input
                autoFocus
                placeholder="Search articles..."
                onBlur={() => setSearchOpen(false)}
                className="h-9 w-56 border-[#E8E4DC] bg-white/60 text-sm"
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            )}
          </div>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark((d) => !d)}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Button>

          {/* Auth area */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden items-center gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B] sm:flex"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full outline-none ring-[#1F5F5B] focus-visible:ring-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User avatar" />
                      <AvatarFallback className="bg-[#1F5F5B] text-xs text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsAuthenticated(false)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to={"/login"}>
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={() => setIsAuthenticated(true)}
                className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
              >
                Get started
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger>
              <Menu className="h-5 w-5 md:hidden" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#FAFAF8]">
              <div className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-[#1C2321] hover:bg-[#E8E4DC]/60"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <div className="my-3 h-px bg-[#E8E4DC]" />
                {isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Button variant="outline" className="justify-start gap-2">
                        <PenLine className="h-4 w-4" /> Write
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Button variant="outline">Log in</Button>
                    <Button
                      onClick={() => setIsAuthenticated(true)}
                      className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
                    >
                      Get started
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
