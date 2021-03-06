import { MedicalSponsorSetupComponent } from './pages/medical-sponsor-setup/medical-sponsor-setup.component';
import { AuthGuard } from './../shared/guard/auth.guard';
import { ReligionSetupComponent } from './pages/religion-setup/religion-setup.component';
import { PaymentStyleSetupComponent } from './pages/payment-style-setup/payment-style-setup.component';
import { CompanySetupComponent } from './pages/company-setup/company-setup.component';
import { CountrySetupComponent } from './pages/country-setup/country-setup.component';
import { AccreditationSetupComponent } from './pages/accreditation-setup/accreditation-setup.component';
import { FacilitySetupComponent } from './pages/facility-setup/facility-setup.component';
import { RegionSetupComponent } from './pages/region-setup/region-setup.component';
import { DistrictSetupComponent } from './pages/district-setup/district-setup.component';
import { TownSetupComponent } from './pages/town-setup/town-setup.component';
import { RelationshipSetupComponent } from './pages/relationship-setup/relationship-setup.component';
import { TitleSetupComponent } from './pages/title-setup/title-setup.component';
import { AgeGroupSetupComponent } from './pages/age-group-setup/age-group-setup.component';
import { EducationLevelSetupComponent } from './pages/education-level-setup/education-level-setup.component';
import { IdTypeSetupComponent } from './pages/id-type-setup/id-type-setup.component';
import { BankBranchesSetupComponent } from './pages/bank-branches-setup/bank-branches-setup.component';
import { BankSetupComponent } from './pages/bank-setup/bank-setup.component';
import { LanguageSetupComponent } from './pages/language-setup/language-setup.component';
import { ServiceSubcategorySetupComponent } from './pages/service-subcategory-setup/service-subcategory-setup.component';
import { StaffCategorySetupComponent } from './pages/staff-category-setup/staff-category-setup.component';
import { ProfessionSetupComponent } from './pages/profession-setup/profession-setup.component';
import { StaffTypeSetupComponent } from './pages/staff-type-setup/staff-type-setup.component';
import { ServiceCategorySetupComponent } from './pages/service-category-setup/service-category-setup.component';
import { HospitalServiceSetupComponent } from './pages/hospital-service-setup/hospital-service-setup.component';
import { BillingCycleSetupComponent } from './pages/billing-cycle-setup/billing-cycle-setup.component';
import { BillingSystemSetupComponent } from './pages/billing-system-setup/billing-system-setup.component';
import { SponsershipTypeSetupComponent } from './pages/sponsership-type-setup/sponsership-type-setup.component';
import { PaymentChannelSetupComponent } from './pages/payment-channel-setup/payment-channel-setup.component';
import { FundingTypeSetupComponent } from './pages/funding-type-setup/funding-type-setup.component';
import { DepartmentSetupComponent } from './pages/department-setup/department-setup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupsComponent } from './setups.component';
import { SpecialitySetupComponent } from './pages/speciality-setup/speciality-setup.component';

const routes: Routes = [
  {
    path: '',
    component: SetupsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'departments',
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'departments',
        component: DepartmentSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'funding-types',
        component: FundingTypeSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-channels',
        component: PaymentChannelSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'sponsorship-types',
        component: SponsershipTypeSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payment-styles',
        component: PaymentStyleSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'billing-systems',
        component: BillingSystemSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'billing-cycles',
        component: BillingCycleSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'hospital-services',
        component: HospitalServiceSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'service-categories',
        component: ServiceCategorySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'staff-types',
        component: StaffTypeSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'professions',
        component: ProfessionSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'staff-categories',
        component: StaffCategorySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'service-subcategories',
        component: ServiceSubcategorySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'languages',
        component: LanguageSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'banks',
        component: BankSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'bank-branches',
        component: BankBranchesSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'medicalsponsors',
        component: MedicalSponsorSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'id-types',
        component: IdTypeSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'education-levels',
        component: EducationLevelSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'age-groups',
        component: AgeGroupSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'titles',
        component: TitleSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'relationships',
        component: RelationshipSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'towns',
        component: TownSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'religions',
        component: ReligionSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'districts',
        component: DistrictSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'regions',
        component: RegionSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'facilities',
        component: FacilitySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'accreditations',
        component: AccreditationSetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'countries',
        component: CountrySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'companies',
        component: CompanySetupComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'specialties',
        component: SpecialitySetupComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupsRoutingModule { }
