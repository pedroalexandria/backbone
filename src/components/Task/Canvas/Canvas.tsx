import React from 'react';
import { CanvasHeader } from './CanvasHeader';
import { CanvasContainer } from './CanvasContainer';

export function Canvas() {
  return (
    <section className="canvas-root">
      <CanvasHeader />
      <CanvasContainer />
    </section>
  );
}
