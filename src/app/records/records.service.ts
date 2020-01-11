import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {CreateFolder, GetFolder, GetFoldersList} from './models/folders';

const recordsUrl = environment.apiBaseUrl + '/registry';

@Injectable()
export class RecordsService {

  constructor(private readonly http: HttpClient) {
  }

  getFolderList(): Observable<GetFoldersList> {
    return this.http.get<GetFoldersList>(`${recordsUrl}/folders`);
  }

  createFolder(newFolder: CreateFolder): Observable<GetFolder> {
    return this.http.post<GetFolder>(`${recordsUrl}/folders`, newFolder);
  }
}
