import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CreateFolder, GetFolder, GetFoldersList} from './models/folders';

const recordsUrl = environment.apiBaseUrl + '/registry';
const foldersUrl = `${recordsUrl}/folders`;

@Injectable()
export class RecordsService {

  constructor(private readonly http: HttpClient) {
  }

  getFolderList(): Observable<GetFoldersList> {
    return this.http.get<GetFoldersList>(foldersUrl);
  }

  createFolder(newFolder: CreateFolder): Observable<GetFolder> {
    return this.http.post<GetFolder>(foldersUrl, newFolder);
  }

  getFolder(folderId: number): Observable<GetFolder> {
    return this.http.get<GetFolder>(`${foldersUrl}/${folderId}`);
  }
}
