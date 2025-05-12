"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Tipado de props
interface NavLinkProps {
  label: string;
  href: string;
}

export default function NavLink({ label, href }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={`nav-link ${pathname === href ? "nav-link-active" : ""}`}
      href={href}
    >
      {label}
    </Link>
  );
}
