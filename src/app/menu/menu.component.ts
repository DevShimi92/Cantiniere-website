import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FoodStockService } from '../service/foodStock.service';
import { Article } from '../shared/models/article.model';
import { Cart } from '../shared/models/cart.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  
  selectedTypeArticle;
  menuHaveSomething = false;
  listTypeArticle: string[] = [];
  tabTypeArticle = new Map();
  length = 0;
  pageSize = 8;
  search;

  listArticleDefault: Article[] = [];
  listArticle: Article[] = [];
  listArticleSearch: Article[] = [];
  listFilteredArticle: Article[] = [];

  constructor( public dialog: MatDialog, private foodStockService: FoodStockService) {
   // do nothing.
 }

  ngOnInit(): void {
    this.foodStockService.getAllTypeOfArticle().subscribe((response) => 
    {
      if (response)
      {
        this.listTypeArticle = [];
        this.listTypeArticle.push('Tout');
        this.tabTypeArticle.set('Tout',0); 

          for (const key of response) {           
            this.listTypeArticle.push(key.name);
            this.tabTypeArticle.set(key.name,key.code_type);    
          }

        this.selectedTypeArticle = this.listTypeArticle[0];
        
        this.menuHaveSomething = true; 
        
        this.foodStockService.getAllArticle().subscribe((response) => 
        {

          for (const key of response) {           
            this.listArticleDefault.push(key);
          }

          this.length = response.length;
          this.listArticle = this.listArticleDefault.slice(0, this.pageSize);
          this.listFilteredArticle = this.listArticleDefault;

        });
      }
    });
  }

  OnPageChange(event: PageEvent): void{

    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    if ( this.listArticleSearch.length == 0)
      this.listArticle = this.listFilteredArticle.slice(startIndex, endIndex);
    else
      this.listArticle = this.listArticleSearch.slice(startIndex, endIndex);    
  }

  selectType(): void{
    const selected = this.tabTypeArticle.get(this.selectedTypeArticle) ;

    this.listArticle = this.listArticleDefault;
   
    if( selected != 0 )
    {
      this.listFilteredArticle = this.listArticle.filter((article: Article) => article.code_type_src == selected);
      this.length = this.listFilteredArticle.length;
      this.listArticle = this.listFilteredArticle.slice(0, this.pageSize);
    }
    else
    {
      this.listFilteredArticle = this.listArticleDefault;
    }

    if (this.search != undefined)
      {
        this.listArticle = this.listFilteredArticle.filter((article: Article) => article.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1);
        this.length = this.listArticle.length;
        this.listArticle = this.listArticle.slice(0, this.pageSize);
      }

  }

  applyFilter(event: KeyboardEvent): void{

    const filterValue = (event.target as HTMLInputElement).value;
    if(event.key == 'Backspace')
    {
      this.listArticle = this.listFilteredArticle;
    }

    if(filterValue == '')
    {
      this.listArticleSearch = null;
      this.listArticle = this.listFilteredArticle;
      this.length = this.listArticle.length;
      this.listArticle = this.listArticle.slice(0, this.pageSize);
    }
    else
    {
      this.listArticleSearch = this.listFilteredArticle.filter((article: Article) => article.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1);
      this.length = this.listArticleSearch.length;
      this.listArticle = this.listArticleSearch.slice(0, this.pageSize);
    }

    
  }

  selectItem(event: Article): void
  {
    let cart: Cart[] = [];
    
    if (!sessionStorage.getItem('cart'))
    {
      cart.push(new Cart(event.id,event.name,event.price,event.code_type_src));
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
    else
    {
      cart = JSON.parse(sessionStorage.getItem('cart'));
      cart.push(new Cart(event.id,event.name,event.price,event.code_type_src));
      sessionStorage.setItem('cart', JSON.stringify(cart));
    }
    
    this.dialog.open(MenuComponentDialog);
    
  }


}


@Component({
  selector: 'app-menu-dialog',
  templateUrl: 'menu.component-dialog.html'
})

export class MenuComponentDialog {}
