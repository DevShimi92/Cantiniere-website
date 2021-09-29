import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

import { EventEmitterService } from '../service/event-emitter.service';
import { FoodStockService } from '../service/foodStock.service';
import { DashboardComponentDialogMenu } from './dashboard-dialog-menu.component';

export interface DialogData {
    FormDialogTypeArticle: number;
    FormDialogArticle: number;
    FormDialogMenu: number;
    name: string;
    picture: string;
    description: string;
    total: number;
  }


export class ArticleCheckBox {
  
    constructor(
      public id: number,
      public name: string,
      public price: number,
      public checked: boolean,
    ) {}
  
  }

@Component({
    selector: 'app-dashboard-tab-edit-food',
    templateUrl: './dashboard-tab-edit-food.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardTabEditFoodComponent implements OnInit {

    displayedColumnsCustom: string[] = ['code_type','name','edit'];
    displayCategory = 0;
    resultsLength = 0;
    dataSource;
    listTypeArticle: string[] = [];
    tabTypeArticle = new Map();

    @ViewChild('listCustomPaginatpr') listCustomPaginatpr: MatPaginator;

    constructor( public dialog: MatDialog, private eventEmitterService: EventEmitterService, private foodStockService: FoodStockService) { } 

    ngOnInit(): void {
        if (this.eventEmitterService.subsVarTabEditFood==undefined) { 
            this.eventEmitterService.subsVarTabEditFood = this.eventEmitterService.invokeRestTabEditFood.subscribe(() => { 
              this.onRestTabEditFood();    
            });    
          }   
    }
    
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    onRestTabEditFood():void{

        this.displayCategory = 0 ;
        this.dataSource = '';

    }

    checkTypeArticle():void{
        this.displayCategory = 1 ;
        this.foodStockService.getAllTypeOfArticle().subscribe((response) =>
              {
                if(response != null)
                {
                  this.displayedColumnsCustom = ['code_type','name','edit'];
                  this.resultsLength = response.length;
                  this.dataSource = new MatTableDataSource(response);
                  this.dataSource.paginator = this.listCustomPaginatpr;
                  this.dataSource.filterPredicate = function(data, filter: string): boolean {
                    return data.name.toLowerCase().includes(filter) || data.code_type.toString() === filter;
                  };
                }
              });
    }
      
    checkArticle():void{
    this.dataSource='';
    this.displayCategory = 2 ;
    this.foodStockService.getAllArticle().subscribe((response) =>
          {
           if(response != null)
            {
              this.displayedColumnsCustom = ['id','name','price','edit'];
              this.resultsLength = response.length;
              this.dataSource = new MatTableDataSource(response);
              this.dataSource.paginator = this.listCustomPaginatpr;
              this.dataSource.filterPredicate = function(data, filter: string): boolean {
                return data.name.toLowerCase().includes(filter) || data.id.toString() === filter;
              };
            }
          });
          
    }

    checkMenu():void{
        this.dataSource='';
        this.displayCategory = 3 ;
        this.foodStockService.getAllMenu().subscribe((response) =>
              {
                if(response != null)
                {
                  this.displayedColumnsCustom = ['id','name','editMenu'];
                  this.resultsLength = response.length;
                  this.dataSource = new MatTableDataSource(response);
                  this.dataSource.paginator = this.listCustomPaginatpr;
                  this.dataSource.filterPredicate = function(data, filter: string): boolean {
                    return data.name.toLowerCase().includes(filter) || data.id.toString() === filter;
                  };
                }
              });
    
    }

    editFunction($event):void
    {
      switch(this.displayCategory)
      {
        case 1 :
          this.editTypeArticle($event);
          break;
        case 2 :
          this.editArticle($event);
          break;
        case 3 :
          this.editMenu($event);
            break;
      }
  
    }
  
    deleteFunction($event):void
    {
      switch(this.displayCategory)
      {
        case 1 :
          this.deleteTypeArticle($event);
          break;
        case 2 :
          this.deleteArticle($event);
          break;
        case 3 :
          this.deleteMenu($event);
            break;
      }
  
    }

    createTypeArticle():void{
        const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
          data: { FormDialogTypeArticle : 0 }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result) {
    
              this.foodStockService.postTypeOfArticle(result).then(() => 
                {
                    this.dialog.open(DashboardComponentDialogTypeArticle,{
                        data: { FormDialogTypeArticle : 3, name : result }
                    });
                },
                (error) => 
                  {
                    this.dialog.open(DashboardComponentDialogTypeArticle,{
                        data: { FormDialogTypeArticle : 4, name : error.status }
                    });
                  });
            }
          });
              
    }

    editTypeArticle($event):void{
        const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
          data: { FormDialogTypeArticle : 1, name : $event.name }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result !== $event.name && ( result !== undefined &&  result !== '') ) {
              this.foodStockService.putTypeOfArticle( $event.code_type,result).then(() => 
                {
                    this.dialog.open(DashboardComponentDialogTypeArticle,{
                        data: { FormDialogTypeArticle : 5, name : result }
                    });
                },
                (error) => 
                  {
                        this.dialog.open(DashboardComponentDialogTypeArticle,{
                            data: { FormDialogTypeArticle : 4, name : error.status }
                        });
                  });
            }
          });
              
    }

    deleteTypeArticle($event):void{
        const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
          data: { FormDialogTypeArticle : 2, name : $event.name }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == true && ( result !== undefined &&  result !== '') ) {
              this.foodStockService.deleteTypeOfArticle( $event.code_type).then((response) => 
                {
                    this.dialog.open(DashboardComponentDialogTypeArticle,{
                        data: { FormDialogTypeArticle : 6 }
                    });
                },
                (error) => 
                  {
                        this.dialog.open(DashboardComponentDialogTypeArticle,{
                        data: { FormDialogTypeArticle : 4, name : error.status }
                        });
                  });
            }
          });
              
    }

    createArticle():void{

        this.foodStockService.getAllTypeOfArticle().subscribe((reponse) =>
        {
          if(reponse)
            {
              this.listTypeArticle = [];
    
              for (const key of reponse) {
                this.tabTypeArticle.set(key.name,key.code_type);             
                this.listTypeArticle.push(key.name);
              }
    
              const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                  data: { FormDialogArticle : 0, listTypeArticle : this.listTypeArticle }
                });
    
              dialogRef.afterClosed().subscribe(result => {
                        if(result) {
    
                          this.foodStockService.postArticle(result.name,result.price,this.tabTypeArticle.get(result.value),result.description).then(()=>
                          {
                                this.dialog.open(DashboardComponentDialogArticle,{
                                    data: { FormDialogArticle : 3 , name : result.name }
                                });
                          },
                          (error) => 
                            {
                                this.dialog.open(DashboardComponentDialogArticle,{
                                    data: { FormDialogArticle : 4 , name : error.status }
                                });
                            });
                        }
                  });
    
              }
            else
                {
                    this.dialog.open(DashboardComponentDialogArticle,{
                        data: { FormDialogArticle : 7 }
                        });
                }
          },
          (error) => 
            {
                this.dialog.open(DashboardComponentDialogArticle,{
                        data: { FormDialogArticle : 4, name : error.status }
                });
            });
              
    }

    editArticle($event):void{
        const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
          data: { FormDialogArticle : 1, name : $event.name, price : $event.price, picture : '', description : $event.description }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(( result !== undefined &&  result !== '') && ((result.name !== $event.name) || (result.price !== $event.price) || (result.description !== $event.description) ) ) {
              console.log(result);
              this.foodStockService.putArticle( $event.id,result.name, result.price, result.description).then(() => 
                {
                    this.dialog.open(DashboardComponentDialogArticle,{
                        data: { FormDialogArticle : 5, name : result.name }
                    });
                },
                (error) => 
                  {
                        this.dialog.open(DashboardComponentDialogArticle,{
                            data: { FormDialogArticle : 4, name : error.status }
                        });
                  });
            }
            if( result !== undefined && result.picture !== '')
            {
                this.foodStockService.putImage($event.id,result.picture).then(()=>{
                  this.dialog.open(DashboardComponentDialogArticle,{
                    data: { FormDialogArticle : 8, name : result.name }
                });
              },
              (error)=>
              {
                      this.dialog.open(DashboardComponentDialogArticle,{
                        data: { FormDialogArticle : 4, name : error.status }
                      });
              });
            }

          });
              
    }

    deleteArticle($event):void{
        const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
          data: { FormDialogArticle : 2, name : $event.name }
        });
    
        dialogRef.afterClosed().subscribe(result => {
            if(result == true && ( result !== undefined &&  result !== '') ) {
              this.foodStockService.deleteArticle( $event.id).then(() => 
                {
                    this.dialog.open(DashboardComponentDialogArticle,{
                        data: { FormDialogArticle : 6 }
                    });
                },
                (error) => 
                  {
                    this.dialog.open(DashboardComponentDialogArticle,{
                      data: { FormDialogArticle : 4, name : error.status }
                    });
                  });
                }
          });
              
    }

    createMenu():void{

        let menuName = '';
    
        this.foodStockService.getAllArticle().subscribe((response) =>
              {
              if(response)
                {
                  const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                    data: { FormDialogMenu : 0 }
                  });
    
                  dialogRef.afterClosed().subscribe(result => {
                      if ((result != undefined ) &&  (result != '' ))
                      {
                          menuName = result ;

                          const dialogRefForm1 = this.dialog.open(DashboardComponentDialogMenu,{
                            data: { FormDialogMenu : 1, name : result, data : response }
                          });
    
                          dialogRefForm1.afterClosed().subscribe(listArticleCheckBox => {
                            if((listArticleCheckBox != undefined ) &&  (listArticleCheckBox != '' ))
                              {
                                if(this.checkIfMenuHaveContent(listArticleCheckBox) == false)
                                  {
                                    const dialogRefForm2 = this.dialog.open(DashboardComponentDialogMenu,{
                                      data: { FormDialogMenu : 2 }
                                    });
    
                                    dialogRefForm2.afterClosed().subscribe(result => {
                                      if(result == true )
                                        {
                                          this.foodStockService.postMenu(menuName).then(() =>
                                          {
                                                this.dialog.open(DashboardComponentDialogMenu,{
                                                    data: { FormDialogMenu : 3, name : menuName }
                                                });
                                          },
                                          (error) => 
                                            {
                                                this.dialog.open(DashboardComponentDialogMenu,{
                                                    data: { FormDialogMenu : 4, name : error.status }
                                                });
                                            });
                                        }
                                    });
                                  }
                                else
                                {
                                  const total_price = this.TotalMenuContent(listArticleCheckBox);

                                  const dialogRefForm12 = this.dialog.open(DashboardComponentDialogMenu,{
                                    data: { FormDialogMenu : 12, total : total_price}
                                  });
                                  
                                  dialogRefForm12.afterClosed().subscribe(data => {
                                    
                                    this.foodStockService.postMenu(menuName,data.total,data.description).then((idMenu) =>
                                  {
                                    let errorCreate = false;
                                    for(let  i = 0; i < Object.keys(listArticleCheckBox).length; i++)
                                        {
                                          if(listArticleCheckBox[i].checked == true)
                                          {
                                              this.foodStockService.postMenuContent(idMenu,listArticleCheckBox[i].id).then(() =>
                                              (error) => 
                                                {
                                                  errorCreate = true;
                                                  console.log(error);
                                                });
                                          }
                                        }
                                      
                                    if(errorCreate)
                                      {
                                        this.dialog.open(DashboardComponentDialogMenu,{
                                          data: { FormDialogMenu : 5, name : menuName }
                                        });
                                      }
                                    else
                                      {
                                        this.dialog.open(DashboardComponentDialogMenu,{
                                          data: { FormDialogMenu : 3, name : menuName }
                                        });
                                      }
    
                                  },
                                  (error) => 
                                    {
                                        this.dialog.open(DashboardComponentDialogMenu,{
                                            data: { FormDialogMenu : 4, name : error.status }
                                        });
                                    });

                                  });
                                }
                              }
                          });
                      
                      }
    
                    
                  });
                }
              else
                {
                  this.dialog.open(DashboardComponentDialogMenu,{
                    data: { FormDialogMenu : 10 }
                  });
                }
                
              
              });
    
    }

    checkIfMenuHaveContent(result:ArticleCheckBox):boolean{

 
        for(let  i = 0; i < Object.keys(result).length; i++)
        {
          if(result[i].checked == true)
            {
              return true;
            }
        }
        return false;
    }

    TotalMenuContent(result:ArticleCheckBox):number{
 
      let total_price=0;

      for(let  i = 0; i < Object.keys(result).length; i++)
        {
          if(result[i].checked == true)
            {
              total_price = total_price + result[i].price;
            }
        }

        return total_price;

    }

    editMenu($event):void{

      this.foodStockService.getMenuContent($event.id).subscribe((reponse) =>
      {
        if(reponse)
        {
         const dialogRefForm8 = this.dialog.open(DashboardComponentDialogMenu,{
            data: { FormDialogMenu : 8, name : $event.name, total : $event.price_final, description : $event.description, data : reponse }
          });

          dialogRefForm8.afterClosed().subscribe( data => {

            if((data) && (($event.name != data.name) || ($event.price_final != data.total) || ($event.description != data.description)))
              {
                this.updateMenu($event.id, data.name, data.total, data.description);
              }
          });
          
        }
        else
          {
            const dialogRefForm8 = this.dialog.open(DashboardComponentDialogMenu,{
              data: { FormDialogMenu : 8, name : $event.name }
            });

            dialogRefForm8.afterClosed().subscribe( data => {

              if((data) && (($event.name != data.name) || ($event.price_final != data.total) || ($event.description != data.description)))
                {
                  this.updateMenu($event.id, data.name, data.total, data.description);
                }
            });
          }
      });
  
    }
  
    updateMenu(id:number, name:string, price_final:number, description:string):void{

      this.foodStockService.putMenu(id, name, price_final, description).then(() => {
        
        this.dialog.open(DashboardComponentDialogMenu,{
          data: { FormDialogMenu : 9 }
        });

      }).catch((error)=>{
          this.dialog.open(DashboardComponentDialogMenu,{
            data: { FormDialogMenu : 4, name : error.status }
          });
      });

    }

    deleteMenu($event):void{
      const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
        data: { FormDialogMenu : 7, name : $event.name }
      });
  
      dialogRef.afterClosed().subscribe(result => {
          if(result == true && ( result !== undefined &&  result !== '') ) {
            this.foodStockService.deleteMenu( $event.id).then(() => 
              {
                this.dialog.open(DashboardComponentDialogMenu,{
                  data: { FormDialogMenu : 6 }               
                });
              },
              (error) => 
                {
                  this.dialog.open(DashboardComponentDialogMenu,{
                    data: { FormDialogMenu : 4, name : error.status }
                  });
                });
          }
        });
            
    }
}

  @Component({
    selector: 'app-dashboard-dialog-type-article',
    templateUrl: 'dashboard-dialog-type-article.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardComponentDialogTypeArticle {
    
    constructor( public dialogRef: MatDialogRef<DashboardComponentDialogTypeArticle>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  }

  @Component({
    selector: 'app-dashboard-dialog-article',
    templateUrl: 'dashboard-dialog-article.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardComponentDialogArticle {
    
    nameFile = "Aucun fichier sélectioné";

    constructor( public dialogRef: MatDialogRef<DashboardComponentDialogArticle>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
      uploadFile($event) {
        this.nameFile = $event.target.files[0].name;
        this.data.picture = $event.target.files[0];
    }
  }