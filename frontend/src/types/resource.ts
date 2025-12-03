export enum ResourceType {
  PDF = "PDF",
  DOCUMENT = "DOCUMENT",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  LINK = "LINK"
}

export interface ResourceFile {
  id?: number;
  name: string;
  size: number;
  type: string;
  url?: string;
} 