
export enum VideoType {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo'
}

export interface IEmbeddableVideo {
  url: string;
  type: VideoType;
}
