import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { FlatpickrModule } from 'angularx-flatpickr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),RouterOutlet,BrowserModule,
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase),
     FlatpickrModule.forRoot(),
     BrowserAnimationsModule,
     ColorPickerModule,
     ToastrModule.forRoot({timeOut: 15000,closeButton: true,progressBar: true,})
    )
  ]
};
