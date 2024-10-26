import { IBaseInstance, IRowInstance } from "onchain-sdk";

interface FileInfo {
  fileUrl: string;
  fileId: string;
  fileName: string;
  uploadURL?: string;
}

export interface FileSelf extends IBaseInstance, FileInfo {
  attachments: Attachment[];
}

export interface Attachment extends IRowInstance, FileInfo {
  isTransform: boolean;
}