  
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatDialog , MatDialogRef,  MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';


import { DefaultService } from '../default.service';

export interface DialogData {
  name: string;
  money: number;
  SetNewSolde: boolean;
  FormDialogTypeArticle: number;
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

  resultsLength = 0;
  dataSource;

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

  checkAllTypeArticle():void{
    this.defaultService.getAllTypeOfArticle().subscribe((response) =>
          {
            if(response != null)
            {
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