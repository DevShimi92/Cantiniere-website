import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Cart } from '../shared/models/cart.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar}  from '@angular/material/snack-bar';

import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { EventEmitterService } from '../service/event-emitter.service';
import { DataUser } from '../shared/models/dataUser.model';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart[] = [];
  displayedColumnsCart: string[] = ['name','price','delete'];
  accountLogIn = false;
  OrderError = false;
  cartHaveSomething = false;
  dataUser : DataUser;
  finalPrice = 0;
  cartLength = 0;
  rowHeight = 375;
  innerWidth: number;
  dataSource;
  helper = new JwtHelperService();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @HostListener('window:resize', ['$event'])
  onResize():void{
    window.addEventListener('resize', (event: UIEvent) => {
      const w = event.target as Window; 
      if(w.innerWidth > 1920)
        {
          this.rowHeight = 375;
        }
      else
        {
          this.rowHeight = 250;
        }
    });
  } 

  constructor(private eventEmitterService: EventEmitterService, private _snackBar: MatSnackBar, private orderService: OrderService, private authService: AuthService) {
   // do nothing.
 }

  ngOnInit(): void {

    this.innerWidth = window.innerWidth;
    if(innerWidth > 1920)
        this.rowHeight = 375;
    else
      this.rowHeight = 250; 

    this.cart = JSON.parse(sessionStorage.getItem('cart'));
    if(this.cart)
    {
     this.updateCartOnVisually();
     this.cartHaveSomething = true
    }
    if (sessionStorage.getItem('token'))
    {
      this.accountLogIn = true;
    }
  }

  deleteArticleOfCart($event :Cart):void{
    let index = 0;
    
    do { 
      if(this.cart[index].id == $event.id)
      {
          this.cart.splice(index, 1);
          this.updateCartOnVisually();
          sessionStorage.setItem('cart', JSON.stringify(this.cart));
        break;
      }
      index++;
   } 
   while(index != this.cart.length);
   if(this.cart.length == 0)
    this.cartHaveSomething = false;
  }

  updateCartOnVisually():void
  {
    this.cartLength = this.cart.length;
    this.dataSource = new MatTableDataSource(this.cart);
    this.dataSource.paginator = this.paginator;
    this.finalPrice = 0 ; 
    for(let  i = 0; i < Object.keys(this.cart).length; i++)
    {
      this.finalPrice += this.cart[i].price;
    }
  }

  open():void{
    this.eventEmitterService.emitChange();
  }

  orderCart():void {

    this.dataUser = this.helper.decodeToken(sessionStorage.getItem('token'));

    if((this.dataUser.money > this.finalPrice) && (sessionStorage.getItem('hourLimit') == 'true'))
      {
        let errorCreate = false;
        this.orderService.postOrderInfo(this.dataUser.id,this.dataUser.money,this.finalPrice).then((idOrder) => {
        
          for(let  i = 0; i < Object.keys(this.cart).length; i++)
              {
                if(this.cart[i].code_type_src != null )
                  {
                    this.orderService.postOrderContent(idOrder,this.cart[i].id).then(()=>{
                      // Nothing
                    },
                      (error) => 
                        {
                          errorCreate = true;
                          console.log(error);
                        });
                  }
                else
                  {
                    this.orderService.postOrderContent(idOrder,null,this.cart[i].id).then(()=>{
                      // Nothing
                    },
                      (error) => 
                        {
                          errorCreate = true;
                          console.log(error);
                        });
                  }
                
              }

        if (errorCreate)
          {
            this.OrderError = true ;
          }
        else
          {
            this.authService.refreshToken();
            sessionStorage.removeItem('cart');
            this.cart = [];
            this.cartHaveSomething = false;
            this.updateCartOnVisually();
            this._snackBar.open('Votre commande a bien été enregistrée !', 'OK');
          }

        },
        (error) => 
          {
            if(error.status == 403){

              console.log(error.error.error);

              if(error.error.error == "Order time exceeded")
                {
                  this._snackBar.open("Les commandes ne sont plus acceptées pour aujourd'hui !", 'OK');
                }
              else if(error.error.error == "Limit Order for this account exceeded")
              {
                this._snackBar.open("Vous ne pouvez plus passé de commande pour aujourd'hui !", 'OK');
              }
              else if(error.error.error == "Limit Order exceeded")
              {
                this._snackBar.open('Le service ne peut plus prendre de commande pour aujourd hui !', 'OK');
              }

            }
            else if(error.status == 500)
              {
                console.log("error server");  
              }
            else
              {
                console.log(error); 
              }
          }
      );

      }
    else if(sessionStorage.getItem('hourLimit') == 'false')
      {
        this._snackBar.open('Les commandes ne sont plus accepté pour aujourd hui !', 'OK');
      }
    else
      {
        this._snackBar.open('Votre solde est insuffisant pour passer votre commande !', 'OK');
      }

    

  }

}


@Component({
  selector: 'cart-snack-bar-component-snack',
  template: '<span> {{ test }} </span>',
})
export class CartSnackBarComponent {

  test = 'error';

}