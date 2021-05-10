  
import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

import { DefaultService } from '../default.service';

export class ArticleCheckBox {    
  
  constructor(
    public id: string,
    public name: string,
    public price: string,
    public checked: boolean,
  ) {}

}

export interface DialogData {
  name: string;
  listTypeArticle: string;
  value:string;
  money: number;
  price: number;
  code_type: number;
  SetNewSolde: boolean;
  FormDialogTypeArticle: number;
  FormDialogArticle: number;
  FormDialogMenu: number;
  erreur:boolean;
  data;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumnsListUser: string[] = ['id', 'first_name', 'last_name', 'money','edit'];
  displayedColumnsCustom: string[] = ['code_type','name','edit'];
  displayCategory = 0;
  resultsLength = 0;
  dataSource;
  listTypeArticle: string[] = [];
  tabTypeArticle = new Map();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('listCustomPaginatpr') listCustomPaginatpr: MatPaginator;
  
  constructor( public dialog: MatDialog, private defaultService: DefaultService ) {
   // do nothing.
 }

  ngOnInit(): void {
   // do nothing.
  }

  click($event):void{
    const dialogRef = this.dialog.open(DashboardComponentDialogEditSolde,{
      data: { SetNewSolde : true, name : $event.last_name, money : $event.money, }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== $event.money)
        {
          this.defaultService.updateUser($event.id,null,null,null,null,result).subscribe((response) =>
              {
                this.dialog.open(DashboardComponentDialogEditSolde,{
                  data: { SetNewSolde : false , erreur :false }
                });
              },
            (error) => 
                {
                  if(error.status == 409)
                    {
                      this.dialog.open(DashboardComponentDialogEditSolde,{
                        data: { SetNewSolde : false , erreur :true }
                      });
                    }
                  else
                    {
                      console.log(error); 
                    }
                }
            );
        }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  tabOn($event):void{
    switch($event.index){
      case 0 :
        console.log('Voir les commandes');
        break;
      case 1 :
        this.dataSource = '';
        this.defaultService.getAllUser().subscribe((response) =>
          {
            if(response != null)
            {
              
              this.resultsLength = response.length;
              this.dataSource = new MatTableDataSource(response);
              this.dataSource.paginator = this.paginator;
              this.dataSource.filterPredicate = function(data, filter: string): boolean {
                return data.first_name.toLowerCase().includes(filter) || data.last_name.toLowerCase().includes(filter) || data.id.toString() === filter;
              };
            }
          });
        break;
      case 2 :
        this.displayCategory = 0 ;
        this.dataSource = '';
        break;
      case 3 :
          console.log('Paramètre');
          break;
    }
  }

  dayOn($event):void{
    switch($event.index){
      case 0 :
        console.log('Case 0');
        break;
      case 1 :
        console.log('Case 1');
        break;
      case 2 :
          console.log('Case 2');
          break;
      case 3 :
          console.log('Case 3');
          break;
      case 4 :
          console.log('Case 4');
          break;
    }
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
          this.defaultService.postTypeOfArticle(result).subscribe(() => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
                data: { FormDialogTypeArticle : 3, name : result }
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
                  data: { FormDialogTypeArticle : 4, name : error.status }
                });
              });
        }
      });
          
  }

  checkTypeArticle():void{
    this.displayCategory = 1 ;
    this.defaultService.getAllTypeOfArticle().subscribe((response) =>
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

  editTypeArticle($event):void{
    const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
      data: { FormDialogTypeArticle : 1, name : $event.name }
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result !== $event.name && ( result !== undefined &&  result !== '') ) {
          this.defaultService.putTypeOfArticle( $event.code_type,result).subscribe(() => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
                data: { FormDialogTypeArticle : 5, name : result }
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
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
          this.defaultService.deleteTypeOfArticle( $event.code_type).subscribe((response) => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
                data: { FormDialogTypeArticle : 6 }
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogTypeArticle,{
                  data: { FormDialogTypeArticle : 4, name : error.status }
                });
              });
        }
      });
          
  }

  createArticle():void{

    this.defaultService.getAllTypeOfArticle().subscribe((reponse) =>
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

                      this.defaultService.postArticle(result.name,result.price,this.tabTypeArticle.get(result.value)).subscribe(()=> ///result.price
                      {
                        const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                          data: { FormDialogArticle : 3 , name : result.name }
                        });
                      },
                      (error) => 
                        {
                          const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                            data: { FormDialogArticle : 4 , name : error.status }
                          });
                        });
                    }
              });

          }
          else
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
              data: { FormDialogArticle : 7 }
            });
          }
      },
      (error) => 
        {
          const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
            data: { FormDialogArticle : 4, name : error.status }
          });
        });
          
  }

  checkArticle():void{
    this.dataSource='';
    this.displayCategory = 2 ;
    this.defaultService.getAllArticle().subscribe((response) =>
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

  editArticle($event):void{
    const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
      data: { FormDialogArticle : 1, name : $event.name, price : $event.price }
    });

    dialogRef.afterClosed().subscribe(result => {
        if(( result !== undefined &&  result !== '') && ((result.name !== $event.name)||(result.price !== $event.price)) ) {
          this.defaultService.putArticle( $event.id,result.name, result.price).subscribe(() => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                data: { FormDialogArticle : 5, name : result.name }
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
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
          this.defaultService.deleteArticle( $event.id).subscribe((response) => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                data: { FormDialogArticle : 6 }
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogArticle,{
                  data: { FormDialogArticle : 4, name : error.status }
                });
              });
        }
      });
          
  }

  createMenu():void{

    let menuName = '';

    this.defaultService.getAllArticle().subscribe((response) =>
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
                      const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                        data: { FormDialogMenu : 1, name : result, data : response }
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if((result != undefined ) &&  (result != '' ))
                          {
                            if(this.checkIfMenuHaveContent(result) == false)
                              {
                                const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                  data: { FormDialogMenu : 2 }
                                });

                                dialogRef.afterClosed().subscribe(result => {
                                  if(result == true )
                                    {
                                      console.log("L'article ne contient pas d'article")
                                      this.defaultService.postMenu(menuName).subscribe(() =>
                                      {
                                        const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                          data: { FormDialogMenu : 3, name : menuName }
                                        });
                                      },
                                      (error) => 
                                        {
                                          const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                            data: { FormDialogMenu : 4, name : error.status }
                                          });
                                        });
                                    }
                                });
                              }
                            else
                            {
                              this.defaultService.postMenu(menuName).subscribe((reponse) =>
                              {
                                let errorCreate = false;
                                for(let  i = 0; i < Object.keys(result).length; i++)
                                    {
                                      if(result[i].checked == true)
                                      {
                                          this.defaultService.postMenuContent(reponse.id,result[i].id).subscribe(() =>
                                          (error) => 
                                            {
                                              errorCreate = true;
                                            });
                                      }
                                    }
                                  
                                if(errorCreate)
                                {
                                  const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                    data: { FormDialogMenu : 5, name : menuName }
                                  });
                                }
                                else
                                {
                                  const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                    data: { FormDialogMenu : 3, name : menuName }
                                  });
                                }



                              },
                              (error) => 
                                {
                                  const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                                    data: { FormDialogMenu : 4, name : error.status }
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
              const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                data: { FormDialogMenu : 10 }
              });
            }
            
          
          });

  }

  checkMenu():void{
    this.dataSource='';
    this.displayCategory = 3 ;
    this.defaultService.getAllMenu().subscribe((response) =>
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

  editMenu($event):void{

    this.defaultService.getMenuContent($event.id).subscribe((reponse) =>
    {
      if(reponse)
      {
        const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
          data: { FormDialogMenu : 8, name : $event.name, data : reponse }
        });
      }
      else
        {
          const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
            data: { FormDialogMenu : 8, name : $event.name }
          });
        }
    });

  }

  deleteMenu($event):void{
    const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
      data: { FormDialogMenu : 7, name : $event.name }
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result == true && ( result !== undefined &&  result !== '') ) {
          this.defaultService.deleteMenu( $event.id).subscribe((response) => 
            {
              const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                data: { FormDialogMenu : 6 }               
              });
            },
            (error) => 
              {
                const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                  data: { FormDialogMenu : 4, name : error.status }
                });
              });
        }
      });
          
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

}

