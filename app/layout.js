import { Instrument_Serif, Poppins } from "next/font/google";
import "../app/globals.scss";
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";

const instrumentSerif = Instrument_Serif({
  weight: "400",
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
  title: "Rangrez Henna | Professional-Grade Reusable Stencils",
  description:
    "Arab luxury finesse meets Malabar vibes. Unhinged beauty, extreme cleanliness, and an ultra-premium feel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${poppins.variable}`}>
        <Navbar />
        <main>{children}</main>
        <CartDrawer />
      </body>
    </html>
  );
}
