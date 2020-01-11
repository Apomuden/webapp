import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RecordsService} from '../records.service';
import {FoldersList} from '../models/folders';
import {BehaviorSubject, pipe} from 'rxjs';
import {catchError, single} from 'rxjs/operators';

@Component({
  selector: 'app-all-folders',
  templateUrl: './all-folders.component.html',
  styleUrls: ['./all-folders.component.css']
})
export class AllFoldersComponent implements OnInit {

  folders: FoldersList;
  loadingData = true;

  constructor(
    private readonly router: Router,
    private readonly recordService: RecordsService,
  ) {
  }

  routeToCreateFolder() {
    this.router.navigateByUrl('/records/folders/create');
  }

  ngOnInit() {
    this.recordService
      .getFolderList()
      .subscribe(value => {
        this.loadingData = false;
        this.folders = value;
      }, err => {
        this.loadingData = false;
      });
  }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }
}
