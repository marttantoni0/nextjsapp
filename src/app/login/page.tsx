"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { useEffect } from "react"; // Import useEffect for side effects
import { login, type ActionState } from "./actions"; // Import ActionState type

// Local ActionState definition removed

export default function Login() {
  const router = useRouter();
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    login, //action of the form on submission
    {} // initial state of the form, you can fill it previous values on error.
  );

  useEffect(() => {
    if (state.success) {
      router.push("/"); // Redirect to homepage on successful login
    }
  }, [state.success, router]);

  return (
    <div className="container w-1/2">
      <form action={action} className="space-y-4">
        {state?.errors?.general && (
          <p className="error mb-4">{state.errors.general}</p>
        )}
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" defaultValue={state?.email ?? ""} />
          {state?.errors?.email && (
            <p className="error">{state.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
          {state?.errors?.password && (
            <p className="error">{state.errors.password}</p>
          )}
        </div>

        <div className="flex items-end gap-4">
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? "Loading..." : "Login"}
          </button>

          <Link href="/register" className="text-link">
            or register here
          </Link>
        </div>
      </form>
    </div>
  );
}
