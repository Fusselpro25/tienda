"use client";

import { useState } from "react";
import {
  INITIAL_BUSINESS_HOURS,
  INITIAL_BUSINESS_SETTINGS,
} from "@/lib/mock-data";

export default function ContactoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="rounded-3xl bg-[#E3DAC9]/70 border border-[#B6AEA1]/40 p-8 sm:p-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[#5B5650] font-semibold">
          Ubicación del Nuevo Local en Elche y Atención Directa
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#2D2C28] mt-2">
          Contacto, Horarios y Mapa
        </h1>
        <p className="text-sm text-[#5B5650] mt-2 max-w-2xl">
          Escríbenos directamente por WhatsApp o Instagram para consultas sobre diseños, uñas de gel/acrílico/poligel, tratamientos de queratina o formaciones presenciales en Elche.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Datos de Contacto
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9]">
                <span className="text-[#878378] block">Dirección del nuevo local</span>
                <strong className="text-[#2D2C28] text-sm block mt-0.5">
                  {INITIAL_BUSINESS_SETTINGS.address}
                </strong>
                <span className="text-[11px] text-[#5B5650] mt-1 block">
                  Coordenadas GPS: 38.267839, -0.706282
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3">
                <div>
                  <span className="text-[#878378] block">Teléfono y WhatsApp</span>
                  <strong className="text-[#2D2C28] text-sm">
                    {INITIAL_BUSINESS_SETTINGS.phone}
                  </strong>
                </div>
                <a
                  href={INITIAL_BUSINESS_SETTINGS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] shrink-0"
                >
                  Abrir WhatsApp
                </a>
              </div>

              {INITIAL_BUSINESS_SETTINGS.instagram && (
                <div className="p-3.5 rounded-xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[#878378] block">Instagram Oficial y Formaciones</span>
                    <strong className="text-[#2D2C28] text-sm">
                      {INITIAL_BUSINESS_SETTINGS.instagram_handle || "@erma_elche_alicante_formadora"}
                    </strong>
                  </div>
                  <a
                    href={INITIAL_BUSINESS_SETTINGS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#E3DAC9] text-[#2D2C28] font-medium hover:bg-[#B6AEA1] shrink-0"
                  >
                    Ver Instagram
                  </a>
                </div>
              )}

              {INITIAL_BUSINESS_SETTINGS.previous_maps_url && (
                <div className="p-3.5 rounded-xl bg-[#F1EDE4] border border-[#E3DAC9] space-y-1.5">
                  <span className="text-[#878378] block">
                    Referencia de nuestra ubicación anterior en Elche
                  </span>
                  <p className="text-[#5B5650]">
                    Anteriormente en{" "}
                    <strong className="text-[#2D2C28]">
                      {INITIAL_BUSINESS_SETTINGS.previous_address}
                    </strong>
                    . Ahora te atendemos en nuestro nuevo estudio en{" "}
                    <strong className="text-[#2D2C28]">
                      Carrer Mestre Giner, 6
                    </strong>.
                  </p>
                  <a
                    href={INITIAL_BUSINESS_SETTINGS.previous_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[#2D2C28] font-semibold underline pt-0.5"
                  >
                    Ver reseñas y ficha anterior en Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Horario Habitual
            </h2>
            <ul className="space-y-2 text-xs">
              {INITIAL_BUSINESS_HOURS.map((bh) => (
                <li
                  key={bh.id}
                  className="flex justify-between py-1.5 border-b border-[#EBE5D9]"
                >
                  <span className="font-medium text-[#2D2C28]">{bh.weekday_label}</span>
                  <span className="text-[#5B5650]">
                    {bh.is_closed
                      ? "Cerrado"
                      : `${bh.opens_at} - ${bh.closes_at}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mapa de Google embebido y Formulario de consulta */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#EBE5D9] bg-[#F1EDE4] h-80 shadow-2xs">
            <iframe
              title="Mapa de ubicación en Carrer Mestre Giner, 6, Elx, Alicante"
              src={INITIAL_BUSINESS_SETTINGS.maps_url}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 sm:p-8 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Envíanos una consulta
            </h2>
            {sent ? (
              <div className="p-4 rounded-2xl bg-[#E3DAC9] text-[#2D2C28] text-xs font-medium">
                Hemos recibido tu mensaje. Te responderemos lo antes posible por teléfono o WhatsApp.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
              >
                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Teléfono o Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+34 600 00 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-[#2D2C28] mb-1">
                    Mensaje o consulta sobre servicios / cursos *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Escribe aquí tu consulta..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] cursor-pointer"
                  >
                    Enviar Consulta
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
