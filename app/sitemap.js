import { getAllBlogs } from "../lib/supabase/blogs";
import { getAllProducts } from "../lib/supabase/products";

export default async function sitemap() {
  const baseUrl = "https://rangrez-henna.com";

  // Dynamic content fetching
  const blogs = await getAllBlogs();
  const products = await getAllProducts();

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
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticUrls, ...blogUrls, ...productUrls];
}
