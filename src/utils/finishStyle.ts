export interface FinishStyle {
  wall: string;
  border: number;
  color: string;
  shadow: string;
  outline: string;
  overlay: string;
}

// Visual swatch for a finish/style name: frame colour, edge treatment and surface sheen.
// Shared by the product page's Finish selector swatches and the live WallPreview,
// so picking a Finish changes the frame border everywhere it's shown.
export const getFinishStyle = (name: string): FinishStyle => {
  const n = name.toLowerCase();
  const base: FinishStyle = { wall: '#ECE7DF', border: 0, color: 'transparent', shadow: '0 6px 10px -4px rgba(0,0,0,0.45), 3px 3px 0 #d6d0c4', outline: 'none', overlay: '' };
  if (n.includes('black')) return { ...base, border: 5, color: '#161616', shadow: '0 6px 10px -4px rgba(0,0,0,0.5)' };
  if (n.includes('white')) return { ...base, wall: '#E3E8EE', border: 5, color: '#FAFAFA', shadow: '0 6px 10px -4px rgba(0,0,0,0.35)' };
  if (n.includes('gold')) return { ...base, border: 5, color: '#C9A227', shadow: '0 6px 10px -4px rgba(0,0,0,0.45)' };
  if (n.includes('teak') || n.includes('oak') || n.includes('wood')) return { ...base, border: 6, color: n.includes('oak') ? '#C99A62' : '#8B5A2B', shadow: '0 6px 10px -4px rgba(0,0,0,0.45)' };
  if (n.includes('anodized') || n.includes('metal')) return { ...base, border: 3, color: '#9AA3AD', shadow: '0 6px 10px -4px rgba(0,0,0,0.4)' };
  if (n.includes('mirror')) return { ...base, shadow: '0 6px 10px -4px rgba(0,0,0,0.45), 3px 3px 0 #b9c6d6', overlay: 'linear-gradient(120deg, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 60%)' };
  if (n.includes('bevel')) return { ...base, border: 3, color: 'rgba(255,255,255,0.85)', overlay: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 50%)' };
  if (n.includes('anti-glare') || n.includes('frost') || n.includes('matte') || n.includes('satin')) return { ...base, overlay: 'rgba(255,255,255,0.18)' };
  if (n.includes('gloss') || n.includes('diamond') || n.includes('pearl') || n.includes('lustre')) return { ...base, overlay: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.15) 100%)' };
  return base; // gallery wrap / classic wrap / standard: image wraps the edge
};
