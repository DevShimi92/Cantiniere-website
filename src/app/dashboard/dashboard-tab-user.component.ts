import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

import { EventEmitterService } from '../service/event-emitter.service';
import { UserService } from '../service/user.service';
import { User } from '../shared/models/user.model';

export interface DialogData {
    name: string;
    money: number;
    SetNewSolde: boolean;
    erreur:boolean;
  }
  

@Component({
    selector: 'app-dashboard-tab-user',
    templateUrl: './dashboard-tab-user.component.html',
    styleUrls: ['./dashboard.component.css']
  })

  export class DashboardTabUserComponent implements OnInit  {

    displayedColumnsListUser: string[] = ['id', 'first_name', 'last_name', 'money','edit'];
    resultsLength = 0;
    dataSource;
    user : User;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor( public dialog: MatDialog, private eventEmitterService: EventEmitterService, private userService: UserService) { 
        this.user = new User();
     }  

    ngOnInit():void{    
     
        if (this.eventEmitterService.subsVarUser==undefined) {
          this.eventEmitterService.subsVarUser = this.eventEmitterService.invokeCheckListUser.subscribe(() => {
            this.checkListUser();    
          });    
        }    
    }  

    applyFilter(event: Event):void{
        
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }

    checkListUser():void{
        this.dataSource = '';
        this.userService.getAllUser().subscribe((response) =>
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
    }

    editSolde($event):void{
        const dialogRefEditSolde = this.dialog.open(DashboardDialogEditSoldeComponent,{
          data: { SetNewSolde : true, name : $event.last_name, money : $event.money, }
        });
    
        dialogRefEditSolde.afterClosed().subscribe(result => {
          if(result !== $event.money)
            {
              this.user.id = $event.id;
              this.user.money = result;
    
              this.userService.updateUser(this.user).then(() => {
    
                this.dialog.open(DashboardDialogEditSoldeComponent,{
                  data: { SetNewSolde : false , erreur :false }
                });
    
              }).catch((error) => {
    
                if(error.status == 409)
                  {
                    this.dialog.open(DashboardDialogEditSoldeComponent,{
                        data: { SetNewSolde : false , erreur :true }
                      });
                  }
                else
                  {
                    console.log(error); 
                  }
    
              });
    
            }
        });
      }

}

  @Component({
    selector: 'app-dashboard-dialog-edit-solde',
    templateUrl: 'dashboard-dialog-edit-solde.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardDialogEditSoldeComponent {
    
    constructor( public dialogRef: MatDialogRef<DashboardDialogEditSoldeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  }