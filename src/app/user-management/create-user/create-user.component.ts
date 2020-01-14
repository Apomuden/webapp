import { BehaviorSubject, Subscription } from 'rxjs';
import { SetupService } from './../../shared/services/setup.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { first, retry } from 'rxjs/operators';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserManagementService } from '../user-management.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  stepIndex = 7;
  originCountryChangeSub: Subscription;

  userForm = this.fb.group({
    // 1 staff type
    staffInfo: this.fb.group({
      staffType: [null, [Validators.required]],
      specialty: [null],
      category: [null],
    }),
    // 2 bio data
    bioData: this.fb.group({
      title: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      middleName: [null],
      lastName: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      maritalStatus: [null, [Validators.required]],
      idNo: [null],
      idType: [null],
      profession: [null, [Validators.required]],
      educationalLevel: [null, [Validators.required]],
      residence: [null, [Validators.required]],
      religion: [null],
      originCountry: [null],
      originRegion: [null],
      homeTown: [null],
    }),
    // 3 profile data
    profileData: this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    }),
    // 4 contact information
    contactInfo: this.fb.group({
      countryCode: ['+233', [Validators.required]],
      altCode: ['+233'],
      altNumber: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      number: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: [null, [Validators.email]],
    }),
    // 5 emergency information
    emergency: this.fb.group({
      emergencyContactFullname: [null],
      relationship: [null],
      countryCode: ['+233'],
      countryCodeTwo: ['+233'],
      number: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      numberTwo: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      emailAddress: [null, [Validators.email]],
    }),
    // 6 role and department
    role: this.fb.group({
      role: [null, [Validators.required]],
      department: [null, [Validators.required]],
    }),
    // 7 other information
    other: this.fb.group({
      bankName: [null],
      bankBranch: [null],
      accountNumber: [null],
      profBody: [null],
      pin: [null],
      expiryDate: [null],
      appointmentDate: [null],
      salary: [0],
      snnitNumber: [null],
      tinNumber: [null],
      thirdPartyContribution: [null],
      taxOnSalary: [null],
      signatory: [null],
    }),
    // 8 attachments
    attachments: this.fb.group({
      signature: [null, [Validators.required]],
      photo: [null, [Validators.required]],
      doc1: [null],
      doc2: [null],
      doc3: [null],
      doc4: [null],
    }),
  });

  isLoading = false;

  attachedFiles: UploadFile[] = [];

  idTypesLoading = new BehaviorSubject(false);
  categoriesLoading = new BehaviorSubject(false);
  specialtiesLoading = new BehaviorSubject(false);
  regionsLoading = new BehaviorSubject(false);
  religionsLoading = new BehaviorSubject(false);
  relationshipsLoading = new BehaviorSubject(false);
  professionsLoading = new BehaviorSubject(false);
  countriesloading = new BehaviorSubject(false);
  departmentsloading = new BehaviorSubject(false);
  rolesloading = new BehaviorSubject(false);
  banksloading = new BehaviorSubject(false);
  staffTypesLoading = new BehaviorSubject(false);
  titlesLoading = new BehaviorSubject(false);
  educationalLevelsLoading = new BehaviorSubject(false);
  bankBranchesLoading = new BehaviorSubject(false);
  townsLoading = new BehaviorSubject(false);

  idTypes = [];
  categories = [];
  specialties = [];
  professions = [];
  religions = [];
  towns = [];
  regions = [];
  relationships = [];
  countries = [];
  departments = [];
  bankBranches = [];
  roles = [];
  banks = [];
  educationalLevels = [];
  staffTypes = [];
  titles = [];

  @ViewChild(SignaturePad, { static: false }) signaturePad: SignaturePad;

  signaturePadOptions = {
    'minWidth': 5,
    'canvasWidth': 600,
    'canvasHeight': 300,
    'backgroundColor': 'rgba(240,240,241,1)'
  };
  photo: string;

  get staffInfoForm(): FormGroup {
    return this.userForm.get('staffInfo') as FormGroup;
  }
  get profileDataForm(): FormGroup {
    return this.userForm.get('profileData') as FormGroup;
  }
  get bioDataForm(): FormGroup {
    return this.userForm.get('bioData') as FormGroup;
  }
  get contactInfoForm(): FormGroup {
    return this.userForm.get('contactInfo') as FormGroup;
  }
  get emergencyForm(): FormGroup {
    return this.userForm.get('emergency') as FormGroup;
  }
  get roleForm(): FormGroup {
    return this.userForm.get('role') as FormGroup;
  }
  get otherDetailsForm(): FormGroup {
    return this.userForm.get('other') as FormGroup;
  }
  get attachmentsForm(): FormGroup {
    return this.userForm.get('attachments') as FormGroup;
  }

  constructor(
    private setup: SetupService,
    private fb: FormBuilder,
    private userService: UserManagementService,
    private messageService: NzMessageService,
    private router: Router) { }

  ngOnInit() {
    this.fetchCountries();
    this.fetchStaffType();
    this.fetchStaffCategories();
    this.fetchSpecialties();

    this.originCountryChangeSub = this.bioDataForm.get('originCountry').valueChanges.subscribe(data => this.fetchRegions(data));
  }

  ngOnDestroy() {
    this.originCountryChangeSub.unsubscribe();
  }

  private fetchRegions(countryId: string) {
    if (!countryId) {
      this.regions = [];
      if (this.bioDataForm.get('originCountry').value) {
        this.bioDataForm.get('originCountry').reset();
      }
      return;
    }
    this.regionsLoading.next(true);
    this.setup
      .getRegionsByCountryId(countryId)
      .pipe(first())
      .subscribe(data => {
        this.regionsLoading.next(false);
        this.regions = data.data;
      }, error => {
        this.regionsLoading.next(false);
      });
  }

  private fetchBankBranches() {
    this.bankBranchesLoading.next(true);
    this.setup
      .getBankBranches()
      .pipe(first())
      .subscribe(data => {
        this.bankBranchesLoading.next(false);
        this.bankBranches = data.data;
      }, error => {
        this.bankBranchesLoading.next(false);
      });
  }

  private fetchDepartments() {
    this.departmentsloading.next(true);
    this.setup
      .getDepartments()
      .pipe(first())
      .subscribe(data => {
        this.departmentsloading.next(false);
        this.departments = data.data;
      }, error => {
        this.departmentsloading.next(false);
      });
  }

  private fetchBanks() {
    this.banksloading.next(true);
    this.setup
      .getBanks()
      .pipe(first())
      .subscribe(data => {
        this.banksloading.next(false);
        this.banks = data.data;
      }, error => {
        this.banksloading.next(false);
      });
  }

  private fetchTitles() {
    this.titlesLoading.next(true);
    this.setup
      .getTitles()
      .pipe(first())
      .subscribe(data => {
        this.titlesLoading.next(false);
        this.titles = data.data;
      }, err => {
        retry(3);
        this.titlesLoading.next(false);
      });
  }

  private fetchStaffType() {
    this.staffTypesLoading.next(true);
    this.setup
      .getStaffTypes()
      .pipe(first())
      .subscribe(data => {
        this.staffTypesLoading.next(false);
        this.staffTypes = data.data;
      }, err => {
        retry(3);
        this.staffTypesLoading.next(false);
      });
  }

  private fetchStaffCategories() {
    this.categoriesLoading.next(true);
    this.setup
      .getStaffCategories()
      .pipe(first())
      .subscribe(data => {
        this.categoriesLoading.next(false);
        this.categories = data.data;
      }, err => {
        retry(3);
        this.categoriesLoading.next(false);
      });
  }

  private fetchSpecialties() {
    this.specialtiesLoading.next(true);
    this.setup
      .getSpecialities()
      .pipe(first())
      .subscribe(data => {
        this.specialtiesLoading.next(false);
        this.specialties = data.data;
      }, err => {
        retry(3);
        this.specialtiesLoading.next(false);
      });
  }

  private fetchIdTypes() {
    this.specialtiesLoading.next(true);
    this.setup
      .getIdTypes()
      .pipe(first())
      .subscribe(data => {
        this.idTypesLoading.next(false);
        this.idTypes = data.data;
      }, err => {
        retry(3);
        this.idTypesLoading.next(false);
      });
  }

  private fetchRelationships() {
    this.relationshipsLoading.next(true);
    this.setup
      .getRelationships()
      .pipe(first())
      .subscribe(data => {
        this.relationshipsLoading.next(false);
        this.relationships = data.data;
      }, error => {
        this.relationshipsLoading.next(false);
      });
  }

  private fetchReligions() {
    this.religionsLoading.next(true);
    this.setup
      .getReligions()
      .pipe(first())
      .subscribe(data => {
        this.religionsLoading.next(false);
        this.religions = data.data;
      }, error => {
        this.religionsLoading.next(false);
      });
  }

  private fetchProfessions() {
    this.professionsLoading.next(true);
    this.setup
      .getProfessions()
      .pipe(first())
      .subscribe(data => {
        this.professionsLoading.next(false);
        this.professions = data.data;
      }, error => {
        this.professionsLoading.next(false);
      });
  }

  private fetchTowns() {
    this.townsLoading.next(true);
    this.setup
      .getTowns()
      .pipe(first())
      .subscribe(data => {
        this.townsLoading.next(false);
        this.towns = data.data;
      }, error => {
        this.townsLoading.next(false);
      });
  }

  private fetchEducationLevels() {
    this.educationalLevelsLoading.next(true);
    this.setup
      .getEducationalLevels()
      .pipe(first())
      .subscribe(data => {
        this.educationalLevelsLoading.next(false);
        this.educationalLevels = data.data;
      }, error => {
        this.educationalLevelsLoading.next(false);
      });
  }

  private fetchRoles() {
    this.rolesloading.next(true);
    this.setup
      .getRoles()
      .pipe(first())
      .subscribe(data => {
        this.rolesloading.next(false);
        this.roles = data.data;
      }, error => {
        this.rolesloading.next(false);
      });
  }

  private fetchCountries() {
    this.countriesloading.next(true);
    this.setup
      .getCountries()
      .pipe(first())
      .subscribe(data => {
        this.countriesloading.next(false);
        this.countries = data.data;
      }, error => {
        this.countriesloading.next(false);
      });
  }

  pre(): void {
    if (this.isLoading) {
      return;
    }
    this.changeContent('previous');
  }

  next(): void {
    this.changeContent('next');
  }

  private changeContent(mode: 'next' | 'previous'): void {
    const action = (valid: boolean) => mode === 'next' ? (valid) ? this.stepIndex++ : null : this.stepIndex--;
    switch (this.stepIndex) {
      case 0: {
        action(this.validateStaffType());
        this.fetchTitles();
        this.fetchEducationLevels();
        this.fetchReligions();
        this.fetchProfessions();
        this.fetchTowns();
        this.fetchIdTypes();
        break;
      }
      case 1: {
        action(this.validateBioData());
        break;
      }
      case 2: {
        action(this.validateprofileData());
        break;
      }
      case 3: {
        action(this.validateContactInfo());
        this.fetchRelationships();
        break;
      }
      case 4: {
        action(this.validateEmergency());
        this.fetchRoles();
        this.fetchDepartments();
        break;
      }
      case 5: {
        action(this.validateRole());
        this.fetchBanks();
        this.fetchBankBranches();
        break;
      }
      case 6: {
        action(this.validateOtherDetails());
        break;
      }
      case 7: {
        action(this.validateAttachments());
        break;
      }
      default: {
        break;
      }
    }
  }

  validateOtherDetails(): boolean {
    for (const i of Object.keys(this.otherDetailsForm.controls)) {
      this.otherDetailsForm.controls[i].markAsDirty();
      this.otherDetailsForm.controls[i].updateValueAndValidity();
    }
    return this.otherDetailsForm.valid;
  }

  validateRole(): boolean {
    for (const i of Object.keys(this.roleForm.controls)) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }
    return this.roleForm.valid;
  }

  validateEmergency(): boolean {
    for (const i of Object.keys(this.emergencyForm.controls)) {
      this.emergencyForm.controls[i].markAsDirty();
      this.emergencyForm.controls[i].updateValueAndValidity();
    }
    return this.emergencyForm.valid;
  }

  validateStaffType(): boolean {
    for (const i of Object.keys(this.staffInfoForm.controls)) {
      this.staffInfoForm.controls[i].markAsDirty();
      this.staffInfoForm.controls[i].updateValueAndValidity();
    }
    return this.staffInfoForm.valid;
  }

  validateAttachments(): boolean {
    for (const i of Object.keys(this.attachmentsForm.controls)) {
      this.attachmentsForm.controls[i].markAsDirty();
      this.attachmentsForm.controls[i].updateValueAndValidity();
    }
    return this.attachmentsForm.valid;
  }

  validateBioData(): boolean {
    for (const i of Object.keys(this.bioDataForm.controls)) {
      this.bioDataForm.controls[i].markAsDirty();
      this.bioDataForm.controls[i].updateValueAndValidity();
    }
    return this.bioDataForm.valid;
  }

  validateprofileData(): boolean {
    for (const i of Object.keys(this.profileDataForm.controls)) {
      this.profileDataForm.controls[i].markAsDirty();
      this.profileDataForm.controls[i].updateValueAndValidity();
    }
    return this.profileDataForm.valid;
  }

  validateContactInfo(): boolean {
    for (const i of Object.keys(this.contactInfoForm.controls)) {
      this.contactInfoForm.controls[i].markAsDirty();
      this.contactInfoForm.controls[i].updateValueAndValidity();
    }
    return this.contactInfoForm.valid;
  }

  drawComplete() {
    this.attachmentsForm.get('signature').patchValue(this.signaturePad.toDataURL());
  }

  clearSignature() {
    if (this.isLoading) {
      return;
    }
    this.signaturePad.clear();
    this.attachmentsForm.get('signature').reset();
  }

  beforeUploadPhoto = (uploadFile: UploadFile): boolean => {
    if (this.isLoading) {
      return false;
    }
    this.toBase64(uploadFile).then((file: string) => {
      this.photo = file;
      this.attachmentsForm.get('photo').patchValue(this.photo);
    });
    return false;
  }

  beforeUploadDocs = (uploadFile: UploadFile): boolean => {
    if (this.isLoading) {
      return false;
    }
    this.attachedFiles = this.attachedFiles.concat(uploadFile);
    return false;
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  clearPhoto() {
    if (this.isLoading) {
      return;
    }
    this.photo = null;
    this.attachmentsForm.get('photo').reset();
  }

  async done() {
    if (!this.validateAttachments() || this.isLoading) {
      return;
    }
    this.isLoading = true;
    // TODO: submit details to backend
    const formData = this.prepareToSubmit();
    console.log(formData);
    this.userService.createUser(formData)
      .pipe(first())
      .subscribe(response => {
        /* this.userService.createNextOfKin({
         name: this.emergencyForm.get('emergencyContactFullname'),
         phone: `${this.emergencyForm.get('countryCode').value.replace('+', '')}${this.emergencyForm.get('number').value}`,
         email: this.emergencyForm.get('emailAddress'),
         user_id: response.data.id,
         relation_id: this.emergencyForm.get('relationship')
       }); */
        this.uploadFiles(response);
      });
  }

  private uploadFiles(response: any) {
    this.attachedFiles.forEach(attachedFile => {
      this.toBase64(attachedFile).then((file: string) => {
        this.userService.addProfileDoc({
          name: attachedFile.name,
          user_id: response.data.id,
          file,
        }).pipe(first()).subscribe(res => {
          if (this.attachedFiles.indexOf(attachedFile) === this.attachedFiles.length - 1) {
            this.isLoading = false;
            this.router.navigate(['/user-management', 'profile', response.data.id]);
          }
        }, error => {
          // todo show error message
          this.messageService.error(`Unable to upload ${attachedFile.name}`);
          if (this.attachedFiles.indexOf(attachedFile) === this.attachedFiles.length - 1) {
            this.isLoading = false;
          }
        });
      });
    });
  }

  private prepareToSubmit() {
    let emerg_phone1: string;
    if (this.emergencyForm.get('number').value) {
      emerg_phone1 = `${this.emergencyForm.get('countryCode').value.replace('+', '')}${this.emergencyForm.get('number').value}`;
    }

    let emerg_phone2: string;
    if (this.emergencyForm.get('numberTwo').value) {
      emerg_phone2 = `${this.emergencyForm.get('countryCodeTwo').value.replace('+', '')}${this.emergencyForm.get('numberTwo').value}`;
    }

    let active_cell: string;
    if (this.contactInfoForm.get('number').value) {
      active_cell = `${this.contactInfoForm.get('countryCode').value.replace('+', '')}${this.contactInfoForm.get('number').value}`;
    }

    let alternate_cell: string;
    if (this.contactInfoForm.get('altNumber').value) {
      alternate_cell = `${this.contactInfoForm.get('altCode').value.replace('+', '')}${this.contactInfoForm.get('altNumber').value}`;
    }

    return {
      // staff type
      staff_type_id: this.staffInfoForm.get('staffType').value,
      staff_specialty_id: this.staffInfoForm.get('specialty').value,
      staff_category_id: this.staffInfoForm.get('category').value,
      // bio data
      firstname: this.bioDataForm.get('firstName').value,
      middlename: this.bioDataForm.get('middleName').value,
      surname: this.bioDataForm.get('lastName').value,
      email: this.contactInfoForm.get('email').value,
      dob: this.formatDate(this.bioDataForm.get('dateOfBirth').value as Date),
      gender: this.bioDataForm.get('gender').value,
      title_id: this.bioDataForm.get('title').value,
      religion_id: this.bioDataForm.get('religion').value,
      profession_id: this.bioDataForm.get('profession').value,
      educational_level_id: this.bioDataForm.get('educationalLevel').value,
      residence: this.bioDataForm.get('residence').value,
      origin_country_id: this.bioDataForm.get('originCountry').value,
      origin_region_id: this.bioDataForm.get('originRegion').value,
      marital: this.bioDataForm.get('maritalStatus').value,
      hometown_id: this.bioDataForm.get('homeTown').value,
      // contact info
      active_cell: active_cell ? parseInt(active_cell, 10) : null,
      alternate_cell: alternate_cell ? parseInt(alternate_cell, 10) : null,
      // profile
      username: this.profileDataForm.get('userName').value,
      password: this.profileDataForm.get('password').value,
      // role
      department_id: this.roleForm.get('department').value,
      role_id: this.roleForm.get('role').value,
      // emergency
      emerg_name: this.emergencyForm.get('emergencyContactFullname').value,
      emerg_relation_id: this.emergencyForm.get('relationship').value,
      emerg_phone1: emerg_phone1 ? parseInt(emerg_phone1, 10) : null,
      emerg_phone2: emerg_phone2 ? parseInt(emerg_phone2, 10) : null,
      // other info
      appointment_date: this.formatDate(this.otherDetailsForm.get('appointmentDate').value as Date),
      ssnit_no: this.otherDetailsForm.get('snnitNumber').value,
      tin: this.otherDetailsForm.get('tinNumber').value,
      basic: this.otherDetailsForm.get('salary').value,
      bank_id: this.otherDetailsForm.get('bankName').value,
      bank_branch_id: this.otherDetailsForm.get('bankBranch').value,
      bank_acct_no: this.otherDetailsForm.get('accountNumber').value,
      prof_body: this.otherDetailsForm.get('profBody').value,
      prof_reg_no: this.otherDetailsForm.get('pin').value,
      prof_expiry_date: this.otherDetailsForm.get('expiryDate').value,
      // attachments
      signature: this.attachmentsForm.get('signature').value,
      photo: this.attachmentsForm.get('photo').value,
    };
  }

  formatDate(date: Date): string {
    if (!date) {
      return null;
    }
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
