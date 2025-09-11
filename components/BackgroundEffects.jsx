'use client';
import LiquidEther from './LiquidEther';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
      <LiquidEther
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen',
          opacity: 1,
        }}
        mouseForce={20}
        cursorSize={200}
        colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        isViscous={true}
        viscous={25}
        autoSpeed={0.2}
        autoIntensity={1.5}
        resolution={0.5}
        dt={0.014}
      />
    </div>
  );
}
