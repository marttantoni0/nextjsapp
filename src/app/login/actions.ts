'use server'

import { revalidatePath } from 'next/cache'
// Keep redirect for now, might be used by signup or other actions
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// This ActionState should match the one in your component
export interface ActionState {
  email?: string;
  errors?: {
    email?: string;
    password?: string;
    general?: string; // For general errors not specific to a field
  };
  success?: boolean; // To indicate successful login
}

export async function login(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const errors: ActionState['errors'] = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Valid email is required.';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { email, errors };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    console.error('Supabase SignIn Error:', signInError.message);
    return {
      email,
      errors: {
        general: signInError.message || 'Invalid login credentials. Please try again.'
      }
    };
  }

  revalidatePath('/', 'layout');
  // On successful login, return a state indicating success.
  // The component will handle the redirect.
  return { success: true, email };
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}