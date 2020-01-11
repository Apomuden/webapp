import {JwtInterceptor} from './shared/interceptor/token.interceptor';
import {AuthenticationService} from './shared/services/authentication.service';
import {AuthGuard} from './shared/guard/auth.guard';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {en_US, NgZorroAntdModule, NZ_I18N, NzAlertModule} from 'ng-zorro-antd';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';


import {AppRoutingModule} from './app-routing.module';
import {TemplateModule} from './shared/template/template.module';
import {SharedModule} from './shared/shared.module';

import {AppComponent} from './app.component';
import {CommonLayoutComponent} from './layouts/common-layout/common-layout.component';

import {NgChartjsModule} from 'ng-chartjs';
import {ThemeConstantService} from './shared/services/theme-constant.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';


registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, CommonLayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    AppRoutingModule,
    TemplateModule,
    SharedModule,
    NzAlertModule,
    NgChartjsModule,
    HttpClientModule,
  ],

  providers: [
    {
      provide: NZ_I18N,
      useValue: en_US,
    },
    ThemeConstantService,
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
