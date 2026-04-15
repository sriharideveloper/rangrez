import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(req) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json({}, { status: 200 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, stock")
      .in("id", ids);
    if (error) {
      return NextResponse.json({}, { status: 200 });
    }
    const stocks = {};
    for (const p of data) {
      stocks[p.id] = p.stock;
    }
    return NextResponse.json(stocks, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 200 });
  }
}
