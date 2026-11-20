import { requireUser } from '@/lib/auth'
import { logoutUser } from '@/actions/auth/auth'
import Link from 'next/link'

export default async function MiCuentaPage() {
  const user = await requireUser()
  const isAdmin = user.role === 'admin' || user.role === 'superadmin'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Cabecera integrada con la estética editorial de la web */}
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
            Espacio Personal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28]">
            Mi cuenta
          </h1>
          <p className="text-sm sm:text-base text-[#5B5650]">
            Bienvenida a tu espacio personal. Gestiona tus datos y consulta el estado de tus citas en el estudio.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center bg-[#FAF9F7] px-5 py-3.5 rounded-2xl border border-[#EBE5D9]">
          <div className="w-11 h-11 rounded-full bg-[#2D2C28] text-[#FAF9F7] flex items-center justify-center font-serif text-base font-semibold shrink-0">
            {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="text-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#878378] font-semibold block">
              {isAdmin ? 'Cuenta Administradora' : 'Cuenta de Clienta'}
            </span>
            <strong className="text-[#2D2C28] text-sm block">
              {user.fullName || 'Sin nombre'}
            </strong>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Datos personales */}
        <section className="lg:col-span-7 rounded-3xl border border-[#EBE5D9] bg-[#FAF9F7] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-[#EBE5D9] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#878378] font-semibold block">
                Información de Perfil
              </span>
              <h2 className="text-2xl font-serif font-semibold text-[#2D2C28] mt-0.5">
                Mis datos personales
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F1EDE4] border border-[#E3DAC9] text-xs font-medium text-[#2D2C28]">
              Sesión activa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9]">
              <p className="text-xs uppercase tracking-wider text-[#878378] font-medium">
                Nombre
              </p>
              <p className="font-serif text-lg font-semibold text-[#2D2C28] mt-1">
                {user.fullName || 'Sin nombre'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9]">
              <p className="text-xs uppercase tracking-wider text-[#878378] font-medium">
                Correo electrónico
              </p>
              <p className="text-sm font-medium text-[#2D2C28] mt-1.5 break-all">
                {user.email}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F1EDE4] border border-[#E3DAC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#5B5650]">
            <div>
              <strong className="text-[#2D2C28] block text-sm font-serif">
                Ubicación del Estudio en Elche
              </strong>
              <span>Carrer Mestre Giner, 6, 03201 Elx, Alicante · Tel. +34 646 42 47 67</span>
            </div>
            <Link
              href="/reservas"
              className="px-4 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors shrink-0 text-center"
            >
              Pedir Nueva Cita
            </Link>
          </div>
        </section>

        {/* Tarjetas de acción */}
        <div className="lg:col-span-5 space-y-4">
          <Link
            href="/mis-reservas"
            className="block rounded-3xl border border-[#EBE5D9] bg-[#FAF9F7] p-6 transition-all hover:border-[#B6AEA1] hover:bg-[#F7F4EF] shadow-2xs"
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#878378] font-semibold block">
              Agenda y Citas
            </span>
            <h3 className="font-serif text-xl font-semibold text-[#2D2C28] mt-1">
              Mis reservas
            </h3>
            <p className="mt-1.5 text-xs text-[#5B5650] leading-relaxed">
              Consulta tus próximas citas confirmadas y revisa tu historial de servicios en el estudio.
            </p>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="block rounded-3xl border border-[#B6AEA1] bg-[#E3DAC9] p-6 transition-all hover:bg-[#B6AEA1]/50 shadow-2xs"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#5B5650] font-semibold block">
                Gestión del Estudio
              </span>
              <h3 className="font-serif text-xl font-semibold text-[#2D2C28] mt-1">
                Panel de Administración
              </h3>
              <p className="mt-1.5 text-xs text-[#5B5650] leading-relaxed">
                Modifica servicios de uñas, cursos, fotografías, tarifas y gestiona la agenda de citas.
              </p>
            </Link>
          )}

          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full rounded-3xl bg-[#2D2C28] p-6 text-left text-[#FAF9F7] transition-colors hover:bg-[#5B5650] shadow-2xs cursor-pointer"
            >
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#E3DAC9] font-semibold block">
                Seguridad
              </span>
              <h3 className="font-serif text-xl font-semibold mt-1">
                Cerrar sesión
              </h3>
              <p className="mt-1.5 text-xs text-[#E3DAC9] leading-relaxed">
                Salir de tu cuenta de forma segura en este dispositivo.
              </p>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
