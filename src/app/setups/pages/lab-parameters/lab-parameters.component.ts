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
  rangeForm = this.fb.group({
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
  ranges = [];
  ageUnits = [DAY, WEEK, MONTH, YEAR];

  isParametersLoading = true;
  isCreatingParam = false;
  isParamModalVisible = false;
  isRangeModalVisible = false;
  isEditingParam = false;
  isEditingRange = false;
  isRangesLoading = false;
  isCreatingRange = false;

  editParam: any;
  editRange: any;
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
    this.rangeForm.valueChanges.pipe(untilComponentDestroyed(this))
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
      this.rangeForm.get('min_value').setErrors(null);
      return;
    }
    this.rangeForm.get('min_value').setErrors({ invalid: errStatus });
  }

  private validateAge(value: any) {
    const minAge: number = value.min_age;
    const maxAge: number = value.max_age;
    const maxAgeUnit: string = value.max_age_unit;
    const minAgeUnit: string = value.min_age_unit;
    if (maxAge && !maxAgeUnit) {
      this.rangeForm.get('max_age_unit').setValidators(Validators.required);
    }
    if (!maxAge && maxAgeUnit) {
      this.rangeForm.get('max_age').setValidators(Validators.required);
    }
    if (
      minAgeUnit === YEAR &&
      ((maxAgeUnit === DAY && maxAge < 365 * minAge) ||
        (maxAgeUnit === MONTH && maxAge < 12 * minAge) ||
        (maxAgeUnit === WEEK && maxAge < 52 * minAge))
    ) {
      this.rangeForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === MONTH &&
      ((maxAgeUnit === DAY && maxAge < 31 * minAge) ||
        (maxAgeUnit === WEEK && maxAge < 4 * minAge))
    ) {
      this.rangeForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === WEEK &&
      maxAgeUnit === DAY && maxAge < 31 * minAge
    ) {
      this.rangeForm.get('max_age').setErrors({ invalid: true });
    } else if (
      minAgeUnit === DAY &&
      (maxAgeUnit === WEEK || maxAgeUnit === MONTH || maxAgeUnit === YEAR)
    ) {
      this.rangeForm.get('max_age').setErrors(null);
    } else if (
      minAgeUnit === WEEK &&
      (maxAgeUnit === MONTH || maxAgeUnit === YEAR)
    ) {
      this.rangeForm.get('max_age').setErrors(null);
    } else if (minAgeUnit === MONTH && maxAgeUnit === YEAR) {
      this.rangeForm.get('max_age').setErrors(null);
    } else {
      if (minAge >= maxAge) {
        this.rangeForm.get('max_age').setErrors({ invalid: true });
      } else {
        this.rangeForm.get('max_age').setErrors(null);
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
          this.getParamRanges(this.parameters[0]);
        }
      });
  }

  getParamRanges(param: any) {
    this.isRangesLoading = true;
    this.param = param;
    this.rangeForm.get('lab_parameter_id').setValue(param.id);
    this.rangeForm.get('lab_parameter_name').setValue(param.name);
    this.ranges = [];
    this.labService.getParamRanges(param.id).subscribe(ranges => {
      this.isRangesLoading = false;
      this.ranges = ranges;
    });
  }

  resetParam() {
    this.parameterForm.reset();
    this.parameterForm.get('value_type').setValue('Number');
    this.isParamModalVisible = false;
    this.editParam = null;
  }

  resetRange() {
    this.rangeForm.reset();
    this.rangeForm.get('max_age_unit').setValue('YEAR');
    this.rangeForm.get('min_age_unit').setValue('YEAR');
    this.rangeForm.get('min_comparator').setValue('>');
    this.rangeForm.get('max_comparator').setValue('<');
    this.isRangeModalVisible = false;
    this.editRange = null;
  }

  submitParam() {
    this.isCreatingParam = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingParam
      ? this.labService.createLabParameter(this.processParamData())
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

  submitRange() {
    this.isCreatingRange = true;
    const observable = !this.isEditingRange
      ? this.labService.createParamRange(this.processRangeData())
      : this.labService.editParamRange(this.editRange.id, this.processRangeData());
    observable.subscribe(success => {
      this.isCreatingRange = false;
      this.showNotif(!success);
      if (success) {
        this.closeRangeModal();
        this.getParamRanges(this.param);
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

  processRangeData() {
    return this.rangeForm.value;
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

  closeRangeModal() {
    this.isEditingRange = false;
    this.editRange = null;
    this.resetRange();
    this.isRangeModalVisible = false;
  }

  showRangeModal(paramRange?: any) {
    if (paramRange) {
      this.editRange = paramRange;
      this.isEditingRange = true;
      const { created_at, updated_at,
        id, status, isActivated, lab_parameter_description,
        ...range } = paramRange;
      this.rangeForm.setValue(range);
    }
    this.isRangeModalVisible = true;
    if (this.isText) {
      this.clearValidator(this.rangeForm.get('min_comparator'));
      this.clearValidator(this.rangeForm.get('max_comparator'));
      this.clearValidator(this.rangeForm.get('min_value'));
      this.clearValidator(this.rangeForm.get('max_value'));
      this.rangeForm.get('text_value').setValidators(Validators.required);
      return;
    }
    this.rangeForm.get('min_comparator').setValidators(Validators.required);
    this.rangeForm.get('max_comparator').setValidators(Validators.required);
    this.rangeForm.get('min_value').setValidators(Validators.required);
    this.rangeForm.get('max_value').setValidators(Validators.required);
    this.clearValidator(this.rangeForm.get('text_value'));
  }

  clearValidator(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  deleteParameter(param: any) {
    this.isParametersLoading = true;
    this.labService.deleteLabParameter(param.id).subscribe(success => {
      this.isParametersLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.parameters.findIndex(p => p.id === param.id);
        this.parameters.splice(index, 1);
        if (this.param === param) {
          this.param = null;
          this.ranges = [];
        }
      }
    });
  }

  deleteRange(range: any) {
    this.isRangesLoading = true;
    this.labService.deleteParamRange(range.id).subscribe(success => {
      this.isRangesLoading = false;
      this.showNotif(!success);
      if (success) {
        const index = this.ranges.findIndex(r => r.id === range.id);
        this.ranges.splice(index, 1);
      }
    });
  }

  toggleItem($event: any, item: any, isRange = false) {
    const path = isRange ? 'parameters/ranges' : 'parameters';
    this.setupService.toggleActive(`labs/${path}/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = !isRange
          ? this.parameters.findIndex(l => l.id === toggled.id)
          : this.ranges.findIndex(l => l.id === toggled.id);
        if (!isRange) {
          this.parameters[index].isActivated = toggled.isActivated;
        } else {
          this.ranges[index].isActivated = toggled.isActivated;
        }
      }, error => {
        let index;
        if (!isRange) {
          index = this.parameters.findIndex(l => l.id === item.id);
          this.parameters[index].isActivated = !item.isActivated;
        } else {
          index = this.ranges.findIndex(l => l.id === item.id);
          this.ranges[index].isActivated = !item.isActivated;
        }
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
