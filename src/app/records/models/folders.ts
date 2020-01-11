import {GetPayload} from '../../shared/models/payload';

export interface FolderDetails {
  id: number;
  folder_no: string;
  folder_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FoldersList extends GetPayload<FolderDetails[]> {
}

export interface Folder extends GetPayload <FolderDetails> {
}
