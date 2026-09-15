export const IMAGE_PROCESSING_QUEUE = 'image-processing';
export const ARTWORK_GENERATION_QUEUE = 'artwork-generation';

export interface ImageProcessingJobData {
  assetId: string;
}

export interface ArtworkGenerationJobData {
  artworkId: string;
}
