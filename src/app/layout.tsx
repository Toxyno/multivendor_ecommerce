import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { ToastProviderCustom } from "@/components/ui/use-toast";
import ModalProvider from "@/providers/ModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoShop MultiVendor_Ecommerce",
  description:
    "This is a Multivendor Ecommerce Website, built with flexbility and modularity in mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProviderCustom>
              <ModalProvider>{children}</ModalProvider>
              <Toaster />
              <SonnerToaster position="bottom-left" />
            </ToastProviderCustom>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
