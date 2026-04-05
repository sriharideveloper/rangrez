import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Share2, Tag, Bookmark } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "../../../lib/supabase/blogs";
import BlogDetailClient from "./BlogDetailClient";

// Static param generation for "Buttery Smooth" pre-rendering
export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  if (!blogs || !Array.isArray(blogs)) return [];
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
    title: `${blog.title} | Rangrez Tea Time`,
    description: blog.excerpt || "Grab your tea and get ready for some Malabar truth bombs, henna hacks, and unapologetic real talk.",
    openGraph: {
      title: `${blog.title} | Rangrez Tea Time`,
      description: blog.excerpt || "Grab your tea and get ready for some Malabar truth bombs, henna hacks, and unapologetic real talk.",
      images: [`/blog/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Rangrez Truth Bombs`,
      description: blog.excerpt || "Read and weep (joy). Because we aren't gatekeeping today.",
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return <BlogDetailClient blog={blog} />;
}
