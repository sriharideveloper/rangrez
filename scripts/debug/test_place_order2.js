require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.rpc('place_order', {
    p_user_id: '87a4b42d-09e1-475a-b3f3-982e0f7351c5',
    p_email: 'razil.6b@gmail.com',
    p_phone: '+918129014358',
    p_name: 'Fousia',
    p_shipping: { city: 'Ernakulam' },
    p_subtotal: 1,
    p_discount: 1,
    p_coupon: null,
    p_shipping_fee: 0,
    p_total: 1,
    p_items: [
      {
        price: 1,
        quantity: 1,
        product_id: '5c45fa1a-9cf3-4585-abc7-1026136327d6'
      }
    ]
  });
  console.log('Result:', data);
  if (error) console.error('Error:', error);
}

test();
