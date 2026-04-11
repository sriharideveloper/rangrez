import { getAllBlogs } from "../lib/supabase/blogs";
import { getAllProducts } from "../lib/supabase/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export default async function sitemap() {
  const baseUrl = "https://www.rangrezstencils.in";

  // Dynamic content fetching
  let blogs = [];
  let products = [];

  try {
    blogs = await getAllBlogs();
  } catch (e) {
    console.error("sitemap blog fetch error", e);
  }

  try {
    products = await getAllProducts();
  } catch (e) {
    console.error("sitemap product fetch error", e);
  }

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.published_at || new Date()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...blogUrls, ...productUrls];
}
