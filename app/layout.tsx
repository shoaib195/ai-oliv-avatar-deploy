"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/store/provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [hasOlivData, setHasOlivData] = useState<boolean | null>(null);

  // ✅ Get role from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("olivData");
    if (!stored) {
      setHasOlivData(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setHasOlivData(true);

      if (parsed?.employer?.role === "employer") {
        setRole("employer");
      } else if (parsed?.candidate) {
        setRole("candidate");
      }
    } catch (e) {
      console.error("Invalid olivData", e);
      setHasOlivData(false);
    }
  }, []);

  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );
  const isRootPath = pathSegments.length === 0;
  const isSingleSegmentPath = pathSegments.length === 1;
  const restrictAccess = (!hasOlivData && hasOlivData !== null) || role === "employer";

  useEffect(() => {
    if (restrictAccess) {
      if (isRootPath) {
        router.replace("/chat");
        return;
      }

      if (!isSingleSegmentPath) {
        router.replace(`/${pathSegments[0] ?? ""}`);
      }
    }
  }, [isRootPath, isSingleSegmentPath, pathSegments, restrictAccess, router]);

  /**
   * ❌ Footer hide when:
   * /[id] (dynamic avatar chat page)
   */
  const hideFooter =
    pathname !== "/" && pathname.split("/").length === 2;

  /**
   * ❌ Header hide when role is employer
   */
  const hideHeader = role === "employer" || hasOlivData === false;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <div className="flex min-h-screen flex-col">

            {/* Header condition */}
            {!hideHeader && <Header />}

            <main className="flex-1">{children}</main>

            {/* Footer condition */}
            {!hideFooter && <Footer />}
          </div>

          <Toaster position="top-right" richColors />
        </StoreProvider>
      </body>
    </html>
  );
}
