import { Component, OnInit } from '@angular/core';

import { FoodStockService } from '../service/foodStock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  menuHere = false;

  constructor( private foodStockService: FoodStockService ) {
   // do nothing.
 }

 ngOnInit(): void {
   
    this.foodStockService.getAllMenu().subscribe((response) => {
      if(response != null)
        {
          this.menuHere = true;
        }
    });
 }

}
