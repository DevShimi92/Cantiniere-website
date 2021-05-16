  
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from '../shared/models/cart.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { DefaultService } from '../default.service';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart[] = [];
  displayedColumnsCart: string[] = ['name','price','delete'];
  accountLogIn = false;
  finalPrice = 0;
  cartLength = 0;
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private defaultService: DefaultService) {
   // do nothing.
 }

  ngOnInit(): void {
    this.cart = JSON.parse(sessionStorage.getItem('cart'));
    if(this.cart)
    {
     this.updateCartOnVisually();
    }
    if (sessionStorage.getItem('token'))
    {
      this.accountLogIn = true;
    }
  }

  deleteArticleOfCart($event):void{
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
    this.defaultService.emitChange();
  }

}
