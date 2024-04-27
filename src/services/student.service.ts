import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { response } from 'express';

export interface Student {
  id: number;
  fullname: string;
  age: number;
  gender: string;
  phoneNumber: string;
  photo: string | null;
  createdAt: string;
}


export interface FilteredStudent{
  count: number;
  students: Student[];
}

const api: string = "http://localhost:8080/api/Student";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Student[]> {
    return this.http.get<any[]>(`${api}/all`).pipe(
      map(data => {
        return data.map(item => this.mapToStudent(item));
      })
    );
  }

  getByFilter(options?: {
    params?: any,
    header?: HttpHeaders | {
      [header: string] : string | string[];
    };
    responseType? : 'json'
  }){
    return this.http.get<FilteredStudent>(`${api}/ByFilter`, options).pipe(
      map(data => {
        return {
          count: data.count,
          students: data.students.map(item => this.mapToStudent(item))
        };
      })
    );
  }

  create(createStudentData: FormData): Observable<any> {
    return this.http.post(`${api}`, createStudentData);
  }

  update(updateStudentData: FormData): Observable<any>{
    return this.http.put<Student>(`${api}`, updateStudentData);
  }

  delete(id: number) : Observable<boolean>{
    return this.http.delete<boolean>(`${api}/${id}`);
  }

  getById(id?: number): Observable<Student> {
    return this.http.get<any>(`${api}/${id}`).pipe(
      map(data => this.mapToStudent(data))
    );
  }

  isPhoneValid(phoneNumber: string): boolean {
    return /^\+?[0-9]{12}$/.test(phoneNumber);
  }

  private mapToStudent(item: any): Student {
    return {
      id: item.id,
      fullname: item.fullName,
      age: item.age,
      gender: item.gender,
      phoneNumber: item.phoneNumber,
      photo: item.photoName ? `${api}/photo/${item.photoName}` : '../assets/Photos/cropped-IMG_2512 (2).JPG',
      createdAt: this.formatDate(new Date(item.createdAt))
    };
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  }
}
