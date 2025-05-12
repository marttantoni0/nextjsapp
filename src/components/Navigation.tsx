import NavLink from "./NavLink";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/actions/logout";

export default async function Navigation() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null; // Handle error appropriately
  }

  return (
    <nav className="flex items-center justify-between">
      <NavLink label="Home" href="/" />

      {data ? (
        <div className="flex items-center gap-4">
          <NavLink label="New Post" href="/posts/create" />
          <NavLink label="Dashboard" href="/dashboard" />
          <form action={signOut}>
            <button className="nav-link" type="submit">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="flex gap-4">
          <NavLink label="Register" href="/register" />
          <NavLink label="Login" href="/login" />
        </div>
      )}
    </nav>
  );
}
