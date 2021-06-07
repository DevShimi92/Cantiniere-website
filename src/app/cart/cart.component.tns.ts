import { Component, OnInit} from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { setString, getString } from '@nativescript/core/application-settings';
import { Dialogs } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';


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
  helper = new JwtHelperService();
  dataUser : any;
  finalPrice = 0;

  private accountNotLogin = {
    title: 'Non connencté !',
    message: 'Vous devez être connecté pour valider votre panier !',
    okButtonText: 'Allez à la page de connexion',
    cancelable: true
  }

  private notMoneyForBuy = {
    title: 'Solde insuffisant !',
    message: "Vous n'avez pas assez de crédit sur votre compte pour passer une commande !",
    okButtonText: 'OK',
    cancelable: true
  }

  private errorOnOrder = {
    title: 'Anomalie sur votre commande !',
    message: "Une erreur est survenue durant la prise de commande. Veuillez prendre contact avec votre responsable de site",
    okButtonText: 'OK',
    cancelable: true
  }

  private orderOK = {
    title: 'Valider !',
    message: "Votre commande a été enregistré avec succée",
    okButtonText: 'OK',
    cancelable: true
  }

  constructor(private routerExtensions: RouterExtensions, private authService: AuthService, private orderService: OrderService) {
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
        this.dataUser = this.helper.decodeToken(getString("token"));
        if(this.dataUser.money >= this.finalPrice)
          {
            let errorCreate = false;
            console.log('sssss');
            console.log(this.dataUser.id);
            console.log(this.dataUser.money);
            console.log(this.finalPrice);
            this.orderService.postOrderInfo(this.dataUser.id,this.dataUser.money,this.finalPrice).then((idOrder) => {
              console.log('1');
              for(let  i = 0; i < Object.keys(this.cart).length; i++)
              {
                this.orderService.postOrderContent(this.cart[i].id,idOrder).then(() =>
                (error) => 
                  {
                    errorCreate = true;
                  });
              }

              console.log('2');

              if (errorCreate)
                {
                  console.log('4');
                  Dialogs.alert(this.errorOnOrder);
                }
              else
                {
                  console.log('3');
                  this.cart = [];
                  this.updateCartOnVisually();
                  setString('cart', JSON.stringify(this.cart));
                  Dialogs.alert(this.orderOK);
                  this.authService.refreshToken();
                  this.cartHaveSomething  = false;
                }

            });
          }
        else
          {
            Dialogs.alert(this.notMoneyForBuy);
          }
      }
    else{
      Dialogs.confirm(this.accountNotLogin).then(result => {
        if( result )
          {
            this.routerExtensions.navigate(["/login"], { clearHistory: true });
          }
      });
    }

  }



}
