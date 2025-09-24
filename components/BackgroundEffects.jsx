'use client';
import LiquidEther from './LiquidEther';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <LiquidEther
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          mixBlendMode: 'screen',
          opacity: 1,
        }}
        mouseForce={30}
        cursorSize={150}
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        isViscous={true}
        viscous={20}
        autoSpeed={0.2}
        autoIntensity={1.5}
        resolution={0.5}
        dt={0.016}
      />
    </div>
  );
}
