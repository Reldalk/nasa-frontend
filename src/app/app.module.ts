import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {BaseService} from './home/home.service';
import { SearchComponent } from './search/search.component';
import { SearchService } from './search/search.service';
import { PictureClickedBoxComponent } from './picture-clicked-box/picture-clicked-box.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    PictureClickedBoxComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [BaseService, SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
