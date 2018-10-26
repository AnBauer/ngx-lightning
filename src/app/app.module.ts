import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgLightningModule } from 'ng-lightning';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgLightningModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
