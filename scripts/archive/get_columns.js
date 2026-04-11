require('dotenv').config({path: '.env'});
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.rpc('invoke_rpc_query', { query: 'SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = ''orders'';' });
  console.log(data, error);
}
test();
