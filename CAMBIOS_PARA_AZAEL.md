# Resumen de Cambios — Vaema Nails (Elche)

Esta carpeta contiene los archivos actualizados sobre la base unificada de Azael, manteniendo intacta toda la lógica de Supabase (`requireUser`, `loginUser`, `logoutUser`, `registerUser`, `customers`, `appointments` y `services`).

## Archivos modificados y motivo de cada cambio

1. **`app/(public)/mi-cuenta/page.tsx` y `app/(public)/mis-reservas/page.tsx`**
   - Se mantiene exactamente la misma lógica de servidor (`await requireUser()` y `logoutUser`), adaptando el diseño visual a la paleta cálida y tarjetas del resto de la web.
   - Si el usuario autenticado tiene rol `admin` o `superadmin`, le aparece directamente una tarjeta de acceso a `/admin`.
   - En `mis-reservas/page.tsx` se corrigió el filtro de historial (`< new Date()`) y se eliminó el import no usado de `repl`.

2. **`actions/auth/auth.ts`, `app/(auth)/login/page.tsx` y `components/layout/Navbar.tsx`**
   - **Login unificado**: Se eliminaron los dos botones separados de «Acceso Clientas / Acceso Administración» en `/login`. Ahora hay un único formulario de correo y contraseña.
   - En `loginUser` (`actions/auth/auth.ts`), tras `supabase.auth.signInWithPassword`, se consulta la tabla `user_roles` por `user_id`:
     - Si el rol es `admin` o `superadmin`, redirige automáticamente a `/admin`.
     - Si es usuario normal (`customer`), redirige a `/mi-cuenta`.
   - En `Navbar.tsx`, cuando hay sesión iniciada también se consulta `user_roles` para mostrar el enlace directo **Panel Admin** únicamente a las cuentas administradoras.
   - Se eliminó el apartado **El Estudio** (`/sobre-nosotros`) de la navegación principal y del pie de página, dejando únicamente: `Inicio`, `Servicios`, `Reservar Cita`, `Cursos`, `Galería` y `Contacto`.

3. **`app/admin/servicios/page.tsx`, `app/admin/cursos/page.tsx`, `app/admin/galeria/page.tsx` y `app/admin/layout.tsx`**
   - **Servicios de Uñas (`/admin/servicios`)**: Añadido botón **Borrar** (elimina en Supabase y en estado), edición completa de servicios existentes (**Modificar**) y subida de fotografía personalizada desde el dispositivo (`<input type="file" accept="image/*" />`) con previsualización y redimensionado automático.
   - **Cursos (`/admin/cursos`)**: Añadido modo **Modificar curso** y botón **Borrar curso**, edición/borrado de convocatorias y subida de foto personalizada desde el dispositivo.
   - **Galería (`/admin/galeria`)**: Añadida subida de fotos desde el dispositivo y botón **Borrar**.

4. **`lib/types.ts`, `lib/mock-data.ts`, `app/layout.tsx`, `components/layout/Footer.tsx`, `app/(public)/page.tsx`, `app/(public)/contacto/page.tsx` y `app/admin/configuracion/page.tsx`**
   - Nombre comercial actualizado a **Vaema Nails**.
   - Dirección del nuevo local: `Carrer Mestre Giner, 6, 03201 Elx, Alicante`.
   - Mapa embebido de Google Maps con las coordenadas exactas: `38.267838793962184, -0.7062819844494604`.
   - Teléfono y WhatsApp: `+34 646 42 47 67` (`https://wa.me/34646424767`).
   - Instagram oficial: `@erma_elche_alicante_formadora` (`https://www.instagram.com/erma_elche_alicante_formadora?rpxt=bG84Y216eWdicHY0`).
   - Horario oficial de lunes a sábado (`08:00 - 21:00`, domingo cerrado) y carta inicial con las especialidades reales del centro en Elche (bases de vitamina y queratina para uñas dañadas, gel, acrílico, poligel, nail art a mano alzada y podo-estética).
