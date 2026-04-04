import { NextResponse } from "next/server";

// Simple in-memory rate limiter using a Map
// In production, use Redis or a proper KV store
const rateLimitMap = new Map();

export function rateLimit(request, limit = 20, windowMs = 60000) {
  const ip = request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1";
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: Date.now() + windowMs,
    });
    return null; // Passed
  }

  const clientInfo = rateLimitMap.get(ip);
  if (Date.now() > clientInfo.resetTime) {
    // Reset window
    clientInfo.count = 1;
    clientInfo.resetTime = Date.now() + windowMs;
    return null; // Passed
  }

  if (clientInfo.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429, 
        headers: { "Retry-After": Math.ceil((clientInfo.resetTime - Date.now()) / 1000).toString() } 
      }
    );
  }

  clientInfo.count += 1;
  return null; // Passed
}
