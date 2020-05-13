import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SetupService } from 'src/app/shared/services/setup.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StoreSetupService } from 'src/app/shared/services/store-setup.service';

@Component({
  selector: 'app-medicine-routes',
  templateUrl: './medicine-routes.component.html',
  styles: []
})
export class MedicineRoutesComponent implements OnInit, AfterViewInit, OnDestroy {

  routeForm = this.fb.group({
    name: [null, Validators.required],
  });

  medicineRoutes = [];

  isRoutesLoading = true;
  isCreatingRoute = false;
  isRouteModalVisible = false;
  isEditingRoute = false;

  editRoute: any;

  constructor(
    private fb: FormBuilder,
    private storeSetupService: StoreSetupService,
    private setupService: SetupService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.getRoutes();
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  async getRoutes() {
    this.isRoutesLoading = true;
    this.medicineRoutes = await this.storeSetupService.getMedicineRoutes().toPromise();
    this.isRoutesLoading = false;
  }

  resetRoute() {
    this.routeForm.reset();
    this.isRouteModalVisible = false;
    this.editRoute = null;
    this.isEditingRoute = false;
  }

  async submitRoute() {
    this.isCreatingRoute = true;
    let observable: Observable<boolean>;
    observable = !this.isEditingRoute
      ? this.storeSetupService.createMedicineRoute(this.routeForm.value)
      : this.storeSetupService.editMedicineRoute(this.editRoute.id, this.routeForm.value);
    const success = await observable.toPromise();
    this.isCreatingRoute = false;
    this.showNotification(!success);
    if (success) {
      this.resetRoute();
      this.getRoutes();
    }
  }

  showNotification(isError = false) {
    if (isError) {
      this.notification.error('Error', 'Operation unsuccessful');
      return;
    }
    this.notification.success('Success', 'Processed Successfully');
  }

  showRouteModal(route: any) {
    this.editRoute = route;
    this.isEditingRoute = true;
    for (const i of Object.keys(this.routeForm.value)) {
      this.routeForm.controls[i].setValue(route[i]);
    }
    this.isRouteModalVisible = true;
  }

  closeRouteModal() {
    this.isEditingRoute = false;
    this.editRoute = null;
    this.resetRoute();
    this.isRouteModalVisible = false;
  }

  clearValidator(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  deleteRoute(route: any) {
    this.isRoutesLoading = true;
    this.storeSetupService.deleteMedicineRoute(route.id).subscribe(success => {
      this.isRoutesLoading = false;
      this.showNotification(!success);
      if (success) {
        const index = this.medicineRoutes.findIndex(p => p.id === route.id);
        this.medicineRoutes.splice(index, 1);
      }
    });
  }

  toggleItem($event: any, item: any) {
    this.setupService.toggleActive(`pharmacy/medicineroutes/${item.id}`, $event ? 'ACTIVE' : 'INACTIVE').pipe(first())
      .subscribe((toggled: any) => {
        const index = this.medicineRoutes.findIndex(l => l.id === toggled.id);
        this.medicineRoutes[index].isActivated = toggled.isActivated;
      }, error => {
        const index = this.medicineRoutes.findIndex(l => l.id === item.id);
        this.medicineRoutes[index].isActivated = !item.isActivated;
        this.notification.error('Toggle failed', 'Unable to toggle this item.');
      });
  }
}
