  
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatDialog , MatDialogRef,  MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


import { DefaultService } from '../default.service';

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
  erreur:boolean;
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
      case 0 :
        console.log('Case 0');
        break;
      case 1 :
        this.editTypeArticle($event);
        break;
      case 2 :
        this.editArticle($event);
        break;
      case 3 :
          console.log('Case 3');
          break;
    }

  }

  deleteFunction($event):void
  {
    switch(this.displayCategory)
    {
      case 0 :
        console.log('Case 0');
        break;
      case 1 :
        this.deleteTypeArticle($event);
        break;
      case 2 :
        this.deleteArticle($event);
        break;
      case 3 :
          console.log('Case 3');
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