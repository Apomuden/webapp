import { NzNotificationService } from 'ng-zorro-antd';
import { SystemComponentsService } from './../system-components/system-components.service';
import { ModulesService } from './../modules/modules.service';
import { PermissionsService } from './../permissions/permissions.service';
import { first, retry } from 'rxjs/operators';
import { RolesService } from './roles.service';
import { Component, OnInit, Pipe } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles = [];
  initLoading = true;
  isVisible = false;
  isConfirmLoading = false;
  modalTitle = '';
  action = '';
  selectedRole = '';
  selectedRoleName = '';
  postData = null;
  modalData = [];
  modalLoadingData = new BehaviorSubject(false);


  constructor(private rolesService: RolesService,
    private permissionsService: PermissionsService,
    private modulesService: ModulesService,
    private systemComponentsService: SystemComponentsService,
    private notificationService: NzNotificationService
  ) { }

  ngOnInit() {
    this.rolesService
      .getRoles()
      .pipe(first())
      .subscribe(
        roles => {
          this.initLoading = false;
          this.roles = roles;
          console.log(this.roles);
        },
        error => {
          this.initLoading = false;
          retry(3);
          console.log(error);
        }
      );

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    this.submitModalData();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.modalTitle = '';
    this.action = '';
    this.selectedRole = '';
    this.selectedRoleName = '';
    this.postData = null;
    this.modalData = [];
    this.isConfirmLoading = false;
  }
  showModalForAction(role: any, action: string, title: string) {
    this.action = action;
    this.selectedRole = role.id;
    this.selectedRoleName = role.name;
    this.modalTitle = `${title} for ${this.selectedRoleName}`;
    this.isVisible = true;
    switch (action) {
      case 'ATTACH_MODULES':
        this.getModules();
        break;
      case 'DETACH_MODULES':
        this.getModules();
        break;
      case 'ATTACH_PERMISSIONS':
        this.getPermissions();
        break;
      case 'DETACH_PERMISSIONS':
        this.getPermissions();
        break;
      case 'ATTACH_COMPONENTS':
        this.getComponents();
        break;
      case 'DETACH_COMPONENTS':
        this.getComponents();
        break;
    }
  }

  submitModalData() {
    if (this.action !== '') {
      switch (this.action) {
        case 'ATTACH_MODULES':
          this.rolesService
            .attachModulesToRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully attached modules');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to attach modules');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to attach modules');
              }
            );
          break;
        case 'DETACH_MODULES':
          this.rolesService
            .detachModulesFromRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully detached modules');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to detach modules');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to detach modules');
              }
            );
          break;
        case 'ATTACH_PERMISSIONS':
          this.rolesService
            .attachPermissionsToRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully attached permissions');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to attach permissions');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to attach permissions');
              }
            );
          break;
        case 'DETACH_PERMISSIONS':
          this.rolesService
            .detachPermissionsFromRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully detached permissions');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to detach permissions');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to detach permissions');
              }
            );
          break;
        case 'ATTACH_COMPONENTS':
          this.rolesService
            .attachSystemComponentsToRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully attached components');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to attach components');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to attach components');
              }
            );
          break;
        case 'DETACH_COMPONENTS':
          this.rolesService
            .detachSystemComponentsFromRole(parseInt(this.selectedRole, 10), this.postData)
            .pipe(first()).subscribe(
              success => {
                this.isConfirmLoading = false;
                console.log(success);
                if (success) {
                  this.notificationService.blank('success', 'successfully detached components');
                } else {
                  console.log('there was an error');
                  this.notificationService.error('failure', 'unable to detach components');
                }
              }, err => {
                this.isConfirmLoading = false;
                console.log('there was an error');
                this.notificationService.error('failure', 'unable to detach components');
              }
            );
          break;
      }
    }
  }

  updatePostData(value: string[]): void {
    this.postData = value;
    console.log(value);
  }

  getPermissions() {
    this.modalLoadingData.next(true);
    this.permissionsService.getPermissions().pipe(first()).subscribe(
      permissions => {
        this.modalLoadingData.next(false);
        this.modalData = permissions;
      },
      error => {
        this.modalLoadingData.next(false);
        console.log(error);
      }
    );
  }
  getModules() {
    this.modalLoadingData.next(true);
    this.modulesService.getModules().pipe(first()).subscribe(
      modules => {
        this.modalLoadingData.next(false);
        this.modalData = modules;
      },
      error => {
        this.modalLoadingData.next(false);
        console.log(error);
      }
    );
  }
  getComponents() {
    this.modalLoadingData.next(true);
    this.systemComponentsService.getSystemComponents().pipe(first()).subscribe(
      components => {
        this.modalLoadingData.next(false);
        this.modalData = components;
      },
      error => {
        this.modalLoadingData.next(false);
        console.log(error);
      }
    );
  }
}
