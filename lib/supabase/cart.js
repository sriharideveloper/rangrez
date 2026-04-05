import { createClient } from "./client";

export async function fetchUserCart(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching cart:", error.message || error);
    return [];
  }

  // Format into the store structure
  return data.map((item) => ({
    id: item.product_id,
    name: item.products.name,
    price: item.products.price,
    image: item.products.image || item.products.images?.[0],
    quantity: item.quantity,
    size: item.size,
    db_id: item.id, // keep the DB primary key for updates
  }));
}

export async function addToCloudCart(userId, item) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      {
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity,
        size: item.size,
      },
      { onConflict: "user_id, product_id, size" },
    )
    .select()
    .single();

  if (error) console.error("Error adding to cloud cart:", error);
  return data;
}

export async function updateCloudQuantity(itemId, quantity) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) console.error("Error updating cloud cart:", error);
}

export async function removeFromCloudCart(itemId) {
  const supabase = createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) console.error("Error removing from cloud cart:", error);
}

export async function clearCloudCart(userId) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) console.error("Error clearing cloud cart:", error);
}

export async function syncLocalToCloud(userId, localItems) {
  const supabase = createClient();
  if (!localItems.length) return fetchUserCart(userId);

  const itemsToSync = localItems.map((item) => ({
    user_id: userId,
    product_id: item.id,
    quantity: item.quantity,
    size: item.size,
  }));

  const { error } = await supabase
    .from("cart_items")
    .upsert(itemsToSync, { onConflict: "user_id, product_id, size" });

  if (error) console.error("Error syncing local to cloud:", error);

  return fetchUserCart(userId);
}
