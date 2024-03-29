import { Component, OnInit} from '@angular/core';
import { CardView } from '@nstudio/nativescript-cardview';
import { registerElement } from '@nativescript/angular';
import { Dialogs, SearchBar } from '@nativescript/core';
import { setString, getString } from '@nativescript/core/application-settings';
import { FoodStockService } from '../service/foodStock.service';
import { Article } from '../shared/models/article.model';
import { Cart } from '../shared/models/cart.model';

registerElement('CardView', () => CardView);
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  
  menuHaveSomething = false;
  notFound = false;
  listArticleDefault: Article[] = [];
  listArticle: Article[] = [];
  data = [];

  private addToCart = {
    title: 'Ajouté au panier !',
    message: 'Cet article a été ajouté au panier.',
    okButtonText: 'OK',
    cancelable: true
  }
  

  constructor(private foodStockService: FoodStockService) {
   // do nothing.
  }


  ngOnInit(): void {
    
    this.foodStockService.getAllArticle().subscribe((response) => 
    {
      if(response)
        { 
          for (const key of response) {           
            this.listArticleDefault.push(key);
            if(key['picture']){
              key['picture'] = key['picture'].substring(0, key['picture'].search("upload/")+7) + "w_250,h_250,c_scale/" + key['picture'].substring(key['picture'].search("upload/")+7, key['picture'].length) ;
            }
          }

          this.listArticle = this.listArticleDefault;

          this.menuHaveSomething = true;
        }
      else
        {
          this.menuHaveSomething = false;
        }
    });

  }

  pickArticle(item:Article):void
  {
    let cart: Cart[] = [];
    
   if (!getString('cart'))
    {
      cart.push(new Cart(item.id,item.name,item.price,item.code_type_src));
      setString('cart', JSON.stringify(cart));
    }
    else
    {
      cart = JSON.parse(getString('cart'));
      cart.push(new Cart(item.id,item.name,item.price,item.code_type_src));
      setString('cart', JSON.stringify(cart));
    }

    Dialogs.alert(this.addToCart);

  }

  showDescription(item:Article):void
  {
    if(!item.description)
        item.description = "Aucune description de disponible.";
        
    Dialogs.alert({
      title: "Description",
      message: item.description,
      okButtonText: "OK",
      cancelable: true
    });

  }

  onSearchBarLoaded(event: { object: { android: { clearFocus: () => void; }; dismissSoftInput: () => void; }; }):void {
    if (event.object.android) {
     
          event.object.dismissSoftInput();
          event.object.android.clearFocus();
     
    }
  
  }

  applyFilter(args: { object: SearchBar; }):void{
    const searchBar = args.object as SearchBar ;
    this.notFound = false ;

    if(searchBar.text == '')
    {
      this.listArticle = this.listArticleDefault;
    }
    else
    {
      this.listArticle = this.listArticleDefault.filter((article: Article) => article.name.toLowerCase().indexOf(searchBar.text.toLowerCase()) !== -1);
      if(this.listArticle.length == 0)
        this.notFound = true;
    }



  }

  onClear():void{
    this.listArticle = this.listArticleDefault;
  }


}
