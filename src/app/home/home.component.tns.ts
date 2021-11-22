import { Component, OnInit} from '@angular/core';
import { setString, getString } from '@nativescript/core/application-settings';
import { Dialogs } from '@nativescript/core';

import { FoodStockService } from '../service/foodStock.service';
import { Cart } from '../shared/models/cart.model';
import { Menu } from '../shared/models/menu.model';

export class ArticleOfMenu {    
  
  constructor(
    public idMenu: number,
    public name: string
  ) {}

}

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
  contentsOfMenus: ArticleOfMenu[] = [];

  private addToCart = {
    title: 'Ajouté au panier !',
    message: 'Ce menu a été ajouté au panier.',
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
          let i = 0;
          this.menuList = response;
          this.selectedMenu = response[0];
          while(this.menuList.length != i)
          {
            this.detailsMenu(this.menuList[i].id);
            if(this.menuList[i].picture == null)
              {
                this.menuList[i].picture = "res://imagenotfound"; 
              }


            i++;
            if(this.menuList.length == i)
              {
                this.here = true;
              }
              
          }

        }
        
    });
  }

  detailsMenu(idmenu:number):void{

    this.foodStockService.getMenuContent(idmenu).subscribe((response)=> {

      let i = 0;

      if(response != null)
        {
          while(response.length != i)
            {
              this.contentsOfMenus.push(new ArticleOfMenu(response[i].id_menu,response[i]['Article.name']));
              i++;
            }
 
          }
 
    });

  }
  
  showDetailsMenu(idmenu:number,showAll:boolean):string{
    
    let i = 0 ;
    let j = 0 ;
    let listeOfArticle = '';

    while(this.contentsOfMenus.length != i){
      if(this.contentsOfMenus[i].idMenu == idmenu)
        {
          listeOfArticle =listeOfArticle + '- '+ this.contentsOfMenus[i].name + '\n ';
          j++;
        }

      i++;
      
      if(j == 5 && showAll == false)
        {
          listeOfArticle = listeOfArticle + '...';
          i = this.contentsOfMenus.length;
        } 
    }

    if(showAll){

      Dialogs.alert({
        title: "Contenu du menu :",
        message: listeOfArticle,
        okButtonText: "OK",
        cancelable: true
      });

      return '';
    }
    else
    {
      return listeOfArticle;
    }

    

  }


  showDescription(text:string):void{
    Dialogs.alert({
      title: "Description",
      message: text,
      okButtonText: "OK",
      cancelable: true
    });

  }

  selected(blockSelected:number,menu:Menu):void{
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
