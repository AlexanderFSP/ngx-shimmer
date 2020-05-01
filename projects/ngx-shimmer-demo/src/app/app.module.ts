import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxShimmerModule } from 'ngx-shimmer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxShimmerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
