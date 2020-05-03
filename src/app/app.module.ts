import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { HeaderModule } from '@pages/header/header.module';
import { FooterModule } from '@pages/footer/footer.module';


const AppModules = [
  CoreModule,
  HeaderModule,
  FooterModule,
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    ...AppModules,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
