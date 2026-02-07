"use client";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../../context/UserContext";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  if (!user || pathname.startsWith("/auth")) return null;

  return <Navbar user={user} onLogout={handleLogout} />;
}
