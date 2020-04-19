import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { SetupService } from 'src/app/shared/services/setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-lab-sample-types',
  templateUrl: './lab-sample-types.component.html',
  styles: []
})
export class LabSampleTypesComponent implements OnInit {

  sampleTypeForm = this.fb.group({
    name: [null, Validators.required],
    prefix: [null, Validators.required]
  });

  types = [];

  isLoading = true;
  isEditVisible: boolean;
  type: any;

  constructor(
    private fb: FormBuilder,
    private labService: LabSetupService,
    private notification: NzNotificationService,
    private setupService: SetupService
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  getTypes() {
    this.isLoading = true;
    this.labService.getSampleTypes().subscribe(types => {
      this.isLoading = false;
      this.types = types;
    });
  }

  deleteType(type: any) {
    this.isLoading = true;
    this.labService.deleteSampleType(type.id).subscribe(success => {
      this.showNotif(!success);
      if (success) {
        const index = this.types.findIndex(t => t.id === type.id);
        this.types.splice(index, 1);
      }
      this.isLoading = false;
    });
  }

  submit() {
    this.isLoading = true;
    const data = this.sampleTypeForm.value;
    let observable: Observable<boolean>;
    observable = !this.isEditVisible
      ? this.labService.createSampleType(data)
      : this.labService.editSampleType(this.type.id, data);
    observable.subscribe(success => {
      this.showNotif(!success);
      this.isLoading = success;
      if (success) {
        this.getTypes();
        this.closeModal();
      }
    });
  }

  showEditModal(type: any) {
    this.isEditVisible = true;
    this.type = type;
    const {id, isActivated, status,
       created_at, updated_at, ...sample} = type;
    this.sampleTypeForm.setValue(sample);
  }

  closeModal() {
    this.isEditVisible = false;
    this.sampleTypeForm.reset();
  }

  showNotif(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Proccessed Successfully');
  }

  toggleItem($event: any, item: any) {
    this.setupService.toggleActive(`labs/sampletypes/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = this.types.findIndex(l => l.id === toggled.id);
        this.types[index].isActivated = toggled.isActivated;
      }, error => {
        console.error(error);
        const index = this.types.findIndex(l => l.id === item.id);
        this.types[index].isActivated = !item.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
