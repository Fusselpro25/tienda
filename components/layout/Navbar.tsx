"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { logoutUser } from "@/actions/auth/auth";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/reservas", label: "Reservar Cita" },
  { href: "/cursos", label: "Cursos" },
  { href: "/galeria", label: "Galería" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    async function checkUserRole(currentUser: User | null) {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      setIsAdmin(
        roleData?.role === "admin" || roleData?.role === "superadmin"
      );
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      checkUserRole(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      checkUserRole(nextUser);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EBE5D9] bg-[#FAF9F7]/95 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Marca alineada al extremo izquierdo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#E3DAC9] border border-[#B6AEA1] flex items-center justify-center text-[#2D2C28] font-serif text-base font-semibold group-hover:bg-[#2D2C28] group-hover:text-[#FAF9F7] transition-colors">
            VN
          </div>
          <div>
            <span className="block font-serif text-xl tracking-tight text-[#2D2C28] font-semibold leading-none">
              Vaema Nails
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-[#878378] mt-1">
              Studio &amp; Academy · Elche
            </span>
          </div>
        </Link>

        {/* Navegación principal centrada */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-full text-sm transition-colors ${isActive
                  ? "bg-[#E3DAC9] text-[#2D2C28] font-medium"
                  : "text-[#5B5650] hover:text-[#2D2C28] hover:bg-[#F1EDE4]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones de cuenta y reserva */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {loading ? null : !user ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 rounded-full text-sm font-medium text-[#5B5650] hover:text-[#2D2C28] hover:bg-[#F1EDE4] border border-[#EBE5D9] transition-colors"
              >
                Iniciar Sesión
              </Link>

              <Link
                href="/registro"
                className="px-4 py-2.5 rounded-full text-sm font-medium text-[#2D2C28] bg-[#E3DAC9] hover:bg-[#B6AEA1]/50 border border-[#B6AEA1]/60 transition-colors"
              >
                Crear Cuenta
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-full text-sm font-medium text-[#2D2C28] bg-[#E3DAC9] hover:bg-[#B6AEA1]/60 border border-[#B6AEA1] transition-colors"
                >
                  Panel Admin
                </Link>
              )}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="px-4 py-2.5 rounded-full border border-[#B6AEA1] bg-[#F7F4EF] text-sm font-medium text-[#2D2C28] hover:bg-[#E3DAC9] transition-colors cursor-pointer"
                >
                  {user.user_metadata?.full_name?.split(" ")[0] || "Mi cuenta"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#EBE5D9] bg-[#FAF9F7] shadow-lg p-2 space-y-1">
                    <Link
                      href="/mi-cuenta"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3.5 py-2 rounded-xl text-sm text-[#2D2C28] hover:bg-[#F1EDE4]"
                    >
                      Mi cuenta
                    </Link>

                    <Link
                      href="/mis-reservas"
                      onClick={() => setProfileOpen(false)}
                      className="block px-3.5 py-2 rounded-xl text-sm text-[#2D2C28] hover:bg-[#F1EDE4]"
                    >
                      Mis reservas
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block px-3.5 py-2 rounded-xl text-sm font-medium text-[#2D2C28] bg-[#E3DAC9]/60 hover:bg-[#E3DAC9]"
                      >
                        Panel de Administración
                      </Link>
                    )}

                    <form action={logoutUser}>
                      <button
                        type="submit"
                        className="w-full text-left px-3.5 py-2 rounded-xl text-sm text-[#5B5650] hover:text-[#2D2C28] hover:bg-[#F1EDE4] cursor-pointer"
                      >
                        Cerrar sesión
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
          <Link
            href="/reservas"
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-[#2D2C28] text-[#FAF9F7] hover:bg-[#5B5650] transition-colors"
          >
            Pedir Cita
          </Link>
        </div>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2.5 rounded-xl border border-[#EBE5D9] bg-[#F7F4EF] text-[#2D2C28] hover:bg-[#E3DAC9] transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#EBE5D9] bg-[#FAF9F7] px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? "bg-[#E3DAC9] text-[#2D2C28]"
                    : "text-[#5B5650] hover:bg-[#F1EDE4] hover:text-[#2D2C28]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#EBE5D9] flex flex-col sm:flex-row gap-2.5">
            {!loading && (
              <>
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl border border-[#B6AEA1] text-sm font-medium text-[#2D2C28] bg-[#F7F4EF]"
                    >
                      Iniciar Sesión
                    </Link>

                    <Link
                      href="/registro"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl border border-[#B6AEA1] text-sm font-medium text-[#2D2C28] bg-[#E3DAC9]"
                    >
                      Crear Cuenta
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/mi-cuenta"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl border border-[#B6AEA1] text-sm font-medium text-[#2D2C28]"
                    >
                      Mi cuenta
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center py-3 rounded-xl border border-[#B6AEA1] bg-[#E3DAC9] text-sm font-medium text-[#2D2C28]"
                      >
                        Panel Admin
                      </Link>
                    )}

                    <form action={logoutUser} className="flex-1">
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl border border-[#B6AEA1] text-sm font-medium text-[#5B5650]"
                      >
                        Cerrar sesión
                      </button>
                    </form>
                  </>
                )}
              </>
            )}
            <Link
              href="/reservas"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 rounded-xl bg-[#2D2C28] text-sm font-medium text-[#FAF9F7]"
            >
              Pedir Cita
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
