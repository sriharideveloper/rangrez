"use server";

import { createClient } from "../../lib/supabase/server";

/**
 * Fetch all blogs ordered by publication date.
 */
export async function getAllBlogs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
  return data;
}

/**
 * Fetch a single blog post by its unique slug.
 */
export async function getBlogBySlug(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching blog ${slug}:`, error);
    return null;
  }
  return data;
}

/**
 * Upsert a blog post (Create or Update).
 */
export async function upsertBlog(blogData) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .upsert(blogData, { onConflict: "slug" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting blog:", error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Bulk insert blog posts.
 */
export async function bulkInsertBlogs(blogs) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .insert(blogs)
    .select();

  if (error) {
    console.error("Error bulk inserting blogs:", error);
    throw new Error(error.message);
  }
  return data;
}

/**
 * Delete a blog post.
 */
export async function deleteBlog(id) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting blog:", error);
    throw new Error(error.message);
  }
  return true;
}
