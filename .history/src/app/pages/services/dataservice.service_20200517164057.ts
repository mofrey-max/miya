
import { Injectable } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  public items: any = [];
  selectedPath = '';

  constructor( private router: Router,) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
    this.items = [
      {
        id: '1',
        title:  'Hyel tlakәu janә ea mangha',
        index: '001',
        url:  '/p1',

      },
      {
        id: '2',
        title:  'The God of Abraham praise!',
        url:  '/p2'
      },
      {
        id: '3',
        title:  'The God of Abraham praise!',
        url:  '/p3'
      },
      {
        id: '4',
        title:  'The God of Abraham praise!',
        url:  '/p4'
      },
      {
        id: '5',
        title:  'The God of Abraham praise!',
        url:  '/p5'
      },
      {
        id: '6',
        title:  'The God of Abraham praise!',
        url:  '/p6'
      },
      {
        id: '7',
        title:  'The God of Abraham praise!',
        url:  '/p7'
      },
      {
        id: '8',
        title:  'The God of Abraham praise!',
        url:  '/p8'
      },
      {
        id: '9',
        title:  'The God of Abraham praise!',
        url:  '/p9'
      },
      {
        id: '10',
        title:  'The God of Abraham praise!',
        url:  '/p10'
      },
      {
        id: '11',
        title:  'Hyel tlakәu janә ea mangha',
        url:  '/p11'
      },


    ];
  }

  filterItems(searchTerm) {
    return this.items.filter(item => {
      return item.id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
      item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
