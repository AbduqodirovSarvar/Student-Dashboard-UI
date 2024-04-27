import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentComponent } from '../student/student.component';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StudentComponent, CommonModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Student-dashboard';
}
