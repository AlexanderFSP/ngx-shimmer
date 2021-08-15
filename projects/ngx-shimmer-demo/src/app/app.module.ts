import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxShimmerModule } from 'ngx-shimmer';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxShimmerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
