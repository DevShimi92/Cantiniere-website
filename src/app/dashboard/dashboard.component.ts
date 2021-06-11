  
import { Component } from '@angular/core';
import { EventEmitterService } from '../service/event-emitter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  
  constructor( private eventEmitterService: EventEmitterService ) {
 }

  tabOn($event):void{
    switch($event.index){
      case 0 :
        console.log('Voir les commandes');
        break;
      case 1 :
        this.eventEmitterService.onCallCheckListUser();    
        break;
      case 2 :
        this.eventEmitterService.onCallRestTabEditFood();    
        break;
      case 3 :
          console.log('Paramètre');
          break;
    }
  }

  dayOn($event):void{
    switch($event.index){
      case 0 :
        console.log('Case 0');
        break;
      case 1 :
        console.log('Case 1');
        break;
      case 2 :
          console.log('Case 2');
          break;
      case 3 :
          console.log('Case 3');
          break;
      case 4 :
          console.log('Case 4');
          break;
    }
  }


}


