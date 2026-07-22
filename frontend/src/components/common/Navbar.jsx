// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Sheet,
//   SheetContent,
//   SheetTrigger,
//   SheetClose,
// } from "@/components/ui/sheet";
// import { Feather, Search, Menu, PenLine, LogOut, User } from "lucide-react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { useEffect } from "react";
// import { useSearchPosts } from "@/hooks/queries/useSearchPost";
// import { useRef } from "react";

// const NAV_LINKS = [
//   { label: "My Feed", href: "/feeds" },
//   { label: "Trending", href: "/trending" },
//   { label: "Recommended", href: "/recommended" },
//   { label: "About", href: "/about" },
//   { label: "My Posts", href: "/my-posts" },
// ];

// // Hand-drawn style ink-stroke underline that animates in on hover/active.
// // This is the one "signature" detail for the whole nav.
// function InkUnderline({ active }) {
//   return (
//     <svg
//       viewBox="0 0 60 8"
//       className={`absolute -bottom-1 left-0 h-2 w-full overflow-visible transition-opacity duration-200 ${
//         active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
//       }`}
//       preserveAspectRatio="none"
//     >
//       <path
//         d="M2 5 C 12 2, 20 7, 30 4 S 48 2, 58 5"
//         fill="none"
//         stroke="#1F5F5B"
//         strokeWidth="2"
//         strokeLinecap="round"
//         pathLength="1"
//         className="[stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] transition-[stroke-dashoffset] duration-300 ease-out"
//         style={active ? { strokeDashoffset: 0 } : undefined}
//       />
//     </svg>
//   );
// }

// function NavLink({ label, href, active }) {
//   return (
//     <Link
//       to={href}
//       className="group relative px-1 py-2 text-[15px] font-medium text-[#1C2321]/80 transition-colors hover:text-[#1C2321]"
//     >
//       {label}
//       <InkUnderline active={active} />
//     </Link>
//   );
// }

// export default function Navbar() {
//   const navigate = useNavigate();
//   const searchRef = useRef(null);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const { user, isAuthenticated, logout } = useAuth();
//   const location = useLocation();
//   const activePath = location.pathname;

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search]);
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchRef.current && !searchRef.current.contains(e.target)) {
//         setSearchOpen(false);
//         setSearch("");
//         setDebouncedSearch("");
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const { data: searchResults, isFetching } = useSearchPosts(debouncedSearch);

//   const closeSearch = () => {
//     setSearch("");
//     setDebouncedSearch("");
//     setSearchOpen(false);
//   };
//   return (
//     <header className="border-b border-[#E8E4DC] bg-[#FAFAF8]">
//       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
//         {/* Logo / Wordmark */}
//         <Link to="/" className="flex shrink-0 items-center gap-2">
//           <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5F5B] text-[#FAFAF8]">
//             <Feather className="h-4 w-4" />
//           </span>
//           <span
//             className="text-xl tracking-tight"
//             style={{ fontFamily: "'Fraunces', Georgia, serif" }}
//           >
//             Quill
//           </span>
//         </Link>

//         {/* Desktop nav links */}
//         <nav className="hidden md:flex md:items-center md:gap-7">
//           {NAV_LINKS.map((link) => (
//             <NavLink
//               key={link.href}
//               {...link}
//               active={link.href === activePath}
//             />
//           ))}
//         </nav>

//         {/* Right side actions */}
//         <div className="flex items-center gap-2">
//           {/* Search */}
//           <div ref={searchRef} className="relative hidden items-center sm:flex">
//             {searchOpen ? (
//               <div className="relative">
//                 <Input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && search.trim()) {
//                       navigate(`/search?q=${encodeURIComponent(search)}`);
//                       closeSearch();
//                     }
//                   }}
//                 />
//                 {isFetching && (
//                   <div className="absolute right-2 top-1/2 -translate-y-1/2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setSearchOpen(true)}
//               >
//                 <Search className="h-[18px] w-[18px]" />
//               </Button>
//             )}

//             {debouncedSearch && (
//               <div className="absolute top-full right-0 z-50 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border bg-white shadow-lg">
//                 {isFetching ? (
//                   <div className="p-3 text-sm">Searching...</div>
//                 ) : searchResults?.posts?.length > 0 ? (
//                   searchResults.posts.map((post) => (
//                     <Link
//                       key={post._id}
//                       to={`/posts/${post.slug}`}
//                       onClick={closeSearch}
//                       className="block border-b p-3 hover:bg-gray-50"
//                     >
//                       <p className="font-medium">{post.title}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {post.author?.username}
//                       </p>
//                     </Link>
//                   ))
//                 ) : (
//                   <div className="p-3 text-sm text-gray-500">
//                     No posts found
//                   </div>
//                 )}
//                 {searchResults?.posts?.length > 0 && (
//                   <button
//                     onClick={() => {
//                       navigate(`/search?q=${encodeURIComponent(search)}`);
//                       closeSearch();
//                     }}
//                     className="w-full border-t p-3 text-center text-sm font-medium text-[#1F5F5B] hover:bg-gray-50"
//                   >
//                     View all results
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Auth area */}
//           {isAuthenticated ? (
//             <div className="flex items-center gap-6">
//               <Link to="/write" className="hidden sm:block">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="hidden items-center gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B] sm:flex"
//                 >
//                   <PenLine className="h-4 w-4" />
//                   Write
//                 </Button>
//               </Link>
//               <DropdownMenu>
//                 <DropdownMenuTrigger>
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={user?.avatar} alt="User avatar" />
//                     <AvatarFallback className="bg-[#1F5F5B] text-white text-lg">
//                       {user.username.slice(0, 1).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuItem>
//                     <Link to="/profile" className="flex items-center">
//                       <User className="mr-2 h-4 w-4" /> Profile
//                     </Link>
//                   </DropdownMenuItem>

