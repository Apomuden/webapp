import {GetPayload} from '../../shared/models/payload';

export interface FolderDetails {
  id: number;
  folder_no: string;
  folder_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetFoldersList extends GetPayload<FolderDetails[]> {
}

export interface GetFolder extends GetPayload <FolderDetails> {
}

export interface CreateFolder {
  rack_no: number;
  folder_type: string;
}
