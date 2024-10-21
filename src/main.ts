import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(NgbModalModule),
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
})
  .catch((err) => console.error(err));
