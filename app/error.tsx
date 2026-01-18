// app/error.tsx
// Minimal global error component to satisfy Next.js app router and provide a friendly error UI.
'use client';
import React from 'react';

export default function GlobalError({ error }: { error?: any }) {
  const message = error?.message ?? String(error ?? 'Unknown error');
  return (
    <html id="__next_error__">
      <head />
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
          <div style={{ textAlign: 'center', maxWidth: 720, padding: 24 }}>
            <h1 style={{ marginBottom: 8 }}>Application error</h1>
            <p style={{ opacity: 0.85, marginBottom: 20 }}>{message}</p>
            <p>
              <a href="/" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                Go back home
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
