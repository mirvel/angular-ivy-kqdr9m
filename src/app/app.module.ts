import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { TableComponent } from './components/table/table.component';
import { ItemComponent } from './components/item/item.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { StudentService } from './services/student.service';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    TableComponent,
    ItemComponent,
  ],

  bootstrap: [AppComponent],
  providers: [StudentService],
})
export class AppModule {}
