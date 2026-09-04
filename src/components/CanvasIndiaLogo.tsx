import React from 'react';

interface CanvasIndiaLogoProps {
  className?: string;
  variant?: 'dark-mode' | 'light-mode' | 'original';
  height?: number | string;
  width?: number | string;
}

/**
 * Canvas India Official Brand Logo Component
 * Exactly preserves all proportions, colors, calligraphy, paintbrush details,
 * easel Tricolor brushstrokes, and tagline ("Canvas | Acrylic | Corks").
 */
export const CanvasIndiaLogo: React.FC<CanvasIndiaLogoProps> = ({
  className = 'h-10 w-auto',
  variant = 'original',
}) => {
  // If variant is 'dark-mode', navy strokes turn into crisp silver-white (#F8FAFC)
  // while retaining the orange, tricolor, and green flourishes.
  const primaryNavy = variant === 'dark-mode' ? '#F8FAFC' : '#0F243E';
  const ferruleBorder = variant === 'dark-mode' ? '#94A3B8' : '#475569';
  const dividerMuted = variant === 'dark-mode' ? '#94A3B8' : '#64748B';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 880 400"
        className="w-full h-full object-contain overflow-visible"
        aria-label="Canvas India - Canvas | Acrylic | Corks"
      >
        <defs>
          <linearGradient id="ciSaffronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7700" />
            <stop offset="100%" stopColor="#E85D04" />
          </linearGradient>
          <linearGradient id="ciGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="ciBrushPaintGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E85D04" />
            <stop offset="60%" stopColor="#FF7700" />
            <stop offset="100%" stopColor="#FFAA00" />
          </linearGradient>
          <linearGradient id="ciFerruleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <clipPath id="ciCanvasClip">
            <polygon points="174,128 274,136 264,273 164,265" />
          </clipPath>
        </defs>

        {/* Crescent Artistic Brush 'C' */}
        <g fill={primaryNavy} stroke="none">
          <path d="M 330 95 C 290 55, 230 40, 165 52 C 90 68, 38 135, 36 215 C 34 285, 78 350, 150 365 C 215 378, 280 355, 335 305 C 322 315, 290 335, 255 342 C 190 355, 125 330, 85 278 C 50 230, 52 165, 92 115 C 130 68, 195 56, 255 68 C 285 75, 312 85, 330 95 Z" />
          <path d="M 345 105 C 310 70, 250 55, 195 58 C 170 60, 145 68, 125 78 C 138 72, 165 65, 195 65 C 245 65, 298 80, 335 110 C 340 108, 345 105, 345 105 Z" opacity="0.8" />
          <path d="M 320 318 C 275 352, 215 365, 160 355 C 130 350, 105 338, 88 322 C 105 334, 132 344, 162 348 C 212 355, 268 342, 310 312 Z" opacity="0.75" />
          <path d="M 310 82 C 285 68, 255 60, 220 58 C 245 62, 275 70, 300 82 Z" opacity="0.6" />
          <path d="M 350 290 C 330 312, 305 328, 275 338 C 295 328, 320 312, 340 292 Z" opacity="0.6" />
        </g>

        {/* Easel Tripod Frame */}
        <g stroke={primaryNavy} strokeLinecap="round" strokeLinejoin="round">
          <line x1="216" y1="92" x2="223" y2="128" strokeWidth="9" />
          <line x1="184" y1="285" x2="162" y2="340" strokeWidth="7" />
          <line x1="223" y1="285" x2="223" y2="340" strokeWidth="7" />
          <line x1="262" y1="285" x2="284" y2="340" strokeWidth="7" />
          <line x1="172" y1="285" x2="285" y2="285" strokeWidth="8" />
          <line x1="178" y1="315" x2="272" y2="315" strokeWidth="5" />
        </g>

        {/* Canvas on Easel with Indian Flag Strokes */}
        <g id="easel-canvas-layer">
          <polygon points="172,126 276,134 266,275 162,267" fill="#FFFFFF" stroke={primaryNavy} strokeWidth="6" />
          <g clipPath="url(#ciCanvasClip)">
            {/* Saffron Top Diagonal */}
            <path d="M 160 120 L 280 130 L 280 205 C 255 198, 225 180, 200 200 C 185 210, 175 195, 160 185 Z" fill="url(#ciSaffronGrad)" />
            <path d="M 160 185 Q 190 205 210 188 Q 235 212 280 202 L 280 195 Q 240 185 220 178 Q 185 190 160 175 Z" fill="#E85D04" opacity="0.65" />
            
            {/* Green Bottom Diagonal */}
            <path d="M 160 215 C 185 225, 215 210, 240 235 C 255 245, 270 240, 280 248 L 280 280 L 160 280 Z" fill="url(#ciGreenGrad)" />
            <path d="M 160 215 Q 195 235 220 218 Q 250 242 278 238 L 278 245 Q 245 235 220 226 Q 185 230 160 220 Z" fill="#15803D" opacity="0.75" />
          </g>
        </g>

        {/* Calligraphic 'anvas' in Primary Shade */}
        <g fill={primaryNavy} stroke="none">
          {/* 'a' */}
          <path d="M 335 242 C 342 220, 360 205, 382 205 C 405 205, 418 220, 418 245 C 418 275, 396 295, 368 295 C 345 295, 332 280, 335 258 C 338 240, 355 226, 375 226 C 392 226, 400 236, 400 248 C 400 268, 385 278, 368 278 C 354 278, 345 270, 345 258 C 345 250, 350 242, 358 242 C 362 242, 365 245, 365 248 C 365 252, 360 258, 355 258 C 350 258, 348 262, 348 266 C 352 272, 360 274, 370 274 C 385 274, 398 262, 398 244 C 398 232, 390 222, 376 222 C 360 222, 346 235, 342 250 C 338 265, 346 278, 358 285 C 372 292, 392 290, 404 280 L 412 292 C 402 300, 385 304, 368 304 C 340 304, 324 284, 324 256 C 324 235, 334 218, 348 208 C 364 196, 385 194, 404 200 C 418 205, 428 216, 432 232 L 434 210 L 452 210 L 440 292 C 438 302, 442 306, 448 306 C 454 306, 460 300, 466 290 L 472 298 C 462 312, 450 318, 438 318 C 424 318, 416 308, 418 290 L 424 246 C 420 236, 412 228, 402 225 Z" />
          {/* 'n' */}
          <path d="M 458 238 C 468 222, 482 212, 498 212 C 518 212, 526 226, 526 248 L 520 295 L 500 295 L 506 250 C 508 234, 502 226, 492 226 C 480 226, 470 238, 466 254 L 460 295 L 440 295 L 452 212 L 472 212 L 468 238 Z" />
          {/* 'v' */}
          <path d="M 532 235 C 540 220, 552 212, 565 212 C 576 212, 584 218, 584 230 C 584 238, 578 248, 572 258 L 550 295 L 532 295 L 522 232 L 540 232 L 546 274 L 565 244 C 568 238, 570 232, 570 228 C 570 224, 566 222, 560 222 C 552 222, 545 228, 540 238 Z" />
          {/* 'a' */}
          <path d="M 585 245 C 592 224, 610 210, 630 210 C 650 210, 664 224, 664 248 C 664 276, 642 295, 618 295 C 598 295, 585 280, 585 260 C 585 240, 602 226, 622 226 C 636 226, 646 235, 646 248 C 646 266, 632 278, 618 278 C 606 278, 598 270, 598 258 C 598 248, 606 242, 614 242 C 618 242, 622 245, 622 248 C 622 252, 618 258, 612 258 C 608 258, 606 262, 606 266 C 608 272, 615 274, 622 274 C 635 274, 646 262, 646 244 C 646 232, 638 222, 626 222 C 612 222, 600 235, 596 250 C 592 265, 600 278, 612 285 C 624 292, 642 290, 652 280 L 658 292 C 648 300, 634 304, 618 304 C 592 304, 576 284, 576 256 C 576 235, 586 218, 600 208 C 614 196, 634 194, 650 200 C 664 205, 674 216, 678 232 L 680 210 L 698 210 L 686 292 C 684 302, 688 306, 694 306 C 700 306, 706 300, 712 290 L 718 298 C 708 312, 696 318, 684 318 C 670 318, 662 308, 664 290 L 670 246 C 666 236, 658 228, 648 225 Z" />
          {/* 's' */}
          <path d="M 708 248 C 716 230, 730 220, 746 220 C 760 220, 770 228, 770 242 C 770 256, 755 268, 740 278 C 722 290, 712 302, 712 320 C 712 342, 728 360, 754 360 C 768 360, 782 352, 792 340 L 798 352 C 785 368, 765 376, 746 376 C 715 376, 694 352, 694 322 C 694 298, 708 282, 725 270 C 742 258, 752 248, 752 238 C 752 230, 745 226, 738 226 C 728 226, 720 234, 714 246 Z" />
        </g>

        {/* Green flourish loop under 's' */}
        <path d="M 726 316 C 718 335, 725 358, 744 366 C 764 374, 786 364, 796 344 C 798 338, 804 316, 792 312 C 782 308, 774 324, 768 336 C 758 354, 744 356, 736 348 C 730 342, 730 328, 734 320 Z" fill="url(#ciGreenGrad)" />

        {/* Paintbrush with Orange Drip and Ferrule */}
        <g id="artist-brush-head">
          <path d="M 750 190 C 770 188, 790 192, 805 170 C 818 152, 825 125, 830 102 C 824 115, 815 130, 800 140 C 782 152, 765 158, 745 160 C 725 162, 732 178, 750 190 Z" fill="url(#ciBrushPaintGrad)" />
          <path d="M 816 138 C 828 116, 840 92, 844 76 C 840 85, 832 102, 822 118 C 812 134, 800 148, 785 156 C 798 152, 810 145, 816 138 Z" fill="#E85D04" />
          <path d="M 844 76 C 848 85, 842 108, 835 125 C 828 140, 818 155, 804 165 C 818 152, 832 135, 838 118 C 844 102, 846 88, 844 76 Z" fill="#FF9E00" />
          <path d="M 842 78 C 852 90, 840 115, 828 135 C 816 150, 802 162, 788 168 C 778 172, 768 174, 755 174 C 768 170, 780 164, 792 155 C 810 140, 826 118, 834 98 C 838 88, 840 82, 842 78 Z" fill="#FF6B00" />

          {/* Metal ferrule and brush stick */}
          <g transform="rotate(38, 845, 75)">
            <rect x="836" y="52" width="18" height="18" rx="2" fill="url(#ciFerruleGrad)" stroke={ferruleBorder} strokeWidth="1.5" />
            <line x1="836" y1="58" x2="854" y2="58" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="836" y1="64" x2="854" y2="64" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="841,52 849,52 855,-10 843,-10" fill={primaryNavy} />
            <line x1="845" y1="52" x2="846" y2="-10" stroke="#475569" strokeWidth="2" />
          </g>
        </g>

        {/* Divider: Orange Bar - INDIA - Green Bar */}
        <g id="ci-india-baseline">
          <line x1="285" y1="332" x2="375" y2="332" stroke="#E85D04" strokeWidth="4.5" strokeLinecap="round" />
          <text
            x="500"
            y="342"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontWeight="700"
            fontSize="34"
            letterSpacing="14"
            fill={primaryNavy}
          >
            INDIA
          </text>
          <line x1="625" y1="332" x2="715" y2="332" stroke="#15803D" strokeWidth="4.5" strokeLinecap="round" />
        </g>

        {/* Tagline: Canvas | Acrylic | Corks */}
        <g id="ci-tagline" fontFamily="'Cinzel', 'Times New Roman', 'Georgia', serif" fontSize="25" fontWeight="600">
          <text x="260" y="380" fill={primaryNavy} letterSpacing="4">Canvas</text>
          <text x="375" y="380" fill={dividerMuted} fontWeight="300">|</text>
          <text x="415" y="380" fill="#E85D04" letterSpacing="4">Acrylic</text>
          <text x="560" y="380" fill={dividerMuted} fontWeight="300">|</text>
          <text x="600" y="380" fill="#15803D" letterSpacing="4">Corks</text>
        </g>
      </svg>
    </div>
  );
};
