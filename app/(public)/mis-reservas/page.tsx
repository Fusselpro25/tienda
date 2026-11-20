import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function MisReservasPege() {
    const user = await requireUser()
    const supabase = await createClient()

    const { data: customer, error: customerError } = await supabase
        .from('customers').select('id').eq('profile_id', user.id).maybeSingle()

    if (customerError) {
        console.error('Error buscando clientes:', customerError.message)
    }

    // Si aún no existe el cliente
    if (!customer) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-10 text-center space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#2D2C28]">
                        Mis reservas
                    </h1>
                    <p className="text-sm text-[#5B5650]">
                        No hemos encontrado tu perfil de cliente o aún no has realizado tu primera reserva.
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                        <Link
                            href="/reservas"
                            className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650]"
                        >
                            Reservar una cita
                        </Link>
                        <Link
                            href="/mi-cuenta"
                            className="px-6 py-3 rounded-full bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] text-xs font-medium"
                        >
                            Volver a Mi cuenta
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
      id,
      starts_at,
      ends_at,
      status,
      service_name_snapshot,
      price_snapshot,
      deposit_required,
      notes
    `).eq('customer_id', customer.id).order('starts_at', { ascending: false })

    if (error) {
        console.error('Error consultando reservas:', error.message)
    }

    const reservations = appointments ?? []

    const upcoming = reservations.filter(
        (appointment) =>
            new Date(appointment.starts_at) >= new Date() &&
            appointment.status !== 'cancelled'
    )

    const history = reservations.filter(
        (appointment) =>
            new Date(appointment.starts_at) < new Date() ||
            appointment.status === 'cancelled'
    )

    function formatDate(date: string) {
        return new Intl.DateTimeFormat('es-ES', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(date))
    }

    function statusLabel(status: string) {
        const labels: Record<string, string> = {
            pending_payment: 'Pendiente de pago',
            confirmed: 'Confirmada',
            cancelled: 'Cancelada',
            completed: 'Completada'
        }
        return labels[status] ?? status
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
                        Agenda Personal
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-[#2D2C28]">
                        Mis reservas
                    </h1>
                    <p className="text-sm sm:text-base text-[#5B5650]">
                        Hola, {user.fullName || user.email}. Aquí puedes consultar tus próximas citas y tu historial en el estudio.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/reservas"
                        className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium hover:bg-[#5B5650] transition-colors"
                    >
                        Nueva Cita
                    </Link>
                    <Link
                        href="/mi-cuenta"
                        className="px-5 py-3 rounded-full bg-[#FAF9F7] border border-[#B6AEA1] text-[#2D2C28] text-xs font-medium hover:bg-[#F1EDE4] transition-colors"
                    >
                        Volver a Mi cuenta
                    </Link>
                </div>
            </div>

            <section className="space-y-5">
                <h2 className="text-2xl font-serif font-semibold text-[#2D2C28]">
                    Próximas citas
                </h2>

                {upcoming.length === 0 ? (
                    <div className="rounded-3xl border border-[#EBE5D9] bg-[#FAF9F7] p-10 text-center space-y-4">
                        <h3 className="text-xl font-serif font-semibold text-[#2D2C28]">
                            Todavía no tienes reservas próximas
                        </h3>
                        <p className="text-xs text-[#5B5650] max-w-md mx-auto">
                            Elige el tratamiento de uñas que prefieras y reserva tu hueco en nuestra agenda online.
                        </p>
                        <Link
                            href="/reservas"
                            className="inline-block rounded-full bg-[#2D2C28] px-7 py-3.5 text-xs font-medium text-[#FAF9F7] hover:bg-[#5B5650] transition-colors"
                        >
                            Reservar una cita
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        {upcoming.map((appointment) => (
                            <article
                                key={appointment.id}
                                className="rounded-3xl border border-[#EBE5D9] bg-[#FAF9F7] p-6 sm:p-8 shadow-2xs"
                            >
                                <div className="flex flex-wrap justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-serif font-semibold text-[#2D2C28]">
                                            {appointment.service_name_snapshot}
                                        </h3>

                                        <p className="mt-1.5 text-xs text-[#5B5650]">
                                            {formatDate(appointment.starts_at)}
                                        </p>
                                    </div>

                                    <span className="h-fit rounded-full bg-[#E3DAC9] px-4 py-1.5 text-xs font-medium text-[#2D2C28]">
                                        {statusLabel(appointment.status)}
                                    </span>
                                </div>

                                <div className="mt-5 border-t border-[#EBE5D9] pt-4 flex flex-wrap gap-6 text-xs text-[#5B5650]">
                                    <p>
                                        Precio total: <strong className="text-[#2D2C28]">{appointment.price_snapshot} €</strong>
                                    </p>
                                    <p>
                                        Anticipo (50%): <strong className="text-[#2D2C28]">{appointment.deposit_required} €</strong>
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-5">
                <h2 className="text-2xl font-serif font-semibold text-[#2D2C28]">
                    Historial de reservas
                </h2>

                {history.length === 0 ? (
                    <div className="rounded-3xl border border-[#EBE5D9] bg-[#F7F4EF] p-6 text-xs text-[#5B5650]">
                        Todavía no tienes citas anteriores registradas.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((appointment) => (
                            <article
                                key={appointment.id}
                                className="rounded-2xl border border-[#EBE5D9] bg-[#FAF9F7] p-6 flex flex-wrap items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="font-serif text-lg font-semibold text-[#2D2C28]">
                                        {appointment.service_name_snapshot}
                                    </h3>
                                    <p className="mt-1 text-xs text-[#878378]">
                                        {formatDate(appointment.starts_at)}
                                    </p>
                                </div>

                                <div className="text-right text-xs space-y-1">
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#F1EDE4] text-[#5B5650] font-medium">
                                        {statusLabel(appointment.status)}
                                    </span>
                                    <p className="font-serif text-base font-semibold text-[#2D2C28]">
                                        {appointment.price_snapshot} €
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
