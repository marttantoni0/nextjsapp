import NavLink from "./NavLink";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/actions/logout";

export default async function Navigation() {
  // have in mind that by authenticating the user via server in the navbar, you are making this component dynamic - it cannot be cached on the server. Even tho the build will show it's static - it's not because you are authenticating the user dynamically on each rerender.
  // Consider either using client-auth-side here or extracting the component with user data into another component. That way you will be caching navbar and only dynamically generating the user profile.

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null; // Handle error appropriately
  }

  // If no user is found, data.user will be null.
  // The component will then render the unauthenticated links.

  return (
    <nav className="flex items-center justify-between">
      <NavLink label="Home" href="/" />

      {data.user ? (
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
