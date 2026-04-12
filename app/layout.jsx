import { Instrument_Serif, Poppins } from "next/font/google";
import "./globals.scss";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import SmoothScroller from "../components/SmoothScroller";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL("https://www.rangrezstencils.in"),
  title: {
    default: "Rangrez Henna | Premium DIY Henna Stencils",
    template: "%s | Rangrez Henna",
  },
  description:
    "Premium DIY bridal henna stencils. Stop paying premium prices for temporary art. Get perfect Malabar aesthetic henna on your hands in 5 minutes with our reusable laser-cut stencils.",
  keywords: ["henna", "stencils", "Kochi Mehndi", "Kerala Wedding", "DIY Mehndi", "Reusable Stencils", "Rangrez", "Bridal Henna", "Quick Mehndi", "Organic Henna Art"],
  authors: [{ name: "Rangrez Team", url: "https://www.rangrezstencils.in/about" }],
  creator: "Rangrez",
  publisher: "Rangrez Henna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "Rangrez Henna | Peel. Paste. Slay.",
    description: "Wedding-ready henna without the salon trauma or tears. Grab your Kochi stencil today.",
    url: "https://www.rangrezstencils.in",
    siteName: "Rangrez Henna",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Rangrez Henna Premium Stencils",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangrez | Premium DIY Bridal Henna",
    description: "Stop paying premium prices for temporary art. Perfect DIY Malabar magic in 5 minutes.",
    images: ["/logo.jpg"],
    creator: "@rangrezhenna",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE", // Replace when available
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#A44A3F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${instrumentSerif.variable} ${poppins.variable} grain-overlay`}>
        <SmoothScroller>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </SmoothScroller>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
