'use server'

import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

// Validación de datos

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string) {
    return (
        password.length >= 10 &&
        password.length <= 72 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    )
}

// Registro de users

export async function registerUser(formData: FormData) {
    const supabase = await createClient()

    const fullName = String(
        formData.get('full_name') ?? ''
    ).trim()

    const email = String(
        formData.get('email') ?? ''
    ).trim().toLowerCase()

    const password = String(
        formData.get('password') ?? ''
    )

    if (
        !fullName ||
        fullName.length > 100 ||
        !isValidEmail(email) ||
        email.length > 254 ||
        !isValidPassword(password)
    ) {
        redirect('/?auth=invalid-data')
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    if (error) {
        console.error('Error de registro', error.message)
        redirect('/?auth=register-error')
    }
    console.log('REGISTRO CORRECTO: redirigiendo a inicio')
    redirect('/?auth=registered')
}

// Inicio de sesión unificado (detecta automáticamente usuario normal o cuenta admin)

export async function loginUser(formData: FormData) {
    const supabase = await createClient()

    const email = String(
        formData.get('email') ?? ''
    ).trim().toLowerCase()

    const password = String(
        formData.get('password') ?? ''
    )

    if (
        !email ||
        email.length > 254 ||
        !isValidEmail(email) ||
        !password ||
        password.length > 72
    ) {
        redirect('/login?auth=invalid-data')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error || !data.user) {
        console.error('Error de inicio de sesión:', error?.message)
        redirect('/login?auth=login-error')
    }

    // Comprobar el rol de la cuenta en user_roles (usuario normal vs cuenta admin)
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle()

    const role = roleData?.role ?? 'customer'

    if (role === 'admin' || role === 'superadmin') {
        redirect('/admin')
    }

    redirect('/mi-cuenta')
}

// Cierre de sesión

export async function logoutUser() {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error al cerrar sesión:', error.message)
        redirect('/?auth=logout-error')
    }

    redirect('/')
}
