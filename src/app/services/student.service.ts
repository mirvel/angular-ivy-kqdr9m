import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Student } from '../models/Student';
@Injectable()
export class StudentService {
  constructor(private http: HttpClient) {}
  getStudents() {
    return this.http.get('/assets/students.json').pipe(
      map((list: Student[]) => {
        return list.map((item) => {
          console.log(item);
          if (item['scores']) {
            const flatItem = item['scores'].reduce(
              (acc, { type, score }) => ({ ...acc, [type]: score }),
              {}
            );

            return { ...item, ...flatItem };
          }

          return item;
        });
      })
    );
  }
}
