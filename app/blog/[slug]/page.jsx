import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Share2, Tag, Bookmark } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "../../../lib/supabase/blogs";
import BlogDetailClient from "./BlogDetailClient";

// Static param generation for "Buttery Smooth" pre-rendering
export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

// SEO Dynamic Metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) return { title: "Blog Not Found | Rangrez" };
  
  return {
    title: `${blog.title} | Rangrez Blog`,
    description: blog.excerpt || "Malabar Magic, stories and DIY secrets.",
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [`/blog/${slug}/opengraph-image`],
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return <BlogDetailClient blog={blog} />;
}
