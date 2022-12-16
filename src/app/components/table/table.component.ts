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
  countries = [];
  selectedCountry;
  country;
  itemsPerPageFormControl: FormControl;
  currentPage: number = 1;
  itemsPerPage: number;
  totalPages: number = 1;
  sortFn: (a: Student, b: Student) => number;
  sortConfig = {
    name: { direction: 1 },
    region: { direction: 1 },
    exam: { direction: 1 },
    quiz: { direction: 1 },
    homework: { direction: 1 },
  };

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
      this.sort('name');
    });
  }

  getCountries() {
    const countries = {};
    this.items.value.forEach((item: Student) => {
      countries[item.region] = 1;
    });
    return countries;
  }

  sort(field) {
    const direction = (this.sortConfig[field].direction =
      -this.sortConfig[field].direction);

    this.sortFn = (a, b) => {
      return a[field] < b[field] ? direction : -direction;
    };

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
    if (this.currentPage > 1) this.currentPage--;
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
