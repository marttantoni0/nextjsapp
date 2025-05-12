'use server'

import { revalidatePath } from 'next/cache'
// Keep redirect for now, might be used by signup or other actions
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Definimos el tipo que devuelve el action `register`
export default interface ActionState {
  email?: string;
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  success?: boolean;
  message?: string;
}

export async function register(
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Supabase register Error:', error);
    return {
      email,
      errors: {
        general: error.message
      }
    };
  }

  // On successful login, return a state indicating success.
  // The component will handle the redirect.
  // redirect('/dashboard');
  return { success: true, email, message: 'Registration successful!' };
}