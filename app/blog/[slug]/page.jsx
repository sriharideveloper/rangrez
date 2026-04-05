import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Share2, Tag, Bookmark } from "lucide-react";
import { getBlogBySlug, getAllBlogs } from "../../../lib/supabase/blogs";
import BlogDetailClient from "./BlogDetailClient";

// Static param generation for "Buttery Smooth" pre-rendering
export async function generateStaticParams() {
  try {
    const blogs = await getAllBlogs();
    if (!blogs || !Array.isArray(blogs)) return [];
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (err) {
    console.error("Error in generateStaticParams for blogs:", err);
    return [];
  }
}

// SEO Dynamic Metadata
export async function generateMetadata({ params }) {
  let slug = "";
  let blog = null;
  try {
    slug = (await params).slug;
    blog = await getBlogBySlug(slug);
  } catch (err) {
    console.error("Error generating metadata for blog", err);
  }
  
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
  let slug = "";
  let blog = null;
  try {
    slug = (await params).slug;
    blog = await getBlogBySlug(slug);
  } catch (err) {
    console.error("Critical error loading blog detail page", err);
  }

  if (!blog) notFound();

  return <BlogDetailClient blog={blog} />;
}
