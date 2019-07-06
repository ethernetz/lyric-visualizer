import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component'
import { GraphComponent } from './graph/graph.component'
import { GraphDisplayComponent } from './graph/graph-display/graph-display.component';
import { InfoComponent } from './info/info.component'
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'intro', component: TutorialComponent},
  {path: 'search/:artist/:song', component: MainComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GraphComponent,
    GraphDisplayComponent,
    SidebarComponent,
    SearchComponent,
    InfoComponent,
    LoadingComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
