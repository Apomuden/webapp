import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GetFoldersList} from './models/folders';

const recordsUrl = environment.apiBaseUrl + '/registry';

@Injectable()
export class RecordsService {

  constructor(private readonly http: HttpClient) {
  }

  getFolderList(): Observable<GetFoldersList> {
    return this.http.get<GetFoldersList>(`${recordsUrl}/folders`);
  }

}
