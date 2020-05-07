import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupsRoutingModule } from './setups-routing.module';
import { SetupsComponent } from './setups.component';
import { DepartmentSetupComponent } from './pages/department-setup/department-setup.component';
import { SponsershipTypeSetupComponent } from './pages/sponsership-type-setup/sponsership-type-setup.component';
import { HospitalServiceSetupComponent } from './pages/hospital-service-setup/hospital-service-setup.component';
import { ServiceCategorySetupComponent } from './pages/service-category-setup/service-category-setup.component';
import { StaffTypeSetupComponent } from './pages/staff-type-setup/staff-type-setup.component';
import { ProfessionSetupComponent } from './pages/profession-setup/profession-setup.component';
import { StaffCategorySetupComponent } from './pages/staff-category-setup/staff-category-setup.component';
import { ServiceSubcategorySetupComponent } from './pages/service-subcategory-setup/service-subcategory-setup.component';
import { LanguageSetupComponent } from './pages/language-setup/language-setup.component';
import { BankSetupComponent } from './pages/bank-setup/bank-setup.component';
import { BankBranchesSetupComponent } from './pages/bank-branches-setup/bank-branches-setup.component';
import { IdTypeSetupComponent } from './pages/id-type-setup/id-type-setup.component';
import { EducationLevelSetupComponent } from './pages/education-level-setup/education-level-setup.component';
import { AgeGroupSetupComponent } from './pages/age-group-setup/age-group-setup.component';
import { TitleSetupComponent } from './pages/title-setup/title-setup.component';
import { RelationshipSetupComponent } from './pages/relationship-setup/relationship-setup.component';
import { TownSetupComponent } from './pages/town-setup/town-setup.component';
import { ReligionSetupComponent } from './pages/religion-setup/religion-setup.component';
import { DistrictSetupComponent } from './pages/district-setup/district-setup.component';
import { RegionSetupComponent } from './pages/region-setup/region-setup.component';
import { FacilitySetupComponent } from './pages/facility-setup/facility-setup.component';
import { AccreditationSetupComponent } from './pages/accreditation-setup/accreditation-setup.component';
import { CountrySetupComponent } from './pages/country-setup/country-setup.component';
import { CompanySetupComponent } from './pages/company-setup/company-setup.component';
import { SpecialitySetupComponent } from './pages/speciality-setup/speciality-setup.component';
import { FormsModule } from '@angular/forms';
import { MedicalSponsorSetupComponent } from './pages/medical-sponsor-setup/medical-sponsor-setup.component';
import { RecordComponent } from './categories/record/record.component';
import { AccountComponent } from './categories/account/account.component';
import { InpatientComponent } from './categories/inpatient/inpatient.component';
import { LaboratorySetupComponent } from './categories/laboratory-setup/laboratory-setup.component';
import { EisuComponent } from './categories/eisu/eisu.component';
import { OtherComponent } from './categories/other/other.component';
import { ClinicComponent } from './pages/clinic/clinic.component';
import { ServicePricingSetupComponent } from './pages/service-pricing-setup/service-pricing-setup.component';
import { SponsorPolicySetupComponent } from './pages/sponsor-policy-setup/sponsor-policy-setup.component';
import { ClinicTypeSetupComponent } from './pages/clinic-type-setup/clinic-type-setup.component';
import { ClinicServiceSetupComponent } from './pages/clinic-service-setup/clinic-service-setup.component';
import { AgeCategorySetupComponent } from './pages/age-category-setup/age-category-setup.component';
import { AgeClassificationSetupComponent } from './pages/age-classification-setup/age-classification-setup.component';
import { MedicalHistoryCategoryComponent } from './pages/medical-history-category/medical-history-category.component';
import { AllergyHistoryCategoryComponent } from './pages/allergy-history-category/allergy-history-category.component';
import { FamilyHistoryCategoryComponent } from './pages/family-history-category/family-history-category.component';
import { MedicineHistoryCategoryComponent } from './pages/medicine-history-category/medicine-history-category.component';
import { SocialHistoryCategoryComponent } from './pages/social-history-category/social-history-category.component';
import { SurgicalHistoryCategoryComponent } from './pages/surgical-history-category/surgical-history-category.component';
import { IllnessTypeComponent } from './pages/illness-type/illness-type.component';
import { DischargeReasonComponent } from './pages/discharge-reason/discharge-reason.component';
import { ComplainTypeComponent } from './pages/complain-type/complain-type.component';
import { ComplaintComponent } from './pages/complaint/complaint.component';
import { ClinicsComponent } from './categories/clinics/clinics.component';
import { PhysicalExaminationCategoryComponent } from './pages/physical-examination-category/physical-examination-category.component';
import { MohghsgroupingsComponent } from './pages/mohghsgroupings/mohghsgroupings.component';
import { Icd10groupingsComponent } from './pages/icd10groupings/icd10groupings.component';
import { Icd10categoriesComponent } from './pages/icd10categories/icd10categories.component';
import { DiseasesComponent } from './pages/diseases/diseases.component';
import { LabParametersComponent } from './pages/lab-parameters/lab-parameters.component';
import { LabSampleTypesComponent } from './pages/lab-sample-types/lab-sample-types.component';
import { ParameterServiceMapComponent } from './pages/parameter-service-map/parameter-service-map.component';
import { SampleTypeServiceMapComponent } from './pages/sample-type-service-map/sample-type-service-map.component';
import { MedicineRoutesComponent } from './pages/medicine-routes/medicine-routes.component';
import { ProductFormAndUnitComponent } from './pages/product-form-and-unit/product-form-and-unit.component';
import { ProductTypeAndCategoryComponent } from './pages/product-type-and-category/product-type-and-category.component';
import { ProductsComponent } from './pages/products/products.component';
import { StoreSetupComponent } from './categories/store-setup/store-setup.component';

