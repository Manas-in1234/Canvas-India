export function bannerTextColor(color?: string | null) {
  if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return '#FFFFFF';

  const channels = [1, 3, 5].map(offset => {
    const value = Number.parseInt(color.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  // Choose the higher of the black-on-color and white-on-color contrast ratios.
  return luminance > Math.sqrt(1.05 * 0.05) - 0.05 ? '#000000' : '#FFFFFF';
}
