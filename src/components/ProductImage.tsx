import React, { useState, useEffect } from 'react';

export const getCategoryPlaceholder = (categorySlug?: string): string => {
  if (!categorySlug) return '/products/placeholders/default-placeholder.svg';
  const slug = categorySlug.toLowerCase().trim();
  if (slug.includes('canvas')) return '/products/placeholders/canvas-placeholder.svg';
  if (slug.includes('acrylic')) return '/products/placeholders/acrylic-placeholder.svg';
  if (slug.includes('poster')) return '/products/placeholders/poster-placeholder.svg';
  if (slug.includes('cork')) return '/products/placeholders/cork-placeholder.svg';
  if (slug.includes('yoga')) return '/products/placeholders/yoga-placeholder.svg';
  if (slug.includes('decor')) return '/products/placeholders/home-decor-placeholder.svg';
  if (slug.includes('custom')) return '/products/placeholders/custom-placeholder.svg';
  if (slug.includes('gift')) return '/products/placeholders/gift-placeholder.svg';
  if (slug.includes('bulk')) return '/products/placeholders/bulk-placeholder.svg';
  if (slug.includes('corporate')) return '/products/placeholders/corporate-placeholder.svg';
  return '/products/placeholders/default-placeholder.svg';
};

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  categorySlug?: string;
  fallbackSrc?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  categorySlug,
  fallbackSrc,
  className = '',
  ...props
}) => {
  const defaultPlaceholder = fallbackSrc || getCategoryPlaceholder(categorySlug);
  const [imgSrc, setImgSrc] = useState<string>(src || defaultPlaceholder);
  const [hasError, setHasError] = useState<boolean>(!src);

  // Sync if src prop changes
  useEffect(() => {
    if (!src) {
      setImgSrc(defaultPlaceholder);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, defaultPlaceholder]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultPlaceholder);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || 'Canvas India Product'}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};

export default ProductImage;
