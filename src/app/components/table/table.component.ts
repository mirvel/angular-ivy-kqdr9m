import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { StudentService } from '../../services/student.service';

interface Student {
  name: string;
  region: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  items: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);
  _items: Student[];

  types = ['Exam', 'Quiz', 'Homework']; // TODo Get from list
  countries = [];
  selectedCountry;
  country;
  itemsPerPage: FormControl;
  currentPage: number = 1;
  currentItemsPerPage: number = 1;
  totalPages: number = 1;
  constructor(private studentService: StudentService) {
    this.country = new FormControl();
    this.itemsPerPage = new FormControl();

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
    this.itemsPerPage.valueChanges.subscribe((size) => {
      this.currentItemsPerPage = size;
      this.updatePage();
    });
  }

  ngOnInit() {
    this.studentService.getStudents().subscribe((list: any) => {
      this._items = list;
      this.items.next(list);
      this.countries = Object.keys(this.getCountries());
      console.log(this.countries);
    });
  }

  getCountries() {
    const countries = {};
    this.items.value.forEach((item: Student) => {
      countries[item.region] = 1;
    });
    return countries;
  }

  sort(type) {
    const sortedList = this._items.sort((a, b) => {
      return a[type] > b[type] ? -1 : 1;
    });
  }

  first() {
    this.currentPage = 1;
    this.updatePage();
  }
  last() {
    console.log('lastClicked');
    if (this.currentItemsPerPage) this.currentPage = this.totalPages;
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
    if (this.currentItemsPerPage)
      this.totalPages = Math.round(
        this._items.length / this.currentItemsPerPage
      );
    else {
      this.totalPages = 1;
      this.currentPage = 1;
    }
  }

  updatePage() {
    if (this.currentItemsPerPage) {
      //TODO: add pagination
      // TODO: Make sure that items index is corret
      const startWith = (this.currentPage - 1) * this.currentItemsPerPage;
      console.log({ startWith, howMany: this.currentItemsPerPage });
      const slicedItems = this._items.slice(
        startWith,
        startWith + this.currentItemsPerPage
      );
      this.items.next(slicedItems);
    } else {
      this.items.next(this._items);
    }

    this.calucateMaxPages();
  }
}
