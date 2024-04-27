import { Student } from '../services/student.service';
import {Component, OnInit, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import {FormControl, FormGroup, FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { StudentService } from '../services/student.service';
import {MatIconModule} from '@angular/material/icon'
import { StudentUpdateDialogComponent } from './student-update-dialog/student-update-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
     MatButtonModule,
     FormsModule,
     MatFormFieldModule,
     MatInputModule,
     ReactiveFormsModule,
     MatTableModule,
     FormsModule,
     MatIconModule,
     ReactiveFormsModule,
     MatPaginator
    ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})


export class StudentComponent implements OnInit {
  columns: string[] = ['photo', 'id', 'fullname', 'age', 'gender', 'createdTime', 'actions'];
  data: Student[] = [];

  studentAppForms = new FormGroup({
    searchText: new FormControl()
  })

  private pageIndex: number = 1;
  private pageSize: number = 5;
  length: number = 0;

  pagingChange(event:any){
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }
  constructor(
    private dialog: MatDialog,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.studentAppForms.get('searchText')?.valueChanges.subscribe(result => {
      this.loadStudents();
    })
  }

  openAddStudentDialog() {
    this.dialog.open(StudentDialogComponent).afterClosed().subscribe((result) =>{
      this.loadStudents();
    });
  }

  openEditStudentDialog(id: number) {
    this.dialog.open(StudentUpdateDialogComponent, {data: {id: id}}).afterClosed().subscribe((result) =>{
      this.loadStudents();
    });
  }

  deleteStudent(id: number){
    this.studentService.delete(id).subscribe( {
      next: () => {
        this.loadStudents();
      },
      error: (err) => {
        alert(err.error.title)
      }
    });
  }

  private loadStudents(){
    const params = this.getParams();
    this.studentService.getByFilter({params}).subscribe((data) => {
      this.data = data.students;
      this.length = data.count;
    });
  }

  getParams(){
    let params: any = {}
    params.searchText = this.studentAppForms.get('searchText')?.value ?? '';
    params.pageIndex = this.pageIndex;
    params.pageSize = this.pageSize;
    return params;
  }

}
