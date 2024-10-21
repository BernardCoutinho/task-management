import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(ModalModule.forRoot()) 
  ]
})
  .catch((err) => console.error(err));