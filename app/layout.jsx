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
  title: "Rangrez Henna | DIY Henna Stencils | Stop Paying the 'Bride Tax'",
  description:
    "Zero tears, maximum aesthetic. Stop paying ₹5000 for a blurry circle! Get Malabar Magic on your hands in 5 minutes with our laser-cut DIY stencils.",
  keywords: "henna, stencils, Kochi Mehndi, Kerala Wedding, Malayali Bride, Malabar Henna, DIY Mehndi, Reusable Stencils, Rangrez",
  authors: [{ name: "Rangrez Team" }],
  openGraph: {
    title: "Rangrez Henna | Peel. Paste. Slay.",
    description: "Wedding-ready henna without the salon trauma or tears. Grab your Kochi stencil today.",
    url: "https://rangrez-henna.com",
    siteName: "Rangrez Henna",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rangrez | DIY Kerala Bridal Art",
    description: "Stop paying ₹5000 for a blurry circle! DIY Malabar magic in 5 minutes.",
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
