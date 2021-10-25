import { Component, ViewChild, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

import { FoodStockService } from '../service/foodStock.service';

export class ArticleCheckBox {    
  
    constructor(
      public id: number,
      public name: string,
      public price: number,
      public checked: boolean,
    ) {}
  
  }

  export interface DialogData {
    name: string;
    value:string;
    price: number;
    picture: string;
    description: string;
    total: number;
    FormDialogMenu: number;
    data;
  }

@Component({
    selector: 'app-dashboard-dialog-menu',
    templateUrl: 'dashboard-dialog-menu.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardDialogMenuComponent implements OnInit,AfterViewInit {
    
    displayedColumnsDialog: string[] = ['id','name','checkbox'];
    displayedColumnsDialogShow: string[] = ['id','name','price','delete'];
    listArticle: ArticleCheckBox[] = [];
    resultsLength = 0;
    editMenuContent = false;
    nameFile = "Aucun fichier sélectioné";
    dataSource;
  
    @ViewChild('listDialogPaginatpr') listDialogPaginatpr: MatPaginator;
  
    constructor( public dialogRef: MatDialogRef<DashboardDialogMenuComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private foodStockService:FoodStockService) {}
      
  
      ngOnInit(): void {

        if(this.data.data)
        {
          if( this.data.FormDialogMenu == 8)
            {
              for(let  i = 0; i < Object.keys(this.data.data).length; i++)
                {
                  this.listArticle.push(new ArticleCheckBox(this.data.data[i].id_article,this.data.data[i]["Article.name"],this.data.data[i]["Article.price"], false));
                }
            }
          else
            {
              for (const key of this.data.data) { 
                this.listArticle.push(new ArticleCheckBox(key.id,key.name, key.price, false));
              }
            }
          
          this.resultsLength = this.data.data.length;
          this.dataSource = new MatTableDataSource(this.listArticle); 
          this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.name.toLowerCase().includes(filter) || data.id.toString() === filter;
          };
  
        }

      }
  
      ngAfterViewInit():void{
        if(this.data.data)
            {
            this.dataSource.paginator = this.listDialogPaginatpr;
            }
      }
  
      applyFilter(event: Event):void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
  
      deleteArticleOfMenu($event):void{
  
        const dialogRef = this.dialog.open(DashboardDialogMenuComponent,{
          data: { FormDialogMenu : 11, name : $event.name}
        });
  
        dialogRef.afterClosed().subscribe(result => {
          if (result == true)
          {
            this.foodStockService.deleteMenuContent(this.data.data[0].id_menu,$event.id).then(() => {
              
                this.dialog.open(DashboardDialogMenuComponent,{
                  data: { FormDialogMenu : 9  }
                });
              },
            
              (error) => 
                {
                      this.dialog.open(DashboardDialogMenuComponent,{
                        data: { FormDialogMenu : 4 , name : error.status }
                      });
              
                });
          }
        });
      }
  
      addArticleOnMenu():void{
  
        this.foodStockService.getAllArticle().subscribe((response) =>
            {
              const dialogRef = this.dialog.open(DashboardDialogMenuComponent,{
                data: { FormDialogMenu : 1, name : this.data.name, data : response}
              });
  
              dialogRef.afterClosed().subscribe(result => {
                if((result != undefined ) &&  (result != '' ))
                  {
                    if(this.checkIfMenuHaveContent(result) == true)
                    {
                      let errorCreate=false;
                      for(let  i = 0; i < Object.keys(result).length; i++)
                            {
                              if(result[i].checked == true)
                              {
                                  this.foodStockService.postMenuContent(this.data.data[0].id_menu,result[i].id).then(() =>
                                  (error) => 
                                    {
                                          errorCreate = true;
                                          console.log(error)
                                    });
                              }
                            }
                        if(errorCreate)
                            {
                              this.dialog.open(DashboardDialogMenuComponent,{
                                data: { FormDialogMenu : 5, name : this.data.name }
                              });
                            }
                            else
                            {
                              this.dialog.open(DashboardDialogMenuComponent,{
                                data: { FormDialogMenu : 9 }
                              });
                            }
  
                    
  
                    }
                  }});
            })
  
      }
  
      checkIfMenuHaveContent(any:ArticleCheckBox):boolean{
  
   
        for(let  i = 0; i < Object.keys(any).length; i++)
        {
          if(any[i].checked == true)
            {
              return true;
            }
        }
        return false;
      }

      uploadFile($event):void {
        this.nameFile = $event.target.files[0].name;
        this.data.picture = $event.target.files[0];
    }
  }