@NgModule({
  declarations: [
    SetupsComponent,
    DepartmentSetupComponent,
    SponsershipTypeSetupComponent,
    HospitalServiceSetupComponent,
    ServiceCategorySetupComponent,
    StaffTypeSetupComponent,
    ProfessionSetupComponent,
    StaffCategorySetupComponent,
    ServiceSubcategorySetupComponent,
    LanguageSetupComponent,
    BankSetupComponent,
    BankBranchesSetupComponent,
    IdTypeSetupComponent,
    EducationLevelSetupComponent,
    AgeGroupSetupComponent,
    AgeCategorySetupComponent,
    AgeClassificationSetupComponent,
    TitleSetupComponent,
    RelationshipSetupComponent,
    TownSetupComponent,
    ReligionSetupComponent,
    DistrictSetupComponent,
    RegionSetupComponent,
    FacilitySetupComponent,
    AccreditationSetupComponent,
    CountrySetupComponent,
    CompanySetupComponent,
    SpecialitySetupComponent,
    MedicalSponsorSetupComponent,
    RecordComponent,
    AccountComponent,
    InpatientComponent,
    LaboratorySetupComponent,
    StoreSetupComponent,
    EisuComponent,
    OtherComponent,
    ClinicComponent,
    ServicePricingSetupComponent,
    SponsorPolicySetupComponent,
    ClinicTypeSetupComponent,
    ClinicServiceSetupComponent,
    MedicalHistoryCategoryComponent,
    AllergyHistoryCategoryComponent,
    FamilyHistoryCategoryComponent,
    MedicineHistoryCategoryComponent,
    SocialHistoryCategoryComponent,
    SurgicalHistoryCategoryComponent,
    IllnessTypeComponent,
    DischargeReasonComponent,
    ComplainTypeComponent,
    ComplaintComponent,
    ClinicsComponent,
    PhysicalExaminationCategoryComponent,
    MohghsgroupingsComponent,
    Icd10groupingsComponent,
    Icd10categoriesComponent,
    DiseasesComponent,
    LabParametersComponent,
    MedicineRoutesComponent,
    ProductFormAndUnitComponent,
    ProductTypeAndCategoryComponent,
    ProductsComponent,
    LabSampleTypesComponent,
    ParameterServiceMapComponent,
    SampleTypeServiceMapComponent
  ],
  imports: [
    CommonModule,
    SetupsRoutingModule,
    SharedModule,
    GooglePlaceModule,
    FormsModule
  ]
})
export class SetupsModule { }
