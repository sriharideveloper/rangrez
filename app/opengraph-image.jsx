import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Rangrez Henna - Malabar Magic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: 'system-ui, sans-serif',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#111',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #4a1510 0%, #111 75%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 50, left: 50, display: 'flex', alignItems: 'center', gap: 20 }}>
           <div style={{ width: 80, height: 80, background: '#A44A3F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900 }}>R</div>
           <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 8 }}>RANGREZ</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 130, fontWeight: 900, lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 30, padding: '0 60px', color: '#fff', alignItems: 'center' }}>
          <div>DIY HENNA.</div>
          <div>ZERO REGRETS.</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 44, fontWeight: 600, opacity: 0.9, marginBottom: 50, color: '#ffb347', lineHeight: 1.3, alignItems: 'center' }}>
          <div>Stop paying the "bride tax".</div>
          <div>Get breathtaking Malabar Magic in 5 mins.</div>
        </div>

        <div style={{ display: 'flex', background: '#A44A3F', padding: '24px 60px', borderRadius: 100, fontSize: 36, fontWeight: 800, boxShadow: '0 20px 40px rgba(164,74,63,0.4)' }}>
          PEEL. PASTE. SLAY.
        </div>
        
        <div style={{ position: 'absolute', bottom: 40, right: 50, opacity: 0.5, fontSize: 24, fontWeight: 600, letterSpacing: 2 }}>
          Kochi Origin • Modern Precision
        </div>
      </div>
    ),
    { ...size }
  );
}