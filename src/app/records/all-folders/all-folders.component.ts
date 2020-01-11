import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RecordsService} from '../records.service';
import {GetFoldersList} from '../models/folders';
import {BehaviorSubject, pipe} from 'rxjs';
import {catchError, single} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-all-folders',
  templateUrl: './all-folders.component.html',
  styleUrls: ['./all-folders.component.css']
})
export class AllFoldersComponent implements OnInit {

  folders: GetFoldersList;
  loadingData = true;


  createFolderForm: FormGroup;
  isCreateFolderVisible = false;
  createFolderLoading = false;
  folderTypeOptions: string[] = ['INDIVIDUAL', 'FAMILY'];

  constructor(
    private readonly router: Router,
    private readonly recordService: RecordsService,
    private readonly fb: FormBuilder,
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

    this.createFolderForm = this.fb.group({
      rackNo: ['1', Validators.required],
      folderType: [this.folderTypeOptions[0], Validators.required]
    });
  }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }

  handleCancel() {
    this.isCreateFolderVisible = false;
  }

  handleSubmit() {
    this.createFolderLoading = true;
    // this.isCreateFolderVisible = false;
  }

  showCreateFolderModal() {
    this.isCreateFolderVisible = true;
  }
}
