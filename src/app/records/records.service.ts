import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {FoldersList} from './models/folders';

const recordsUrl = environment.apiBaseUrl + '/registry';

@Injectable()
export class RecordsService {

  constructor(private readonly http: HttpClient) {
  }

  getFolderList(): Observable<FoldersList> {
    return this.http.get<FoldersList>(`${recordsUrl}/folders`);
  }

}
