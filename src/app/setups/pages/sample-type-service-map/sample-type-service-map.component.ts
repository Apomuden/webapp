import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { SetupService } from 'src/app/shared/services/setup.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sample-type-service-map',
  templateUrl: './sample-type-service-map.component.html',
  styles: []
})
export class SampleTypeServiceMapComponent implements OnInit {
  isLoading = true;
  labs = [];
  sampleTypes = [];
  labSamples = [];
  typeForm = this.fb.group({
    id: [null, Validators.required], // the sample type id
    order: [null, Validators.required] // the position of the sample type in the sample type list
  });

  isModalShowing: boolean;
  isEditModalShowing: boolean;

  lab: any;
  editType: any;

  constructor(
    private fb: FormBuilder,
    private setupService: SetupService,
    private labService: LabSetupService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.getLabs();
    this.getSampleTypes();
  }

  getLabs() {
    this.labService.getLabs().subscribe(labs => {
      this.isLoading = false;
      this.labs = labs;
      if (this.labs.length > 0) {
        this.lab = this.labs[0];
        this.getLabSampleTypes(this.lab.id);
      }
    });
  }

  getLabSampleTypes(labId: number) {
    this.isLoading = true;
    this.labService.getLabSampleTypes(labId).subscribe(sampleTypes => {
      this.isLoading = false;
      this.labSamples = sampleTypes;
    });
  }

  getSampleTypes() {
    this.labService.getSampleTypes().subscribe(sampleTypes => {
      this.isLoading = false;
      this.sampleTypes = sampleTypes;
    });
  }

  selectLab(lab: any) {
    this.lab = lab;
    this.labSamples = [];
    this.getLabSampleTypes(lab.id);
  }

  showEditModal(sampleType: any) {
    this.editType = sampleType;
    this.isEditModalShowing = true;
    this.typeForm.get('id').setValue(sampleType.id);
    this.typeForm.get('order').setValue(sampleType.order);
    this.typeForm.get('order').setValidators([Validators.max(this.labSamples.length), Validators.min(1)]);
  }

  closeEditModal() {
    this.isEditModalShowing = false;
    this.typeForm.reset();
  }

  showModal() {
    this.isModalShowing = true;
    this.typeForm.get('order').setValue(this.labSamples.length + 1);
    this.typeForm.get('order').setValidators([Validators.max(this.labSamples.length + 1), Validators.min(1)]);
  }

  closeModal() {
    this.isModalShowing = false;
    this.typeForm.reset();
  }

  addLabSampleType() {
    let sampleType: any;
    if (!this.editType) {
      sampleType = this.typeForm.value;
      const selectSampleTypes = this.getSelectedSampleType(sampleType.id);
      sampleType.name = selectSampleTypes.description;
      this.closeModal();
    } else {
      this.editType.order = this.typeForm.value.order;
      sampleType = this.editType;
      const index = this.labSamples.findIndex(lp => lp.id === sampleType.id);
      this.labSamples.splice(index, 1);
      this.closeEditModal();
    }
    this.typeForm.reset();
    if (this.labSamples.length === 0) {
      this.labSamples = [sampleType];
    } else {
      this.labSamples.splice(sampleType.order - 1, 0, sampleType);
      this.labSamples.forEach((p, index) => {
        p.order = index + 1;
      });
    }
    this.saveChanges();
  }

  removeSampleType(sampleType: any) {
    this.isLoading = true;
    this.labService.deleteLabSampleType(this.lab.id, [sampleType]).subscribe(success => {
      this.showNotification(!success);
      this.isLoading = success;
      if (success) {
        this.getLabSampleTypes(this.lab.id);
      }
    });
  }

  private getSelectedSampleType(value: number) {
    return this.sampleTypes.find(p => p.id === value);
  }

  saveChanges() {
    this.isLoading = true;
    this.labService.createLabSampleType(this.lab.id, this.labSamples).subscribe(success => {
      this.isLoading = false;
      this.showNotification(!success);
      if (success) {
        this.getLabSampleTypes(this.lab.id);
      }
    });
  }

  showNotification(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Processed Successfully');
  }
}
