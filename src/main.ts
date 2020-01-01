import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const elem = document.createElement('script');
elem.src =
  'https://maps.googleapis.com/maps/api/js?key=' +
  environment.googleMapsAPI +
  '&libraries=places&language=en';
document.body.appendChild(elem);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
