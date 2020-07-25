import { Component, OnInit } from '@angular/core';
import { DataService, Dev } from '../services/dataservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  developer: Dev = null;
  //  skills = '';
  
  constructor(private route: ActivatedRoute, private db: DataService, private router: Router, private toast: ToastController) { }
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const devId = params.get('id');
 
      this.db.getDeveloper(devId).then(data => {
        this.developer = data;
        // this.skills = this.developer.skills.join(',');
      });
    });
  }
 
  delete() {
    this.db.deleteDeveloper(this.developer.id).then(() => {
      this.router.navigateByUrl('/');
    });
  }
 
 

}
