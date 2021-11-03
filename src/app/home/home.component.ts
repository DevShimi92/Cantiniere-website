import { Component, OnInit, Inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FoodStockService } from '../service/foodStock.service';
import { Menu } from '../shared/models/menu.model';
import { Cart } from '../shared/models/cart.model';

export interface DialogData {
  FormDialog: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  
  listMenuPage;
  listMenu;
  listPictureOfMenu;
  length =0;
  menuHere = false;
  showMenuContent = false;
  takeMenuRightNow = false;
  selectedIndex: number;

  constructor( public dialog: MatDialog, private foodStockService: FoodStockService ) {
   // do nothing.
 }

 ngOnInit(): void {
   
    this.foodStockService.getAllMenu().subscribe((response) => {
      if(response)
        {
          this.listMenu = response;
          this.listMenuPage = this.listMenu.slice(0, 3);
          this.length= response.length;
          this.fakeMenu();
          this.menuHere = true;
        }
    });
 }

 OnPageChange(event: PageEvent): void{

  const startIndex = event.pageIndex * event.pageSize;
  let endIndex = startIndex + event.pageSize;
  if(endIndex > this.length){
      endIndex = this.length;
    }
    this.listMenuPage = this.listMenu.slice(startIndex, endIndex); 
    this.fakeMenu();
}

fakeMenu():void{

  const fakeMenuEmpty = { id : 999, name :null, description :null, picture :null, price_final :null}

  while(this.listMenuPage.length < 3 )
    {
      this.listMenuPage.push(fakeMenuEmpty);
    }
}

showPictureOfMenu(menuIndexSelected:number, menuObjetSelected:Menu):void
  {
    this.showMenuContent = true;
    if(this.takeMenuRightNow === true)
      {
        this.selectedIndex=null;
      }
    else
      {
        this.selectedIndex=menuIndexSelected;
      }
    
    this.foodStockService.getMenuContent(menuObjetSelected.id).subscribe((response)=>{
    
      this.listPictureOfMenu = response ;

      for (const key of this.listPictureOfMenu) {
        if(key['Article.picture']){
          key['Article.picture'] = key['Article.picture'].substring(0, key['Article.picture'].search("upload/")+7) + "w_300,h_225,c_scale/" + key['Article.picture'].substring(key['Article.picture'].search("upload/")+7, key['Article.picture'].length) ;
        }
      }
    });
  }

  pickMenu(menuSelected:Menu):void{

    let cart: Cart[] = [];

    console.log('test');
    console.log(menuSelected);
    console.log(sessionStorage.getItem('cart'))

    if (!sessionStorage.getItem('cart'))
    {
      cart.push(new Cart(menuSelected.id,menuSelected.name,menuSelected.price_final,null));
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
    else
    {
      cart = JSON.parse(sessionStorage.getItem('cart'));
      cart.push(new Cart(menuSelected.id,menuSelected.name,menuSelected.price_final,null));
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }

   
    this.dialog.open(HomeDialogComponent,{ data: { FormDialog : 0 } });
    this.takeMenuRightNow = true;

  }

}

@Component({
  selector: 'app-home-dialog',
  templateUrl: 'home.component-dialog.html'
})

export class HomeDialogComponent {

  constructor( public dialogRef: MatDialogRef<HomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
