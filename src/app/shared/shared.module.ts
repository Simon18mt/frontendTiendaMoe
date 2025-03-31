import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FeaturesModule } from "../features/features.module";



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule, RouterModule,
    FeaturesModule
], exports: [HomeComponent]
})
export class SharedModule { }
