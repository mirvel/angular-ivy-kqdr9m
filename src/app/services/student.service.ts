import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
@Injectable()
export class StudentService {
  constructor(private http: HttpClient) {}
  getStudents() {
    return this.http.get('/assets/students.json');
  }
  
}
