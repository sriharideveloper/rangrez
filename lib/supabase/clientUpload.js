import { createClient } from "./client";

// We use the anon key here. RLS policies on the product-images bucket
// must be set to allow INSERT by users with role='admin' in the profiles table.
// Another option is to upload via an API route which uses the Service Role key,
// but for simplicity, we'll assume the token has admin privileges via RLS.

export async function uploadImageToStorage(file) {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `public/${fileName}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl;
}
