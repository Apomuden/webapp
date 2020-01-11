import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RecordsService} from '../records.service';
import {GetFoldersList} from '../models/folders';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';

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
    private readonly message: NzMessageService,
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

  get rackNoControl(): FormControl {
    return this.createFolderForm.get('rackNo') as FormControl;
  }

  get folderTypeControl(): FormControl {
    return this.createFolderForm.get('folderType') as FormControl;
  }

  parseDate(dateString: string) {
    return Date.parse(dateString);
  }

  handleCancel() {
    this.isCreateFolderVisible = false;
  }

  handleSubmit() {
    this.createFolderLoading = true;
    this.recordService.createFolder({
      rack_no: parseInt(this.rackNoControl.value, 10),
      folder_type: this.folderTypeControl.value
    })
      .subscribe(value => {
        // console.log(value);
        this.createFolderLoading = false;
        this.isCreateFolderVisible = false;
        this.router.navigate(['/records/folders/view/', value.data.id]);
      }, error => {
        this.createFolderLoading = false;
        this.message.create('error',
          'Sorry, there was an error creating folder. Please try again', {
            nzDuration: 5000, // 5 seconds
          });
      });
  }

  showCreateFolderModal() {
    this.isCreateFolderVisible = true;
  }
}
