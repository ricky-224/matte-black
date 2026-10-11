import type { Metadata } from "next";
import { Syne, Manrope, Bebas_Neue } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { cn } from "@/lib/utils";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Matte Black",
  description: "Everything, in black.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "dark",
        syne.variable,
        manrope.variable,
        bebasNeue.variable,
        "font-sans"
      )}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            if (localStorage.getItem('theme') === 'light') {
              document.documentElement.classList.remove('dark');
            }
          } catch (e) {}`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <NewsletterPopup />
        </Providers>
      </body>
    </html>
  );
}
