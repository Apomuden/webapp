import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SetupService } from 'src/app/shared/services/setup.service';
import { LabSetupService } from 'src/app/shared/services/lab-setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

const DAY = 'DAY';
const WEEK = 'WEEK';
const MONTH = 'MONTH';
const YEAR = 'YEAR';

@Component({
  selector: 'app-lab-parameters',
  templateUrl: './lab-parameters.component.html',
  styles: []
})
export class LabParametersComponent implements OnInit, AfterViewInit, OnDestroy {

  parameterForm = this.fb.group({
    name: [null, Validators.required],
    description: [null, Validators.required],
    value_type: ['Number', Validators.required],
    unit: [null],
  });
  flagForm = this.fb.group({
    lab_parameter_id: [null, Validators.required],
    lab_parameter_name: [{ value: 'null', disabled: true }, Validators.required],
    text_value: [null],
    min_comparator: ['>', Validators.required],
    max_comparator: ['<', Validators.required],
    min_value: [null, Validators.required],
    max_value: [null, Validators.required],
    max_age: [null, Validators.required],
    max_age_unit: ['YEAR', Validators.required],
    min_age: [null, Validators.required],
    min_age_unit: ['YEAR', Validators.required],
    flag: [null, Validators.required],
    gender: [null, Validators.required],
  });

  parameters = [];
  flags = [];
  ageUnits = [DAY, WEEK, MONTH, YEAR];

  isParametersLoading = true;
  isCreatingParam = false;
  isParamModalVisible = false;
  isFlagModalVisible = false;
  isEditingParam = false;
  isEditingFlag = false;
  isFlagsLoading = false;
  isCreatingFlag = false;

  editParam: any;
  editFlag: any;
  param: any;

  constructor(
    private fb: FormBuilder,
    private labService: LabSetupService,
    private setupService: SetupService,
    private notification: NzNotificationService,
  ) { }

  public get isText(): boolean {
    return this.param && this.param.value_type === 'Text';
  }

  ngOnInit() {
    this.getParams();
  }

  ngAfterViewInit() {
    this.flagForm.valueChanges.pipe(untilComponentDestroyed(this))
      .subscribe(value => {
        this.validateAge(value);
        if (!this.isText) {
          this.validateValue(value);
        }
      });
  }

  ngOnDestroy() { }

  private validateValue(value: any) {
    const minVal: number = value.min_value;
    const minComparator: string = value.min_comparator;
    const maxVal: number = value.max_value;
    const maxComparator: string = value.max_comparator;

    if (!minVal || !minComparator || !maxVal || !maxComparator) {
      return;
    }

    const errStatus = minVal > maxVal || (minVal === maxVal && maxComparator === '<') || null;
    if (!errStatus) {
      this.flagForm.get('min_value').setErrors(null);
      return;
    }
    this.flagForm.get('min_value').setErrors({ invalid: errStatus });
  }

  private validateAge(value: any) {
    const minAge: number = value.min_age;
    const maxAge: number = value.max_age;
    const maxAgeUnit: string = value.max_age_unit;
    const minAgeUnit: string = value.min_age_unit;
    if (maxAge && !maxAgeUnit) {
      this.flagForm.get('max_age_unit').setValidators(Validators.required);
    }
    if (!maxAge && maxAgeUnit) {
      this.flagForm.get('max_age').setValidators(Validators.required);
    }
    if (
      minAgeUnit === YEAR &&
      ((maxAgeUnit === DAY && maxAge < 365 * minAge) ||
        (maxAgeUnit === MONTH && maxAge < 12 * minAge) ||
        (maxAgeUnit === WEEK && maxAge < 52 * minAge))
    ) {
      this.flagForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === MONTH &&
      ((maxAgeUnit === DAY && maxAge < 31 * minAge) ||
        (maxAgeUnit === WEEK && maxAge < 4 * minAge))
    ) {
      this.flagForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === WEEK &&
      maxAgeUnit === DAY && maxAge < 31 * minAge
    ) {
      this.flagForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === DAY &&
      (maxAgeUnit === WEEK || maxAgeUnit === MONTH || maxAgeUnit === YEAR)
    ) {
      this.flagForm.get('max_age').setErrors(null);
    } else if (
      minAgeUnit === WEEK &&
      (maxAgeUnit === MONTH || maxAgeUnit === YEAR)
    ) {
      this.flagForm.get('max_age').setErrors(null);
    } else if (minAgeUnit === MONTH && maxAgeUnit === YEAR) {
      this.flagForm.get('max_age').setErrors(null);
    } else {
      if (minAge >= maxAge) {
        this.flagForm.get('max_age').setErrors({ invalid: true });
      } else {
        this.flagForm.get('max_age').setErrors(null);
      }
    }
  }

  getParams() {
    this.isParametersLoading = true;
    this.labService.getParameters()
      .subscribe(paramters => {
        this.parameters = paramters;
        this.isParametersLoading = false;
        if (this.parameters.length > 0) {
          this.getParamFlags(this.parameters[0]);
        }
      });
  }

