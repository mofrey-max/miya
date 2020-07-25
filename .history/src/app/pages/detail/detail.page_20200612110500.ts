import { Component, OnInit } from '@angular/core';
import { DataService,} from '../services/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {


  
  constructor(private route: ActivatedRoute, private db: DataService, private router: Router, private toast: ToastController) { }
 
  ngOnInit() {
    
  }
 
  
 

}
