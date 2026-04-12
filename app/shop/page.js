import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop Full Collection | Rangrez Henna Stencils",
  description: "Browse the complete collection of Rangrez Henna stencils. From bridal full-hands to minimalist Kochi designs. Quick DIY application, zero smudges.",
  openGraph: {
    title: "Shop All Stencils | Rangrez Henna",
    description: "Browse the complete collection of Rangrez Henna stencils.",
    url: "https://www.rangrezstencils.in/shop",
  },
};

export default function Shop() {
  return <ShopClient />;
}
