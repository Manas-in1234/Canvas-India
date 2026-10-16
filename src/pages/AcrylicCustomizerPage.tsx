import React from 'react';
import { CanvasCustomizerPage } from './CanvasCustomizerPage';

/**
 * Unified Acrylic Customizer Page.
 * Delegates directly to the unified CanvasCustomizerPage with materialProp="acrylic"
 * to ensure 100% feature and behavioral parity between Canvas and Acrylic products.
 */
export const AcrylicCustomizerPage: React.FC = () => {
  return <CanvasCustomizerPage materialProp="acrylic" />;
};

export default AcrylicCustomizerPage;