  getParamFlags(param: any) {
    this.isFlagsLoading = true;
    this.param = param;
    this.flagForm.get('lab_parameter_id').setValue(param.id);
    this.flagForm.get('lab_parameter_name').setValue(param.name);
    this.flags = [];
    this.labService.getParamFlags(param.id).subscribe(flags => {
      this.isFlagsLoading = false;
      this.flags = flags;
    });
  }

  resetParam() {
    this.parameterForm.reset();
    this.parameterForm.get('value_type').setValue('Number');
    this.isParamModalVisible = false;
    this.editParam = null;
  }

  resetFlag() {
    this.flagForm.reset();
    this.flagForm.get('max_age_unit').setValue('YEAR');
    this.flagForm.get('min_age_unit').setValue('YEAR');
    this.flagForm.get('min_comparator').setValue('>');
    this.flagForm.get('max_comparator').setValue('<');
    this.isFlagModalVisible = false;
    this.editFlag = null;
  }

  submitParam() {
    this.isCreatingParam = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingParam
      ? this.labService.createParameter(this.processParamData())
      : this.labService.editLabParameter(this.editParam.id, this.processParamData());
    observable.subscribe(success => {
      this.isCreatingParam = false;
      this.showNotif(!success);
      if (success) {
        this.resetParam();
        this.getParams();
      }
    });
  }

  submitFlag() {
    this.isCreatingFlag = true;
    const observable = !this.isEditingFlag
      ? this.labService.createParamFlag(this.processFlagData())
      : this.labService.editParamFlag(this.editFlag.id, this.processFlagData());
    observable.subscribe(success => {
      this.isCreatingFlag = false;
      this.showNotif(!success);
      if (success) {
        this.closeFlagModal();
        this.getParamFlags(this.param);
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

  processParamData() {
    return this.parameterForm.value;
  }

  processFlagData() {
    return this.flagForm.value;
  }

  showParamterModal(parameter?: any) {
    if (parameter) {
      this.editParam = parameter;
      this.isEditingParam = true;
      const { created_at, updated_at,
        id, status, isActivated, ...param } = parameter;
      this.parameterForm.setValue(param);
    }
    this.isParamModalVisible = true;
  }

  closeParamterModal() {
    this.isEditingParam = false;
    this.editParam = null;
    this.resetParam();
    this.isParamModalVisible = false;
  }

  closeFlagModal() {
    this.isEditingFlag = false;
    this.editFlag = null;
    this.resetFlag();
    this.isFlagModalVisible = false;
  }

  showFlagModal(paramFlag?: any) {
    if (paramFlag) {
      this.editFlag = paramFlag;
      this.isEditingFlag = true;
      const { created_at, updated_at,
        id, status, isActivated, lab_parameter_description,
        ...flag } = paramFlag;
      this.flagForm.setValue(flag);
    }
    this.flagForm.get('lab_parameter_name').setValue(this.param.name);
    this.isFlagModalVisible = true;
    if (this.isText) {
      this.clearValidator(this.flagForm.get('min_comparator'));
      this.clearValidator(this.flagForm.get('max_comparator'));
      this.clearValidator(this.flagForm.get('min_value'));
      this.clearValidator(this.flagForm.get('max_value'));
      this.flagForm.get('text_value').setValidators(Validators.required);
      return;
    }
    this.flagForm.get('min_comparator').setValidators(Validators.required);
    this.flagForm.get('max_comparator').setValidators(Validators.required);
    this.flagForm.get('min_value').setValidators(Validators.required);
    this.flagForm.get('max_value').setValidators(Validators.required);
    this.clearValidator(this.flagForm.get('text_value'));
  }

  clearValidator(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  deleteParameter(param: any) {
    this.isParametersLoading = true;
    this.labService.deleteParameter(param.id).subscribe(success => {
      this.isParametersLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.parameters.findIndex(p => p.id === param.id);
        this.parameters.splice(index, 1);
        if (this.param === param) {
          this.param = null;
          this.flags = [];
        }
      }
    });
  }

  deleteFlag(flag: any) {
    this.isFlagsLoading = true;
    this.labService.deleteParamFlag(flag.id).subscribe(success => {
      this.isFlagsLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.flags.findIndex(f => f.id === flag.id);
        this.flags.splice(index, 1);
      }
    });
  }

  toggleItem($event: any, item: any, isFlag = false) {
    const path = isFlag ? 'parameters/ranges' : 'parameters';
    this.setupService.toggleActive(`labs/${path}/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = !isFlag
          ? this.parameters.findIndex(l => l.id === toggled.id)
          : this.flags.findIndex(l => l.id === toggled.id);
        if (!isFlag) {
          this.parameters[index].isActivated = toggled.isActivated;
        } else {
          this.flags[index].isActivated = toggled.isActivated;
        }
      }, error => {
        let index;
        if (!isFlag) {
          index = this.parameters.findIndex(l => l.id === item.id);
          this.parameters[index].isActivated = !item.isActivated;
        } else {
          index = this.flags.findIndex(l => l.id === item.id);
          this.flags[index].isActivated = !item.isActivated;
        }
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
