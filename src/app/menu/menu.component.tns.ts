import { Component, OnInit} from '@angular/core';
import { CardView } from '@nstudio/nativescript-cardview';
import { registerElement } from '@nativescript/angular';
import { SearchBar } from '@nativescript/core'
import { DefaultService } from '../default.service';
import { Article } from '../shared/models/article.model';

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
  

  constructor(private defaultService: DefaultService) {
   // do nothing.
  }


  ngOnInit(): void {
    
    this.defaultService.getAllArticle().subscribe((response) => 
    {
      if(response)
        { 
          for (const key of response) {           
            this.listArticleDefault.push(key);
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

  pickArticle(item:any):void
  {
    // do nothing.
  }

  showDescription(item:any):void
  {
    // do nothing.
  }

  onSearchBarLoaded(event:any):void {
    if (event.object.android) {
     
          event.object.dismissSoftInput();
          event.object.android.clearFocus();
     
    }
  
  }

  applyFilter(args) {
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

  onClear(args) {
    const searchBar = args.object as SearchBar;
    this.listArticle = this.listArticleDefault;
  }


}
