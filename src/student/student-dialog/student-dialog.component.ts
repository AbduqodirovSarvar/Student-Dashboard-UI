import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentService } from '../../services/student.service';
import { FileHelperService } from '../../services/file-helper.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    ReactiveFormsModule
  ],

  templateUrl: './student-dialog.component.html',
  styleUrl: './student-dialog.component.scss',
})
export class StudentDialogComponent {

  createStudentForms: FormGroup = new FormGroup({
    fullname: new FormControl(null,{
      validators: [Validators.required]
    }),
    age: new FormControl(null,{
      validators: [Validators.required]
    }),
    gender: new FormControl(null,{
      validators: [Validators.required]
    }),
    phoneNumber: new FormControl(null,{
      validators: [Validators.required]
    }),
    photo: new FormControl<File | null>(null)
  })

  constructor(
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    private studentService: StudentService,
    private filehelper: FileHelperService
  ) {}

  onClickSubmit(): void{
    if( !this.createStudentForms.value.fullname
      || !this.createStudentForms.value.age
      || !this.createStudentForms.value.gender
      || !this.createStudentForms.value.phoneNumber
      || !this.studentService.isPhoneValid(this.createStudentForms.value.phoneNumber) ){
      alert('Please fill in all required fields');
      return;
    }
    const newStudent: FormData = new FormData();
    newStudent.append('FullName', this.createStudentForms.value.fullname);
    newStudent.append('Age', this.createStudentForms.value.age.toString());
    newStudent.append('Gender', this.createStudentForms.value.gender);
    newStudent.append('PhoneNumber', this.createStudentForms.value.phoneNumber);
    if (this.createStudentForms.value.photo) {
      newStudent.append('Photo', this.createStudentForms.value.photo, this.createStudentForms.value.photo.name);
    }
    this.studentService.create(newStudent).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        alert(err.error.title);
      }
    });
  }

  onClickCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const selectedFile = this.filehelper.openFolder(event);
    if(selectedFile){
      this.createStudentForms.get('photo')?.setValue(selectedFile);
    }
  }
}
