import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import localeAr from '@angular/common/locales/ar';
import { registerLocaleData } from '@angular/common';

import { SidenavComponent } from './components/sideNavComponents/sidenav/sidenav.component';
import { NavSalesPersonComponent } from './components/sideNavComponents/nav-sales-person/nav-sales-person.component';
import { NavitemComponent } from './components/sideNavComponents/navitem/navitem.component';
import { ApiConfigService } from './Services/apiConfigService/api-config-service.service';
import { firstValueFrom } from 'rxjs';
import { ThemeComponent } from './components/theme/theme.component';

registerLocaleData(localeAr);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function loadApiConfig(apiConfigService: ApiConfigService) {
  return () => firstValueFrom(apiConfigService.loadConfig());
}

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    NavitemComponent,
    NavSalesPersonComponent,
    ThemeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        timeOut: 2000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
         progressBar: true,
         progressAnimation: 'increasing'
    }
    ),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
   providers: [
    provideHttpClient(),
      {
      provide: APP_INITIALIZER,
      useFactory: loadApiConfig,
      deps: [ApiConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
