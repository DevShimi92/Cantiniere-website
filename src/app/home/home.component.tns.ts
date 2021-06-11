import { Component, OnInit} from '@angular/core';
import { setString, getString } from '@nativescript/core/application-settings';
import { Dialogs } from '@nativescript/core';

import { FoodStockService } from '../service/foodStock.service';
import { Cart } from '../shared/models/cart.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  here = false;
  menuList;
  selectedIndex: number;
  selectedMenu;
  listday: string[] = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi'];

  private addToCart = {
    title: 'Ajouté au pannier !',
    message: 'Ce menu a été ajouté au pannier.',
    okButtonText: 'OK',
    cancelable: true
  }

  constructor( private foodStockService: FoodStockService ) {
   // do nothing.
  }


  ngOnInit(): void {

    this.foodStockService.getAllMenu().subscribe((response) => {

      if(response != null)
        {
          this.here = true;
          this.menuList = response;
          this.selectedMenu = response[0];
        }
      
        
    });
  }

  selected(blockSelected:number,menu:any):void{
    this.selectedMenu=menu;
    this.selectedIndex=blockSelected;
  }

  pickMenu():void{

    let cart: Cart[] = [];

    if(this.selectedIndex != null)
    {
      if (!getString('cart'))
      {
        cart.push(new Cart(this.selectedMenu.id,this.selectedMenu.name,this.selectedMenu.price_final,null));
        setString('cart', JSON.stringify(cart));
      }
      else
      {
        cart = JSON.parse(getString('cart'));
        cart.push(new Cart(this.selectedMenu.id,this.selectedMenu.name,this.selectedMenu.price_final,null));
        setString('cart', JSON.stringify(cart));
      }

      this.selectedIndex=null;

      Dialogs.alert(this.addToCart);
    }
  }
}
