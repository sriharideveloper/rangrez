const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.rpc('place_order', {
    p_user_id: '87a4b42d-09e1-475a-b3f3-982e0f7351c5',
    p_email: 'test@example.com',
    p_phone: '+919999999999',
    p_name: 'Test Name',
    p_shipping: { city: 'Test City', state: 'Kerala' },
    p_subtotal: 100,
    p_discount: 0,
    p_coupon: null,
    p_shipping_fee: 0,
    p_total: 100,
    p_items: [
      {
        product_id: '5c45fa1a-9cf3-4585-abc7-1026136327d6',
        title: 'Test Product',
        quantity: 1,
        price: 100
      }
    ]
  });
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
