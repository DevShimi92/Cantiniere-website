  
import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../default.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  title = 'Cantiniere-website';

  menuHaveSomething: boolean = false;

  constructor(private defaultService: DefaultService) {
   // do nothing.
 }

  ngOnInit(): void {
    this.defaultService.getAllTypeOfArticle().subscribe((response) => 
    {
      if (response)
      {
        this.menuHaveSomething = true; 
      }
    }
    );
  }

}