@Component({
  selector: 'app-dashboard-dialog-edit-solde',
  templateUrl: 'dashboard.component-dialog-edit-solde.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentDialogEditSolde {
  
  constructor( public dialogRef: MatDialogRef<DashboardComponentDialogEditSolde>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}

@Component({
  selector: 'app-dashboard-dialog-type-article',
  templateUrl: 'dashboard.component-dialog-type-article.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentDialogTypeArticle {
  
  constructor( public dialogRef: MatDialogRef<DashboardComponentDialogTypeArticle>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}

@Component({
  selector: 'app-dashboard-dialog-article',
  templateUrl: 'dashboard.component-dialog-article.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentDialogArticle {
  
  constructor( public dialogRef: MatDialogRef<DashboardComponentDialogArticle>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}

@Component({
  selector: 'app-dashboard-dialog-menu',
  templateUrl: 'dashboard.component-dialog-menu.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentDialogMenu {
  
  displayedColumnsDialog: string[] = ['id','name','checkbox'];
  displayedColumnsDialogShow: string[] = ['id','name','price','delete'];
  listArticle: ArticleCheckBox[] = [];
  resultsLength = 0;
  editMenuContent = false;
  dataSource;

  @ViewChild('listDialogPaginatpr') listDialogPaginatpr: MatPaginator;

  constructor( public dialogRef: MatDialogRef<DashboardComponentDialogMenu>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, public dialog: MatDialog, private defaultService: DefaultService) {}
    

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

    ngAfterViewInit(){
      if(this.data.data)
          {
          this.dataSource.paginator = this.listDialogPaginatpr;
          }
    }

     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    deleteArticleOfMenu($event):void{

      const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
        data: { FormDialogMenu : 11, name : $event.name}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true)
        {
          this.defaultService.deleteMenuContent(this.data.data[0].id_menu,$event.id).subscribe(result => {
            
              this.dialog.open(DashboardComponentDialogMenu,{
                data: { FormDialogMenu : 9  }
              });
            },
          
            (error) => 
              {
                    this.dialog.open(DashboardComponentDialogEditSolde,{
                      data: { FormDialogMenu : 4 , name : error.status }
                    });
            
              });
        }
      });
    }

    addArticleOnMenu():void{

      this.defaultService.getAllArticle().subscribe((response) =>
          {
            const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
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
                                this.defaultService.postMenuContent(this.data.data[0].id_menu,result[i].id).subscribe(() =>
                                (error) => 
                                  {
                                        errorCreate = true;
                                  });
                            }
                          }
                      if(errorCreate)
                          {
                            const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
                              data: { FormDialogMenu : 5, name : this.data.name }
                            });
                          }
                          else
                          {
                            const dialogRef = this.dialog.open(DashboardComponentDialogMenu,{
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
}