import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Student } from '../../models/Student';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  items: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  _items: Student[];

  score_types = [
    { title: 'Exam', key: 'exam' },
    { title: 'Quiz', key: 'quiz' },
    { title: 'Homework', key: 'homework' },
  ]; // TODo Get from list
  countries = [];
  selectedCountry;
  country;
  itemsPerPageFormControl: FormControl;
  currentPage: number = 1;
  itemsPerPage: number;
  totalPages: number = 1;
  sortFn: (a: Student, b: Student) => number;
  sortConfig = { name: { direction: 1 }, region: { direction: 1 } };

  constructor(private studentService: StudentService) {
    this.country = new FormControl();
    this.itemsPerPageFormControl = new FormControl();

    this.country.valueChanges.subscribe((value) => {
      if (value) {
        this.selectedCountry = value;
        const filteredList = this._items.filter((item) => {
          return item.region === this.selectedCountry;
        });
        this.items.next(filteredList);
      } else {
        this.items.next(this._items);
      }
    });
    this.itemsPerPageFormControl.valueChanges.subscribe((size) => {
      this.itemsPerPage = size;
      this.updatePage();
    });
  }

  ngOnInit() {
    this.studentService.getStudents().subscribe((list: any) => {
      this._items = list;
      this.itemsPerPageFormControl.setValue(10);
      this.countries = Object.keys(this.getCountries());
      this.sort({ field: 'name' });
    });
  }

  getCountries() {
    const countries = {};
    this.items.value.forEach((item: Student) => {
      countries[item.region] = 1;
    });
    return countries;
  }

  sort(value) {
    const { field, type } = value;

    if (type) {
      this.sortFn = (a, b) => {
        const a_value =
          a[field].length &&
          a[field].filter((a_field) => a_field.type == type)[0];
        const b_value =
          b[field].length &&
          b[field].filter((b_field) => b_field.type == type)[0];
        console.log({ a_value, b_value });
        return a_value.score < b_value.score ? -1 : 1;
      };
    } else {
      this.sortFn = (a, b) => {
        const direction = (this.sortConfig[field].direction =
          -this.sortConfig[field].direction);
        return a[field] < b[field] ? direction : -direction;
      };
    }

    this.updatePage();
  }

  first() {
    this.currentPage = 1;
    this.updatePage();
  }
  last() {
    if (this.itemsPerPage) this.currentPage = this.totalPages;
    else this.currentPage = 1;
    this.updatePage();
  }
  next() {
    if (this.currentPage < this.totalPages) this.currentPage++;
    this.updatePage();
  }
  prev() {
    if (this.currentPage > 0) this.currentPage--;
    this.updatePage();
  }

  calucateMaxPages() {
    if (this.itemsPerPage)
      this.totalPages = Math.round(this._items.length / this.itemsPerPage);
    else {
      this.totalPages = 1;
      this.currentPage = 1;
    }
  }

  updatePage() {
    let updatedList: Student[];
    if (this.itemsPerPage) {
      const startWith = (this.currentPage - 1) * this.itemsPerPage;
      updatedList = this._items.slice(startWith, startWith + this.itemsPerPage);
    } else {
      updatedList = [...this._items];
    }

    this.items.next(updatedList.sort(this.sortFn));
    this.calucateMaxPages();
  }
}
