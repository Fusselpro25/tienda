"use client";

import { useState } from "react";
import {
  INITIAL_COURSES,
  INITIAL_COURSE_CATEGORIES,
  INITIAL_COURSE_ENROLLMENTS,
  INITIAL_COURSE_SESSIONS,
  INITIAL_CUSTOMERS,
} from "@/lib/mock-data";
import { CourseModality, CourseSession, NailCourse } from "@/lib/types";

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<NailCourse[]>(INITIAL_COURSES);
  const [sessions, setSessions] = useState<CourseSession[]>(
    INITIAL_COURSE_SESSIONS
  );
  const [notice, setNotice] = useState<string | null>(null);

  // Estado de creación / edición de curso
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseCatId, setCourseCatId] = useState(
    INITIAL_COURSE_CATEGORIES[0].id
  );
  const [coursePrice, setCoursePrice] = useState("290");
  const [courseDurationHours, setCourseDurationHours] = useState("16");
  const [courseLevel, setCourseLevel] = useState("Todos los niveles");
  const [courseModality, setCourseModality] =
    useState<CourseModality>("Presencial");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseSyllabusText, setCourseSyllabusText] = useState(
    "Teoría anatómica y química de productos\nPráctica supervisada paso a paso\nCertificado acreditativo"
  );
  const [courseImage, setCourseImage] = useState(
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85"
  );
  const [uploadedCourseFileName, setUploadedCourseFileName] = useState<
    string | null
  >(null);

  // Estado de convocatorias (fechas)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionCourseId, setSessionCourseId] = useState(INITIAL_COURSES[0].id);
  const [sessionDate, setSessionDate] = useState("2026-12-20");
  const [sessionCapacity, setSessionCapacity] = useState("6");
  const [sessionLocation, setSessionLocation] = useState(
    "Estudio ERMA Elche — Carrer Mestre Giner, 6 (Elx, Alicante)"
  );

  const showTempNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCourseFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedCourseFileName(file.name);
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
          setCourseImage(canvas.toDataURL("image/jpeg", 0.84));
        } else {
          setCourseImage(resultStr);
        }
      };
      img.src = resultStr;
    };
    reader.readAsDataURL(file);
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseName("");
    setCourseCatId(INITIAL_COURSE_CATEGORIES[0].id);
    setCoursePrice("290");
    setCourseDurationHours("16");
    setCourseLevel("Todos los niveles");
    setCourseModality("Presencial");
    setCourseDesc("");
    setCourseSyllabusText(
      "Teoría anatómica y química de productos\nPráctica supervisada paso a paso\nCertificado acreditativo"
    );
    setCourseImage(
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85"
    );
    setUploadedCourseFileName(null);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const syllabusItems = courseSyllabusText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCourseId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourseId
            ? {
                ...c,
                category_id: courseCatId,
                name: courseName.trim(),
                description: courseDesc.trim(),
                price: Number(coursePrice),
                modality: courseModality,
                duration_hours: Number(courseDurationHours) || 16,
                level: courseLevel.trim() || "Todos los niveles",
                image_path:
                  courseImage.trim() ||
                  "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
                syllabus:
                  syllabusItems.length > 0
                    ? syllabusItems
                    : c.syllabus,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
      showTempNotice("Curso modificado correctamente.");
      resetCourseForm();
      return;
    }

    const newCourse: NailCourse = {
      id: `crs-${Date.now()}`,
      category_id: courseCatId,
      name: courseName.trim(),
      description: courseDesc.trim(),
      price: Number(coursePrice),
      modality: courseModality,
      image_path:
        courseImage.trim() ||
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
      is_active: true,
      duration_hours: Number(courseDurationHours) || 16,
      level: courseLevel.trim() || "Todos los niveles",
      includes_kit: true,
      syllabus:
        syllabusItems.length > 0
          ? syllabusItems
          : [
              "Teoría anatómica y química de productos",
              "Práctica supervisada paso a paso",
              "Certificado acreditativo",
            ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCourses((prev) => [newCourse, ...prev]);
    showTempNotice("Nuevo curso creado correctamente.");
    resetCourseForm();
  };

  const handleEditCourseClick = (course: NailCourse) => {
    setEditingCourseId(course.id);
    setCourseName(course.name);
    setCourseCatId(course.category_id);
    setCoursePrice(String(course.price));
    setCourseDurationHours(String(course.duration_hours));
    setCourseLevel(course.level);
    setCourseModality(course.modality);
    setCourseDesc(course.description);
    setCourseSyllabusText(course.syllabus.join("\n"));
    setCourseImage(course.image_path);
    setUploadedCourseFileName(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCourse = (course: NailCourse) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas borrar el curso "${course.name}" y sus convocatorias?`
    );
    if (!confirmed) return;

    setCourses((prev) => prev.filter((c) => c.id !== course.id));
    setSessions((prev) => prev.filter((s) => s.course_id !== course.id));
    if (editingCourseId === course.id) {
      resetCourseForm();
    }
    showTempNotice(`Curso "${course.name}" eliminado.`);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === editingSessionId
            ? {
                ...s,
                course_id: sessionCourseId,
                starts_at: `${sessionDate}T09:30:00Z`,
                ends_at: `${sessionDate}T18:30:00Z`,
                capacity: Number(sessionCapacity),
                location: sessionLocation,
              }
            : s
        )
      );
      setEditingSessionId(null);
      showTempNotice("Convocatoria actualizada correctamente.");
      return;
    }

    const newSession: CourseSession = {
      id: `ses-${Date.now()}`,
      course_id: sessionCourseId,
      starts_at: `${sessionDate}T09:30:00Z`,
      ends_at: `${sessionDate}T18:30:00Z`,
      capacity: Number(sessionCapacity),
      enrolled_count: 0,
      status: "open",
      location: sessionLocation,
    };
    setSessions((prev) => [newSession, ...prev]);
    showTempNotice("Nueva convocatoria abierta correctamente.");
  };

  const handleEditSessionClick = (ses: CourseSession) => {
    setEditingSessionId(ses.id);
    setSessionCourseId(ses.course_id);
    setSessionDate(ses.starts_at.slice(0, 10));
    setSessionCapacity(String(ses.capacity));
    setSessionLocation(ses.location);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSession = (sesId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sesId));
    if (editingSessionId === sesId) {
      setEditingSessionId(null);
    }
    showTempNotice("Convocatoria eliminada.");
  };

  const toggleCourseActive = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#878378] font-semibold">
            Academia y Formación en Elche
          </span>
          <h1 className="font-serif text-3xl font-semibold text-[#2D2C28] mt-1">
            Gestión de Cursos, Fechas y Alumnas
          </h1>
          <p className="text-xs text-[#5B5650] mt-1">
            Crea nuevos cursos con fotografías personalizadas, modifica o borra los existentes y gestiona las fechas de convocatoria.
          </p>
        </div>

        {notice && (
          <div className="px-4 py-2.5 rounded-full bg-[#2D2C28] text-[#FAF9F7] text-xs font-medium shrink-0">
            {notice}
          </div>
        )}
      </div>

      {/* Formularios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs items-start">
        <form
          onSubmit={handleSaveCourse}
          className="rounded-3xl bg-[#FAF9F7] border border-[#EBE5D9] p-6 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-[#EBE5D9] pb-3">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              {editingCourseId
                ? "1. Modificar Curso Existente"
                : "1. Crear Nuevo Curso de Uñas"}
            </h2>
            {editingCourseId && (
              <button
                type="button"
                onClick={resetCourseForm}
                className="text-[#878378] hover:text-[#2D2C28] underline cursor-pointer"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Nombre del curso *
            </label>
            <input
              type="text"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Ej. Curso Avanzado de Estructuras en Gel y Poligel"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Categoría
              </label>
              <select
                value={courseCatId}
                onChange={(e) => setCourseCatId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              >
                {INITIAL_COURSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Modalidad
              </label>
              <select
                value={courseModality}
                onChange={(e) =>
                  setCourseModality(e.target.value as CourseModality)
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              >
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                min="1"
                required
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Duración (horas)
              </label>
              <input
                type="number"
                min="1"
                required
                value={courseDurationHours}
                onChange={(e) => setCourseDurationHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Nivel requerido
              </label>
              <input
                type="text"
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value)}
                placeholder="Ej. Principiante / Todos los niveles"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Descripción general del curso *
            </label>
            <textarea
              rows={2}
              required
              value={courseDesc}
              onChange={(e) => setCourseDesc(e.target.value)}
              placeholder="Qué aprenderá la alumna en este curso..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Puntos del temario (uno por línea)
            </label>
            <textarea
              rows={3}
              value={courseSyllabusText}
              onChange={(e) => setCourseSyllabusText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F4EF] border border-[#B6AEA1]"
            />
          </div>

          {/* Fotografía personalizada del curso */}
          <div className="p-4 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] space-y-3">
            <label className="block font-medium text-[#2D2C28]">
              Fotografía personalizada del curso
            </label>

            {courseImage && (
              <div className="flex items-center gap-3">
                <img
                  src={courseImage}
                  alt="Vista previa del curso"
                  className="w-20 h-20 rounded-xl object-cover border border-[#B6AEA1] shrink-0"
                />
                <div className="text-[11px] text-[#5B5650] space-y-1">
                  <p className="font-medium text-[#2D2C28]">
                    {uploadedCourseFileName
                      ? `Archivo cargado: ${uploadedCourseFileName}`
                      : "Imagen del curso lista"}
                  </p>
                  <p className="text-[#878378]">
                    Sube una foto desde tu ordenador o móvil, o pega una URL.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#E3DAC9] hover:bg-[#B6AEA1]/70 text-[#2D2C28] font-medium cursor-pointer transition-colors text-center">
                <span>Subir foto del curso desde mi dispositivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCourseFileChange}
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
                value={courseImage.startsWith("data:") ? "" : courseImage}
                onChange={(e) => {
                  setUploadedCourseFileName(null);
                  setCourseImage(e.target.value);
                }}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] cursor-pointer"
          >
            {editingCourseId ? "Guardar Cambios del Curso" : "Publicar Nuevo Curso"}
          </button>
        </form>

        <form
          onSubmit={handleSaveSession}
          className="rounded-3xl bg-[#F7F4EF] border border-[#E3DAC9] p-6 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between border-b border-[#E3DAC9] pb-3">
            <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
              {editingSessionId
                ? "2. Modificar Fecha / Convocatoria"
                : "2. Abrir Nueva Fecha / Convocatoria"}
            </h2>
            {editingSessionId && (
              <button
                type="button"
                onClick={() => setEditingSessionId(null)}
                className="text-[#878378] hover:text-[#2D2C28] underline cursor-pointer"
              >
                Cancelar
              </button>
            )}
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Seleccionar Curso
            </label>
            <select
              value={sessionCourseId}
              onChange={(e) => setSessionCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.price} €)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Fecha de la edición
              </label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2D2C28] mb-1">
                Cupo máximo de alumnas
              </label>
              <input
                type="number"
                min="1"
                required
                value={sessionCapacity}
                onChange={(e) => setSessionCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#2D2C28] mb-1">
              Lugar o modalidad de impartición
            </label>
            <input
              type="text"
              required
              value={sessionLocation}
              onChange={(e) => setSessionLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F7] border border-[#B6AEA1]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#2D2C28] text-[#FAF9F7] font-medium hover:bg-[#5B5650] cursor-pointer"
          >
            {editingSessionId ? "Guardar Cambios de Convocatoria" : "Abrir Convocatoria"}
          </button>
        </form>
      </div>

      {/* Listado de Cursos con Editar, Ocultar y Borrar */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Cursos Registrados ({courses.length}) y sus Convocatorias
        </h2>
        {courses.map((course) => {
          const courseSessions = sessions.filter(
            (s) => s.course_id === course.id
          );
          const isBeingEdited = editingCourseId === course.id;

          return (
            <div
              key={course.id}
              className={`p-6 rounded-3xl border space-y-4 text-xs transition-all ${
                isBeingEdited
                  ? "bg-[#E3DAC9]/40 border-[#2D2C28]"
                  : "bg-[#FAF9F7] border-[#EBE5D9]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={course.image_path}
                    alt={course.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-[#B6AEA1] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-lg font-semibold text-[#2D2C28]">
                        {course.name}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                          course.is_active
                            ? "bg-[#E3DAC9] text-[#2D2C28]"
                            : "bg-[#EBE5D9] text-[#878378]"
                        }`}
                      >
                        {course.is_active ? "Publicado" : "Oculto"}
                      </span>
                    </div>
                    <p className="text-[#878378]">
                      Modalidad: {course.modality} · {course.duration_hours}h · Nivel: {course.level} · Precio:{" "}
                      <strong className="text-[#2D2C28]">{course.price} €</strong>
                    </p>
                    <p className="text-[#5B5650] line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditCourseClick(course)}
                    className="px-3.5 py-2 rounded-xl bg-[#E3DAC9] border border-[#B6AEA1] text-[#2D2C28] font-medium hover:bg-[#B6AEA1] cursor-pointer"
                  >
                    Modificar curso
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCourseActive(course.id)}
                    className="px-3.5 py-2 rounded-xl bg-[#F1EDE4] border border-[#B6AEA1] text-[#2D2C28] font-medium cursor-pointer"
                  >
                    {course.is_active ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course)}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF9F7] border border-[#E3DAC9] text-[#5B5650] hover:bg-[#2D2C28] hover:text-[#FAF9F7] transition-colors cursor-pointer"
                  >
                    Borrar curso
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#EBE5D9]">
                {courseSessions.length === 0 ? (
                  <p className="text-[#878378]">
                    Sin convocatorias asignadas actualmente.
                  </p>
                ) : (
                  courseSessions.map((ses) => (
                    <div
                      key={ses.id}
                      className="p-3.5 rounded-2xl bg-[#F7F4EF] border border-[#EBE5D9] flex items-center justify-between gap-3"
                    >
                      <div>
                        <strong className="text-[#2D2C28]">
                          Fecha: {new Date(ses.starts_at).toLocaleDateString("es-ES")}
                        </strong>
                        <span className="block text-[#5B5650]">
                          Inscritas: {ses.enrolled_count} / {ses.capacity} plazas · {ses.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditSessionClick(ses)}
                          className="px-2.5 py-1 rounded-lg bg-[#E3DAC9] text-[#2D2C28] font-medium cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(ses.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF9F7] border border-[#EBE5D9] text-[#5B5650] hover:bg-[#2D2C28] hover:text-[#FAF9F7] cursor-pointer"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Alumnas inscritas */}
      <div className="rounded-3xl bg-[#F1EDE4] border border-[#E3DAC9] p-6 space-y-4 text-xs">
        <h2 className="font-serif text-xl font-semibold text-[#2D2C28]">
          Alumnas Inscritas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_COURSE_ENROLLMENTS.map((enr) => {
            const customer = INITIAL_CUSTOMERS.find(
              (c) => c.id === enr.customer_id
            );
            const session = sessions.find(
              (s) => s.id === enr.course_session_id
            );
            const course = courses.find((c) => c.id === session?.course_id);
            return (
              <div
                key={enr.id}
                className="p-4 rounded-2xl bg-[#FAF9F7] border border-[#E3DAC9] space-y-1"
              >
                <div className="flex justify-between">
                  <strong className="text-sm text-[#2D2C28]">
                    {customer?.full_name}
                  </strong>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2D2C28] text-[#FAF9F7]">
                    {enr.status}
                  </span>
                </div>
                <p className="text-[#5B5650]">{course?.name || "Curso de formación"}</p>
                <p className="text-[#878378]">
                  Importe abonado: <strong>{enr.price_snapshot} €</strong> ·{" "}
                  {customer?.phone}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
