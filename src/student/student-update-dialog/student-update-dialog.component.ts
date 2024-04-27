import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentService } from '../../services/student.service';
import { FileHelperService } from '../../services/file-helper.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-student-update-dialog',
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
  templateUrl: './student-update-dialog.component.html',
  styleUrl: './student-update-dialog.component.scss'
})

export class StudentUpdateDialogComponent implements OnInit{

  updateStudentForms: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null,{
      validators: [Validators.required]
    }),
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
  });

  constructor(
    public dialogRef: MatDialogRef<StudentUpdateDialogComponent>,
    private studentService: StudentService,
    private filehelper: FileHelperService,
    @Inject(MAT_DIALOG_DATA) protected data? : any
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }

  private loadStudent(){
      this.studentService.getById(this.data?.id).subscribe((student) => {
        this.updateStudentForms.patchValue({
          id: student.id,
          fullname: student.fullname,
          age: student.age,
          gender: student.gender,
          phoneNumber: student.phoneNumber,
        });
    });
  }

  onClickSave(){
    if( !this.updateStudentForms.value.fullname
        || !this.updateStudentForms.value.age
        || !this.updateStudentForms.value.gender
        || !this.updateStudentForms.value.phoneNumber
        || !this.studentService.isPhoneValid(this.updateStudentForms.value.phoneNumber) ){
      alert('Please fill in all required fields');
      return;
    }
    const updateStudent: FormData = new FormData();
    updateStudent.append('Id', this.updateStudentForms.value.id.toString());
    updateStudent.append('FullName', this.updateStudentForms.value.fullname);
    updateStudent.append('Age', this.updateStudentForms.value.age.toString());
    updateStudent.append('Gender', this.updateStudentForms.value.gender);
    updateStudent.append('PhoneNumber', this.updateStudentForms.value.phoneNumber);
    if (this.updateStudentForms.value.photo) {
      updateStudent.append('Photo', this.updateStudentForms.value.photo, this.updateStudentForms.value.photo.name);
    }
    this.studentService.update(updateStudent).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (err) => {
        console.log(err.error.title);
      }
    });
  }

  onClickCancel(){
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    const selectedFile = this.filehelper.openFolder(event);
    if (selectedFile) {
      this.updateStudentForms.get('photo')?.setValue(selectedFile);
    }
  }
}
