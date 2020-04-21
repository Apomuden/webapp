import { Component, OnInit } from '@angular/core';
import { SetupService } from 'src/app/shared/services/setup.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-parameter-service-map',
  templateUrl: './parameter-service-map.component.html',
  styles: []
})
export class ParameterServiceMapComponent implements OnInit {
  isLoading = true;
  labs = [];
  params = [];
  labParams = [];
  newParamForm = this.fb.group({
    id: [null, Validators.required], // the parameter id
    order: [null, Validators.required] // the position of the parameter in the parameter list
  });

  isModalShowing: boolean;
  isEditModalShowing: boolean;

  lab: any;
  editParam: any;

  constructor(
    private fb: FormBuilder,
    private setupService: SetupService,
    private labService: LabSetupService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.getLabs();
    this.getParameters();
  }

  getLabs() {
    this.labService.getLabs().subscribe(labs => {
      this.isLoading = false;
      this.labs = labs;
      if (this.labs.length > 0) {
        this.lab = this.labs[0];
        this.getLabParams(this.lab.id);
      }
    });
  }

  getLabParams(labId: number) {
    this.isLoading = true;
    this.labService.getLabParams(labId).subscribe(params => {
      this.isLoading = false;
      this.labParams = params;
    });
  }

  getParameters() {
    this.labService.getParameters().subscribe(params => {
      this.isLoading = false;
      this.params = params;
    });
  }

  selectLab(lab: any) {
    this.lab = lab;
    this.labParams = [];
    this.getLabParams(lab.id);
  }

  showEditModal(param: any) {
    this.editParam = param;
    this.isEditModalShowing = true;
    this.newParamForm.get('id').setValue(param.id);
    this.newParamForm.get('order').setValue(param.order);
    this.newParamForm.get('order').setValidators(Validators.max(this.labParams.length + 1));
    this.newParamForm.get('order').setValidators(Validators.min(1));
  }

  closeEditModal() {
    this.isEditModalShowing = false;
    this.newParamForm.reset();
  }

  showParamModal() {
    this.isModalShowing = true;
    this.newParamForm.get('order').setValue(this.labParams.length + 1);
    this.newParamForm.get('order').setValidators(Validators.max(this.labParams.length + 1));
    this.newParamForm.get('order').setValidators(Validators.min(1));
  }

  closeModal() {
    this.isModalShowing = false;
    this.newParamForm.reset();
  }

  addLabParam() {
    let param: any;
    if (!this.editParam) {
      param = this.newParamForm.value;
      const selectParam = this.getSelectedParam(param.id);
      param.description = selectParam.description;
      param.value_type = selectParam.value_type;
      param.unit = selectParam.unit;
      this.closeModal();
    } else {
      this.editParam.order = this.newParamForm.value.order;
      param = this.editParam;
      const index = this.labParams.findIndex(lp => lp.id === param.id);
      this.labParams.splice(index, 1);
      this.closeEditModal();
    }
    this.newParamForm.reset();
    if (this.labParams.length === 0) {
      this.labParams = [param];
    } else {
      this.labParams.splice(param.order - 1, 0, param);
      this.labParams.forEach((p, index) => {
        p.order = index + 1;
      });
    }
    this.saveChanges();
  }

  removeParamter(param: any) {
    this.isLoading = true;
    this.labService.deleteLabParam(this.lab.id, [param]).subscribe(success => {
      this.showNotif(!success);
      this.isLoading = success;
      if (success) {
        this.getLabParams(this.lab.id);
      }
    });
  }

  private getSelectedParam(value: number) {
    return this.params.find(p => p.id === value);
  }

  saveChanges() {
    this.isLoading = true;
    this.labService.createLabParam(this.lab.id, this.labParams).subscribe(success => {
      this.isLoading = false;
      this.showNotif(!success);
      if (success) {
        this.getLabParams(this.lab.id);
      }
    });
  }

  showNotif(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Proccessed Successfully');
  }
}
