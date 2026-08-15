import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jastip Web App",
  description: "Platform Titip Barang Luar Negeri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Menggabungkan inter.className dengan background kustom #e9ebe6 */}
      <body className={`${inter.className} bg-[#e9ebe6] min-h-screen text-slate-900`}>
        <UserProvider>
          {/* Navbar muncul di bagian atas seluruh halaman */}
          <Navbar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}