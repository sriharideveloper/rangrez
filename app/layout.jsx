import { Instrument_Serif, Poppins } from "next/font/google";
import "./globals.scss";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import SmoothScroller from "../components/SmoothScroller";

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
  title: "Rangrez Henna | DIY Henna Stencils Kochi | Malayali Bridal Art",
  description:
    "Arab luxury meets Malabar vibes. High-quality, quick-setup DIY henna stencils from Kochi. Perfect for modern Malayalee weddings and festivals.",
  keywords: "henna, stencils, Kochi Mehndi, Kerala Wedding, Malayali Bride, Malabar Henna, DIY Mehndi, Reusable Stencils, Rangrez",
  authors: [{ name: "Rangrez Team" }],
  openGraph: {
    title: "Rangrez Henna | Professional DIY Stencils from Kochi",
    description: "Laser-cut precision for the Malabar soul. Get bridal-quality henna in 5 minutes.",
    url: "https://rangrez-henna.com",
    siteName: "Rangrez Henna",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangrez Henna | DIY Kerala Bridal Art",
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
      </body>
    </html>
  );
}
