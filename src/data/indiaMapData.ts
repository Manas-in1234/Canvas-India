// Normalized SVG path of India boundary (approximate high-fidelity outline for creative coloring & annotation)
export const INDIA_MAP_PATH = 
  "M 330 85 " + // Kashmir North
  "C 345 75, 360 80, 375 95 " + // Ladakh / Karakoram
  "C 390 110, 410 135, 400 155 " + // Aksai Chin / Himachal border
  "C 380 170, 365 185, 380 205 " + // Uttarakhand
  "C 395 210, 440 215, 480 215 " + // Nepal boundary
  "C 490 205, 500 195, 510 205 " + // Sikkim
  "C 525 210, 560 205, 575 210 " + // Bhutan border
  "C 595 190, 620 180, 640 195 " + // Arunachal Pradesh
  "C 650 215, 630 245, 625 260 " + // Nagaland & Manipur
  "C 610 280, 595 300, 580 305 " + // Mizoram & Tripura
  "C 560 285, 555 265, 535 265 " + // Meghalaya
  "C 520 270, 505 285, 510 320 " + // West Bengal / Sunderbans
  "C 490 350, 470 380, 455 420 " + // Odisha coast
  "C 440 460, 420 510, 400 560 " + // Andhra Pradesh coast
  "C 380 610, 360 660, 340 705 " + // Tamil Nadu coast
  "C 335 720, 330 735, 325 745 " + // Kanyakumari (Southernmost tip)
  "C 315 725, 310 680, 305 630 " + // Kerala coast
  "C 300 580, 290 530, 280 480 " + // Karnataka / Goa
  "C 270 440, 255 400, 250 360 " + // Maharashtra coast (Mumbai)
  "C 235 345, 200 345, 180 330 " + // Gulf of Khambhat / Saurashtra
  "C 155 330, 140 310, 160 290 " + // Kutch peninsula
  "C 180 275, 205 280, 215 260 " + // Gujarat-Rajasthan
  "C 225 240, 240 210, 255 190 " + // Rajasthan desert border
  "C 270 170, 285 150, 300 130 " + // Punjab border
  "C 310 115, 320 95, 330 85 Z"; // Close back to Kashmir

export interface IndianRegion {
  name: string;
  artStyle: string;
  x: number;
  y: number;
  color: string;
}

export const FAMOUS_ART_REGIONS: IndianRegion[] = [
  { name: 'Kashmir', artStyle: 'Pashmina & Paper Mâché', x: 340, y: 130, color: '#0284C7' },
  { name: 'Punjab', artStyle: 'Phulkari Embroidery', x: 295, y: 180, color: '#EAB308' },
  { name: 'Rajasthan', artStyle: 'Miniature Painting & Pichwai', x: 235, y: 270, color: '#EA580C' },
  { name: 'Gujarat', artStyle: 'Pithora & Rogan Art', x: 190, y: 340, color: '#F59E0B' },
  { name: 'Maharashtra', artStyle: 'Warli Tribal Painting', x: 265, y: 440, color: '#78350F' },
  { name: 'Madhya Pradesh', artStyle: 'Gond Folk Art', x: 360, y: 360, color: '#16A34A' },
  { name: 'Bihar', artStyle: 'Madhubani / Mithila Art', x: 490, y: 290, color: '#DC2626' },
  { name: 'Bengal & Odisha', artStyle: 'Kalighat & Pattachitra', x: 500, y: 380, color: '#9333EA' },
  { name: 'Karnataka & Goa', artStyle: 'Chittara & Kasuti', x: 300, y: 560, color: '#2563EB' },
  { name: 'Tamil Nadu', artStyle: 'Tanjore Gold Art & Kolam', x: 340, y: 660, color: '#D97706' },
  { name: 'Kerala', artStyle: 'Temple Mural Paintings', x: 315, y: 700, color: '#059669' },
  { name: 'Assam & NE', artStyle: 'Muga Silk & Cane Craft', x: 600, y: 240, color: '#0D9488' },
];
