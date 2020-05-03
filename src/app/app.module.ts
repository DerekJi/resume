import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { HeaderModule } from '@pages/header/header.module';
import { FooterModule } from '@pages/footer/footer.module';
import { HeroModule } from '@pages/hero/hero.module';
import { AboutModule } from '@pages/about/about.module';
import { ExpertiseModule } from '@pages/expertise/expertise.module';
import { EducationModule } from '@pages/education/education.module';
import { ExperienceModule } from '@pages/experience/experience.module';
import { ContactModule } from '@pages/contact/contact.module';


const AppModules = [
  CoreModule,

  HeaderModule,
  HeroModule,
  AboutModule,
  ExpertiseModule,
  EducationModule,
  ExperienceModule,
  ContactModule,
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
