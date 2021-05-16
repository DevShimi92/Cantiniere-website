import { Component, OnInit} from '@angular/core';
import { setString, getString } from '@nativescript/core/application-settings';
import { Dialogs } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { DefaultService } from '../default.service';
import { Cart } from '../shared/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  
  cart: Cart[] = [];
  cartHaveSomething  = false;
  accountLogIn = false;
  finalPrice = 0;

  private accountNotLogin = {
    title: 'Non connencté !',
    message: 'Vous devez être connecté pour valider votre panier !',
    okButtonText: 'Allez à la page de connexion',
    cancelable: true
  }

  constructor(private routerExtensions: RouterExtensions, private defaultService: DefaultService) {
   // do nothing.
  }


  ngOnInit(): void {

    this.cart = JSON.parse(getString('cart'));

    if(this.cart.length != 0)
      {
        this.cartHaveSomething  = true;
        this.updateCartOnVisually();
      }
    if(getString("token"))
      {
        this.accountLogIn = true;
      }

  }

  updateCartOnVisually():void
  {
    
    this.finalPrice = 0 ; 
    for(let  i = 0; i < Object.keys(this.cart).length; i++)
    {
      this.finalPrice += this.cart[i].price;
    }

  }

  deleteArticle($event):void{
    
    let index = 0;
    do { 
      if(this.cart[index].id == $event.id)
      {
          this.cart.splice(index, 1);
          this.updateCartOnVisually();
          setString('cart', JSON.stringify(this.cart));
        break;
      }
      index++;
   } 
   while(index != this.cart.length);

   if(this.cart.length == 0)
   {
     this.cartHaveSomething  = false;
   }

  }

  orderCart():void {
    if(this.accountLogIn)
      {
        //Nothing
      }
    else{
      Dialogs.confirm(this.accountNotLogin).then(result => {
        if( result == true )
          {
            this.routerExtensions.navigate(["/login"], { clearHistory: true });
          }
      });
    }

  }



}
