'use client';
import LiquidEther from './LiquidEther';

export default function BackgroundEffects() {
  return (
    <LiquidEther
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
      mouseForce={20}
      cursorSize={200}
      colors={['#5227FF', '#FF9FFC', '#B19EEF']}
      isViscous={true}
      viscous={25}
      autoSpeed={0.2}
      autoIntensity={1.5}
    />
  );
}
