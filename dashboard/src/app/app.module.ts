import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskBoardComponent } from './tasks/task-board.component';
import { TaskCardComponent } from './tasks/task-card.component';
import { TaskFormComponent } from './tasks/task-form.component';
import { TokenInterceptor } from './core/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    TaskBoardComponent,
    TaskCardComponent,
    TaskFormComponent,
],
imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    AppRoutingModule,
],
providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}