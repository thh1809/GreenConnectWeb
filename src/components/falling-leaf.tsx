'use client';

import { Leaf } from 'lucide-react';
import { useState } from 'react';
import type { LeafConfig } from '@/lib/api/leaf.types';

const FallingLeaves = () => {
  const [leaves] = useState<LeafConfig[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 4}s`,
      rotation: `rotate(${Math.random() * 360}deg)`,
      size: 20 + Math.random() * 20,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="absolute animate-leaf-fall"
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
          }}
        >
          <Leaf
            className="text-accent opacity-30"
            size={leaf.size}
            style={{
              transform: leaf.rotation,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default FallingLeaves;
