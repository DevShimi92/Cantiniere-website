import { Component, OnInit} from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { setString, getString } from '@nativescript/core/application-settings';
import { Dialogs } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';

import { DataUser } from '../shared/models/dataUser.model';
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
  dataUser : DataUser;
  finalPrice = 0;
  errorCreate = false;

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

  private orderTimeExceeded = {
    title: 'Service fermé !',
    message: "Le service est fermé ! Revenez demain !",
    okButtonText: 'OK',
    cancelable: true
  }
  
  private limitOrderAccount = {
    title: 'Limite de commande attient !',
    message: "Vous ne pouvez plus passé de commande pour aujourd'hui ! Revenez demain !",
    okButtonText: 'OK',
    cancelable: true
  }

  private limitOrderExceeded = {
    title: 'Fin de prise de commande!',
    message: "Le service ne peut plus prendre de commande pour aujourd'hui ! Revenez demain !",
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
            
            this.orderService.postOrderInfo(this.dataUser.id,this.dataUser.money,this.finalPrice).then(async (idOrder) => {

              for(let  i = 0; i < Object.keys(this.cart).length; i++)
              {
                if(this.cart[i].code_type_src != null )
                  {
                    await this.orderService.postOrderContent(idOrder,this.cart[i].id).then(() =>
                        (error) => 
                          {
                            console.log(error);
                            Dialogs.alert(this.errorOnOrder);
                          });

                  }
                else
                  {
                    await this.orderService.postOrderContent(idOrder,null,this.cart[i].id).then(() =>
                    (error) => 
                      {
                        console.log(error);
                        Dialogs.alert(this.errorOnOrder);
                      });
    
                  }

              }

                  this.cart = [];
                  this.updateCartOnVisually();
                  setString('cart', JSON.stringify(this.cart));
                  Dialogs.alert(this.orderOK);
                  this.authService.refreshToken();
                  this.cartHaveSomething  = false;
                

            },
            (error) => 
              {
                if(error.status == 403)
                {
                  if(error.error.error == "Order time exceeded")
                    {
                      Dialogs.alert(this.orderTimeExceeded);
                    }
                  else if(error.error.error == "Limit Order for this account exceeded")
                    {
                      Dialogs.alert(this.limitOrderAccount);
                    }
                  else if(error.error.error == "Limit Order exceeded")
                    {
                      Dialogs.alert(this.limitOrderExceeded);
                    }
                }
                else
                  {
                    Dialogs.alert(this.errorOnOrder);
                    console.log(error);
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
