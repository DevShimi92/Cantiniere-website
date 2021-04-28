  
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatDialog , MatDialogRef,  MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { DefaultService } from '../default.service';

export interface DialogData {
  name: string;
  money: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'money','edit'];
  resultsLength = 0;
  dataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor( public dialog: MatDialog, private defaultService: DefaultService ) {
   // do nothing.
 }

  ngOnInit(): void {
   // do nothing.
  }

  click($event):void{
    const dialogRef = this.dialog.open(DashboardComponentEditSolde,{
      data: { SetNewSolde : true, name : $event.last_name, money : $event.money, }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== $event.money)
        {
          this.defaultService.updateUser($event.id,null,null,null,null,result).subscribe((response) =>
              {
                this.dialog.open(DashboardComponentEditSolde,{
                  data: { SetNewSolde : false , erreur :false }
                });
              },
            (error) => 
                {
                  if(error.status == 409)
                    {
                      this.dialog.open(DashboardComponentEditSolde,{
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
        this.defaultService.getAllUser().subscribe((response) =>
          {
            this.resultsLength = response.length;
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.filterPredicate = function(data, filter: string): boolean {
              return data.first_name.toLowerCase().includes(filter) || data.last_name.toLowerCase().includes(filter) || data.id.toString() === filter;
            };
          });
        break;
      case 2 :
          console.log('Voir menu');
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
  
}

@Component({
  selector: 'app-dashboard-dialog',
  templateUrl: 'dashboard.component-dialog-edit-solde.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponentEditSolde {
  
  constructor( public dialogRef: MatDialogRef<DashboardComponentEditSolde>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}