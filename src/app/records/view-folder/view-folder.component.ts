import {Component, OnInit} from '@angular/core';
import {RecordsService} from '../records.service';
import {GetFolder} from '../models/folders';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-view-folder',
  templateUrl: './view-folder.component.html',
  styleUrls: ['./view-folder.component.scss']
})
export class ViewFolderComponent implements OnInit {

  folderId: number;
  folderDetails$: Observable<GetFolder>;

  folderPatients: string[] = [
    'James',
    'Anim'
  ];

  constructor(
    private readonly recordsService: RecordsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    ) {
  }

  ngOnInit() {
    this.folderDetails$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.folderId = +params.get('id');
        return this.recordsService.getFolder(this.folderId);
      })
    );
  }

  gotoRegisterPatient() {
    this.router.navigate(['./add-patient'], { relativeTo: this.route});
  }
}