//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     onClick={logout}
//                     className="text-red-600 focus:text-red-600"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" /> Log out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ) : (
//             <div className="hidden items-center gap-2 sm:flex">
//               <Link to={"/login"}>
//                 <Button variant="ghost" size="sm">
//                   Log in
//                 </Button>
//               </Link>
//               <Button
//                 size="sm"
//                 className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
//               >
//                 Get started
//               </Button>
//             </div>
//           )}

//           {/* Mobile menu */}
//           <Sheet>
//             <SheetTrigger>
//               <Menu className="h-5 w-5 md:hidden" />
//             </SheetTrigger>
//             <SheetContent side="right" className="w-72 bg-[#FAFAF8]">
//               <div className="mt-8 flex flex-col gap-1">
//                 {NAV_LINKS.map((link) => (
//                   <SheetClose asChild key={link.href}>
//                     <Link
//                       to={link.href}
//                       className="rounded-md px-3 py-2.5 text-base font-medium text-[#1C2321] hover:bg-[#E8E4DC]/60"
//                     >
//                       {link.label}
//                     </Link>
//                   </SheetClose>
//                 ))}
//                 <div className="my-3 h-px bg-[#E8E4DC]" />
//                 {isAuthenticated ? (
//                   <>
//                     <SheetClose asChild>
//                       <Button variant="outline" className="justify-start gap-2">
//                         <PenLine className="h-4 w-4" /> Write
//                       </Button>
//                     </SheetClose>
//                   </>
//                 ) : (
//                   <div className="flex flex-col gap-2 px-1">
//                     <Button variant="outline">Log in</Button>
//                     <Button className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90">
//                       Get started
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </header>
//   );
// }

import { Button } from "@/components/ui/button";
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
import { Feather, Menu, PenLine, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import NavSearch from "./NavSearch";

const NAV_LINKS = [
  { label: "My Feed", href: "/feeds" },
  { label: "Trending", href: "/trending" },
  { label: "Recommended", href: "/recommended" },
  { label: "About", href: "/about" },
  { label: "My Posts", href: "/my-posts" },
];

// Hand-drawn style ink-stroke underline that animates in on hover/active.
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
    <Link
      to={href}
      className="group relative px-1 py-2 text-[15px] font-medium text-[#1C2321]/80 transition-colors hover:text-[#1C2321]"
    >
      {label}
      <InkUnderline active={active} />
    </Link>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  return (
    <header className="border-b border-[#E8E4DC] bg-[#FAFAF8]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F5F5B] text-[#FAFAF8]">
            <Feather className="h-4 w-4" />
          </span>
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Quill
          </span>
        </Link>

        {!isLandingPage && (
          <nav className="hidden md:flex md:items-center md:gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                active={link.href === pathname}
              />
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isLandingPage && <NavSearch />}

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/write" className="hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="items-center gap-1.5 border-[#1F5F5B]/30 text-[#1F5F5B] flex"
                >
                  <PenLine className="h-4 w-4" />
                  Write
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt="User avatar" />
                    <AvatarFallback className="bg-[#1F5F5B] text-white text-lg">
                      {user.username.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Button
                size="sm"
                className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90"
              >
                Get started
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger>
              <Menu className="h-5 w-5 md:hidden" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#FAFAF8]">
              <div className="mt-8 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      to={link.href}
                      className="rounded-md px-3 py-2.5 text-base font-medium text-[#1C2321] hover:bg-[#E8E4DC]/60"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="my-3 h-px bg-[#E8E4DC]" />
                {isAuthenticated ? (
                  <SheetClose asChild>
                    <Button variant="outline" className="justify-start gap-2">
                      <PenLine className="h-4 w-4" /> Write
                    </Button>
                  </SheetClose>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Button variant="outline">Log in</Button>
                    <Button className="bg-[#1F5F5B] text-white hover:bg-[#1F5F5B]/90">
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
