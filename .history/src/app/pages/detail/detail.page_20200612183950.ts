import { Component, OnInit } from '@angular/core';
import { DataService, Song} from '../services/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  song: Song [] = [];
  constructor(private route: ActivatedRoute, private db: DataService, private router: Router, ) { }
  ngOnInit() {
    this.db.getSong().subscribe(data => {
      this.song = data;
    });
  }
}
