"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { loginUser } from "@/actions/auth/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await loginUser(formData);
      return;
    }

    // Respaldo cuando se ejecuta en modo local sin variables de entorno:
    // detecta automáticamente por el correo si es cuenta admin o usuario normal
    const normalizedEmail = email.trim().toLowerCase();
    if (
      normalizedEmail.includes("admin") ||
      normalizedEmail === "contacto@lateliernails.es" ||
      normalizedEmail === "hola@lateliernails.es"
    ) {
      router.push("/admin");
      return;
    }

    router.push("/mi-cuenta");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#2D2C28]">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Formulario único de Inicio de Sesión */}
          <div className="lg:col-span-6 bg-[#FAF9F7] border border-[#EBE5D9] rounded-3xl p-8 sm:p-10 space-y-6 shadow-2xs">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
                Acceso a tu Cuenta
              </span>
              <h1 className="font-serif text-3xl font-semibold text-[#2D2C28]">
                Iniciar Sesión
              </h1>
              <p className="text-xs text-[#5B5650] leading-relaxed">
                Introduce tu correo electrónico y contraseña. El sistema identificará automáticamente tu cuenta para llevarte a tu espacio personal o al panel de administración.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-xs text-[#2D2C28]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block font-medium text-[#2D2C28] mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="w-full px-4 py-3 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1] text-[#2D2C28] focus:outline-none focus:border-[#2D2C28]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="pt-4 border-t border-[#EBE5D9] text-xs text-center text-[#5B5650]">
              ¿Todavía no tienes cuenta?{" "}
              <Link
                href="/registro"
                className="font-semibold text-[#2D2C28] underline underline-offset-4"
              >
                Crear cuenta ahora
              </Link>
            </div>
          </div>

          {/* Información lateral */}
          <div className="lg:col-span-6 rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-8 sm:p-10 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
              Ventajas de tu cuenta
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2D2C28]">
              Gestiona tus reservas y formaciones con total comodidad
            </h2>
            <div className="space-y-4 text-xs text-[#5B5650] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                <strong className="block text-[#2D2C28] text-sm mb-1">
                  Reservas más rápidas
                </strong>
                Tus datos de contacto quedan guardados para que puedas elegir servicio, fecha y hora en pocos segundos.
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                <strong className="block text-[#2D2C28] text-sm mb-1">
                  Seguimiento de anticipos y citas
                </strong>
                Consulta en cualquier momento el estado de tus próximas citas, el justificante del anticipo del 50% y el importe pendiente en el estudio.
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9]">
                <strong className="block text-[#2D2C28] text-sm mb-1">
                  Inscripciones a cursos en Elche
                </strong>
                Revisa las fechas, horarios y plazas confirmadas en nuestras convocatorias presenciales de formación.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
