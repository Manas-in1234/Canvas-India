import { useState, type ComponentPropsWithoutRef } from 'react';
import { HERO_IMAGE_SLOTS, type HeroImageSlot } from '../../backend/src/catalog/hero-image-slots';
import { buildApiUrl } from '../api/productsApi';

type Props = Omit<ComponentPropsWithoutRef<'img'>, 'src'> & {
  slot: HeroImageSlot;
  mobile?: boolean;
};

export function StorefrontHeroImage({ slot, mobile, onError, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  const fallback = mobile && slot === 'home'
    ? HERO_IMAGE_SLOTS.home.fallback.replace('w=2200', 'w=1200')
    : HERO_IMAGE_SLOTS[slot].fallback;
  return (
    <img {...props}
      src={failed ? fallback : buildApiUrl(`/hero-images/${slot}${mobile ? '?mobile=1' : ''}`)}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
