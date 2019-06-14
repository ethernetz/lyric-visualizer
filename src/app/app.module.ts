import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SearchComponent } from './search/search.component'
import { GraphComponent } from './graph/graph.component'
import { InfoComponent } from './info/info.component'

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    GraphComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
