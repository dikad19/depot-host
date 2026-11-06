import { useEffect, useState } from "react";
import {
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Store,
  Truck,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIES = [
  { slug: "fashion", label: "Fashion" },
  { slug: "elektronik", label: "Elektronik" },
  { slug: "rumah", label: "Rumah & dapur" },
  { slug: "kecantikan", label: "Kecantikan" },
  { slug: "olahraga", label: "Olahraga" },
  { slug: "promo", label: "Promo", sale: true },
];

// Cincin fokus seragam; oranye hanya dipakai sebagai aksen.
const ring =
  "rounded-md outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const iconBtn = "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

function SearchBar({ query, onChange, onSubmit }) {
  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="order-last flex h-11 w-full items-center rounded-lg bg-slate-100 pl-3 pr-1 ring-1 ring-transparent transition-shadow focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-600 md:order-none md:mx-6 md:max-w-xl md:flex-1"
    >
      <Search className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
      <input
        type="search"
        enterKeyHint="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari produk atau kategori"
        aria-label="Cari produk"
        className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Hapus pencarian"
          className="grid size-8 shrink-0 place-items-center rounded-md text-slate-500 outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-orange-600"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        className="h-9 shrink-0 rounded-md bg-slate-900 px-4 text-white hover:bg-slate-800 focus-visible:ring-orange-600"
      >
        Cari
      </Button>
    </form>
  );
}

export default function Header({ initialCartCount = 0 }) {
  const [promoOpen, setPromoOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // Bayangan muncul setelah halaman di-scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kategori aktif mengikuti hash URL
  useEffect(() => {
    const onHash = () => setActive(window.location.hash.replace("#", ""));
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Header mendengarkan kabar dari remote lewat event browser
  useEffect(() => {
    const onCartUpdated = (e) => setCartCount(Number(e.detail?.count) || 0);
    window.addEventListener("cart:updated", onCartUpdated);
    return () => window.removeEventListener("cart:updated", onCartUpdated);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("search:submit", { detail: { query: query.trim() } }),
    );
  }

  function handleOpenCart() {
    window.dispatchEvent(new CustomEvent("cart:open"));
  }

  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Lewati ke konten
      </a>

      {/* Pengumuman */}
      {promoOpen && (
        <div className="bg-slate-900 text-white">
          <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-sm">
            <Truck
              className="size-4 shrink-0 text-orange-400"
              aria-hidden="true"
            />
            <p className="truncate">
              Gratis ongkir untuk belanja di atas Rp 200.000
            </p>
            <button
              type="button"
              onClick={() => setPromoOpen(false)}
              aria-label="Tutup pengumuman"
              className="absolute right-3 grid size-7 place-items-center rounded-md outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-40 border-b border-slate-200 bg-white text-slate-900 transition-shadow",
          scrolled && "shadow-sm",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-y-3 px-4 py-3 md:flex-nowrap">
          {/* Menu samping: hanya di layar kecil */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(iconBtn, "-ml-2 mr-3 md:hidden")}
                aria-label="Buka menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[85%] max-w-sm flex-col gap-0 border-slate-200 bg-white p-0 text-slate-900 shadow-xl"
            >
              <SheetHeader className="border-b border-slate-200 p-4 pr-12 text-left">
                <SheetTitle className="flex items-center gap-2 text-lg font-bold font-black text-slate-900">
                  <span className="grid size-8 place-items-center rounded-lg bg-orange-600 text-white">
                    <Store className="size-4" aria-hidden="true" />
                  </span>
                  Toko Saya
                </SheetTitle>
                <SheetDescription className="text-slate-600">
                  Belanja per kategori
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Menu utama"
                className="flex-1 overflow-y-auto p-2"
              >
                <ul>
                  {CATEGORIES.map((c) => (
                    <li key={c.slug} className={c.sale ? "mt-2" : undefined}>
                      <a
                        href={`#${c.slug}`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={
                          active === c.slug ? "location" : undefined
                        }
                        className={cn(
                          ring,
                          "flex min-h-12 items-center justify-between rounded-lg px-3 text-[15px] font-medium",
                          c.sale
                            ? "bg-orange-50 font-semibold text-orange-700 hover:bg-orange-100"
                            : active === c.slug
                              ? "bg-slate-100 font-semibold"
                              : "hover:bg-slate-100",
                        )}
                      >
                        {c.label}
                        <ChevronRight
                          className="size-4 text-slate-400"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <ul className="mt-3 border-t border-slate-200 pt-3">
                  {[
                    { href: "#akun", label: "Akun saya", Icon: User },
                    { href: "#wishlist", label: "Wishlist", Icon: Heart },
                  ].map(({ href, label, Icon }) => (
                    <li key={href}>
                      <a
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          ring,
                          "flex min-h-12 items-center gap-3 rounded-lg px-3 text-[15px] text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <a href="/" className={cn("flex items-center gap-2", ring)}>
            <span className="grid size-9 place-items-center rounded-lg bg-orange-600 text-white">
              <Store className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold tracking-tight">Toko Saya</span>
          </a>

          <SearchBar
            query={query}
            onChange={setQuery}
            onSubmit={handleSearch}
          />

          {/* Aksi di kanan */}
          <div className="-mr-2 ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtn, "hidden md:inline-flex")}
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtn, "hidden md:inline-flex")}
              aria-label="Akun saya"
            >
              <User className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(iconBtn, "relative")}
              aria-label={`Keranjang, ${cartCount} barang`}
              onClick={handleOpenCart}
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && (
                <Badge
                  key={cartCount}
                  className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-orange-700 px-1 text-[11px] font-bold text-white ring-2 ring-white hover:bg-orange-700 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-300"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Kategori desktop: tab teks dengan garis bawah untuk yang aktif */}
        <nav aria-label="Kategori" className="hidden md:block">
          <ul className="mx-auto flex max-w-6xl items-center gap-7 px-4">
            {CATEGORIES.map((c) => (
              <li key={c.slug} className={c.sale ? "ml-auto" : undefined}>
                <a
                  href={`#${c.slug}`}
                  aria-current={active === c.slug ? "location" : undefined}
                  className={cn(
                    ring,
                    c.sale
                      ? "my-1.5 block rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                      : cn(
                          "block border-b-2 py-2.5 text-sm font-medium transition-colors",
                          active === c.slug
                            ? "border-orange-600 text-slate-900"
                            : "border-transparent text-slate-600 hover:text-slate-900",
                        ),
                  )}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kategori mobile: chip yang bisa digeser */}
        <nav aria-label="Kategori" className="md:hidden">
          <ul className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <li key={c.slug} className="shrink-0">
                <a
                  href={`#${c.slug}`}
                  aria-current={active === c.slug ? "location" : undefined}
                  className={cn(
                    "block rounded-full border px-3 py-1.5 text-sm font-medium",
                    ring,
                    c.sale
                      ? "border-orange-200 bg-orange-50 text-orange-700"
                      : active === c.slug
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 text-slate-700",
                  )}
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
