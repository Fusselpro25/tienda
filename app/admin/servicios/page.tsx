"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import {
  INITIAL_SERVICES,
  INITIAL_SERVICE_CATEGORIES,
} from "@/lib/mock-data";
import { NailService, ServiceCategory } from "@/lib/types";

export default function AdminServiciosPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>(
    INITIAL_SERVICE_CATEGORIES
  );
  const [services, setServices] = useState<NailService[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(
    INITIAL_SERVICE_CATEGORIES[0]?.id || ""
  );
  const [price, setPrice] = useState("38");
  const [duration, setDuration] = useState("75");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState(
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        setLoading(true);

        const [categoriesResult, servicesResult] = await Promise.all([
          supabase
            .from("service_categories")
            .select("*")
            .eq("is_active", true)
            .order("sort_order"),

          supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (!categoriesResult.error && categoriesResult.data?.length) {
          setCategories(categoriesResult.data);
          setCategoryId(categoriesResult.data[0].id);
        }

        if (!servicesResult.error && servicesResult.data?.length) {
          setServices(servicesResult.data);
        }
      } catch (err) {
        console.error("Usando catálogo inicial de respaldo:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showTempNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Procesa la fotografía subida desde el dispositivo (redimensiona para guardarla sin límite pesado)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = typeof reader.result === "string" ? reader.result : "";
      if (!resultStr) return;

      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setImagePath(canvas.toDataURL("image/jpeg", 0.84));
        } else {
          setImagePath(resultStr);
        }
      };
      img.src = resultStr;
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("38");
    setDuration("75");
    setImagePath(
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
    );
    setUploadedFileName(null);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !categoryId || !description.trim()) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const numericPrice = Number(price);
    const numericDuration = Number(duration);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !Number.isInteger(numericDuration) ||
      numericDuration < 15
    ) {
      alert("Comprueba el precio y la duración (mínimo 15 minutos).");
      return;
    }

    const serviceData = {
      name: name.trim(),
      category_id: categoryId,
      price: numericPrice,
      duration_minutes: numericDuration,
      description: description.trim(),
      image_path:
        imagePath.trim() ||
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
    };

    try {
      const supabase = createClient();
      if (editingId) {
        const result = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingId)
          .select()
          .single();

        if (!result.error && result.data) {
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingId ? (result.data as NailService) : s
            )
          );
          showTempNotice("Servicio modificado correctamente.");
          resetForm();
          return;
        }
      } else {
        const result = await supabase
          .from("services")
          .insert(serviceData)
          .select()
          .single();

        if (!result.error && result.data) {
          setServices((prev) => [result.data as NailService, ...prev]);
          showTempNotice("Nuevo servicio publicado correctamente.");
          resetForm();
          return;
        }
      }
    } catch {
      // Actualización en memoria si no hay sesión activa en Supabase
    }

    if (editingId) {
      setServices((prev) =>
        prev.map((srv) =>
          srv.id === editingId
            ? {
                ...srv,
                ...serviceData,
                image_path: serviceData.image_path,
                updated_at: new Date().toISOString(),
              }
            : srv
        )
      );
      showTempNotice("Servicio modificado correctamente.");
    } else {
      const created: NailService = {
        id: `srv-${Date.now()}`,
        ...serviceData,
        image_path: serviceData.image_path,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setServices((prev) => [created, ...prev]);
      showTempNotice("Nuevo servicio publicado correctamente.");
    }

    resetForm();
  };

  const handleEditClick = (srv: NailService) => {
    setEditingId(srv.id);
    setName(srv.name);
    setCategoryId(srv.category_id);
    setPrice(String(srv.price));
    setDuration(String(srv.duration_minutes));
    setDescription(srv.description);
    setImagePath(srv.image_path || "");
    setUploadedFileName(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteService = async (srv: NailService) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas borrar el servicio "${srv.name}"?`
    );
    if (!confirmed) return;

    try {
      const supabase = createClient();
      await supabase.from("services").delete().eq("id", srv.id);
    } catch {
      // Continuar con el borrado en estado
    }

    setServices((prev) => prev.filter((item) => item.id !== srv.id));
    if (editingId === srv.id) {
      resetForm();
    }
    showTempNotice(`Servicio "${srv.name}" eliminado.`);
  };

  const toggleServiceActive = async (srv: NailService) => {
    const nextState = !srv.is_active;
    try {
      const supabase = createClient();
      await supabase
        .from("services")
        .update({ is_active: nextState })
        .eq("id", srv.id);
    } catch {
      // Continuar en estado local
    }

    setServices((prev) =>
      prev.map((s) =>
        s.id === srv.id ? { ...s, is_active: nextState } : s
      )
    );
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: ServiceCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim(),
      sort_order: categories.length + 1,
      is_active: true,
    };

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("service_categories")
        .insert({
          name: newCat.name,
          description: newCat.description,
          sort_order: newCat.sort_order,
          is_active: true,
        })
        .select()
        .single();
      if (!error && data) {
        setCategories((prev) => [...prev, data as ServiceCategory]);
        setNewCatName("");
        setNewCatDesc("");
        return;
      }
    } catch {
      // Respaldo en estado local
    }

    setCategories((prev) => [...prev, newCat]);
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] text-xs text-[#5B5650]">
        Cargando catálogo de servicios...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            Catálogo del Estudio
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
            Gestión de Servicios de Uñas y Tarifas
          </h1>
          <p className="text-xs text-[#5B5650] mt-1">
            Crea nuevos tipos de uñas con fotografía personalizada, modifica precios o descripciones de los existentes y borra u oculta los que ya no ofrezcas.
          </p>
        </div>

        {notice && (
          <div className="px-4 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium shrink-0">
            {notice}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulario de Crear / Modificar Servicio */}
        <form
          onSubmit={handleSaveService}
          className="lg:col-span-5 rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4 text-xs shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-[#EBE5D9] pb-3">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              {editingId ? "Modificar Servicio Existente" : "Añadir Nuevo Servicio de Uñas"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[#878378] hover:text-[#2D2C28] underline cursor-pointer"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Nombre del servicio *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Manicura Semipermanente + Base Queratina"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Categoría *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Precio Total (€) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
              <span className="text-[10px] text-[#878378] mt-1 block">
                Anticipo 50%: {(Number(price || 0) / 2).toFixed(2)} €
              </span>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Duración (minutos) *
              </label>
              <input
                type="number"
                min="15"
                step="5"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Descripción del servicio *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica en qué consiste el tratamiento, materiales y acabado..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          {/* Subida de foto personalizada desde dispositivo o URL */}
          <div className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-3">
            <label className="block font-medium text-[#2D2C28]">
              Fotografía personalizada del servicio
            </label>

            {imagePath && (
              <div className="flex items-center gap-3">
                <img
                  src={imagePath}
                  alt="Vista previa del servicio"
                  className="w-20 h-20 rounded-xl object-cover border border-[#B6AEA1] shrink-0"
                />
                <div className="text-[11px] text-[#5B5650] space-y-1">
                  <p className="font-medium text-[#2D2C28]">
                    {uploadedFileName
                      ? `Archivo cargado: ${uploadedFileName}`
                      : "Vista previa activa"}
                  </p>
                  <p className="text-[#878378]">
                    Puedes subir una foto desde tu ordenador o móvil, o pegar un enlace debajo.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#E3DAC9] hover:bg-[#B6AEA1]/70 text-[#2D2C28] font-medium cursor-pointer transition-colors text-center">
                <span>Subir foto desde mi dispositivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-[11px] text-[#878378] mb-1">
                O introducir URL de imagen:
              </label>
              <input
                type="text"
                value={imagePath.startsWith("data:") ? "" : imagePath}
                onChange={(e) => {
                  setUploadedFileName(null);
                  setImagePath(e.target.value);
                }}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] transition-colors cursor-pointer"
          >
            {editingId ? "Guardar Cambios del Servicio" : "Publicar Nuevo Servicio"}
          </button>
        </form>

        {/* Listado de servicios existentes con Editar, Ocultar y Borrar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              Servicios Registrados ({services.length})
            </h2>
          </div>

          {services.map((srv) => {
            const cat = categories.find((c) => c.id === srv.category_id);
            const isBeingEdited = editingId === srv.id;

            return (
              <div
                key={srv.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isBeingEdited
                    ? "bg-[#E3DAC9]/40 border-[#2D2C28]"
                    : srv.is_active
                    ? "bg-[#FAF9F7] border-[#EBE5D9]"
                    : "bg-[#F1EDE4]/60 border-[#EBE5D9] opacity-70"
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      srv.image_path ||
                      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
                    }
                    alt={srv.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#B6AEA1] shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-semibold text-[#2D2C28]">
                        {srv.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          srv.is_active
                            ? "bg-[#E3DAC9] text-[#2D2C28]"
                            : "bg-[#EBE5D9] text-[#878378]"
                        }`}
                      >
                        {srv.is_active ? "Visible en web" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-[#878378]">
                      Categoría: {cat?.name || "General"} · {srv.duration_minutes} min
                    </p>
                    <p className="text-[#5B5650] line-clamp-2">{srv.description}</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0 text-xs">
                  <div className="text-right">
                    <strong className="font-serif text-lg text-[#2D2C28] block">
                      {srv.price} €
                    </strong>
                    <span className="text-[10px] text-[#878378]">
                      Anticipo 50%: {(srv.price / 2).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditClick(srv)}
                      className="px-3 py-1.5 rounded-lg bg-[#E3DAC9] border border-[#B6AEA1] text-[#2D2C28] font-medium hover:bg-[#B6AEA1] cursor-pointer"
                    >
                      Modificar
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleServiceActive(srv)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF9F7] border border-[#EBE5D9] text-[#5B5650] hover:text-[#2D2C28] cursor-pointer"
                    >
                      {srv.is_active ? "Ocultar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(srv)}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF9F7] border border-[#E3DAC9] text-[#5B5650] hover:bg-[#2D2C28] hover:text-[#FAF9F7] transition-colors cursor-pointer"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorías */}
      <div className="rounded-3xl bg-[#F7F4EF] border border-[#EBE5D9] p-6 space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Categorías de Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#EBE5D9] text-xs flex flex-col justify-between gap-2"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#878378]">
                  Orden #{cat.sort_order}
                </span>
                <strong className="block text-[#2D2C28] font-serif text-sm">
                  {cat.name}
                </strong>
                <p className="text-[#5B5650]">{cat.description}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id)}
                className="self-end text-[11px] text-[#878378] hover:text-[#2D2C28] underline cursor-pointer"
              >
                Eliminar categoría
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleAddCategory}
          className="pt-3 border-t border-[#EBE5D9] flex flex-col sm:flex-row gap-3 text-xs"
        >
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Nueva categoría (ej. Pedicura & Podo-Estética)"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
          />
          <input
            type="text"
            value={newCatDesc}
            onChange={(e) => setNewCatDesc(e.target.value)}
            placeholder="Descripción breve de la categoría"
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium shrink-0 cursor-pointer"
          >
            Añadir Categoría
          </button>
        </form>
      </div>
    </div>
  );
}
