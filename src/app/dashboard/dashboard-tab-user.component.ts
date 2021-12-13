import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';

import { EventEmitterService } from '../service/event-emitter.service';
import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';
import { User } from '../shared/models/user.model';

export interface DialogData {
    name: string;
    money: number;
    SetNewSolde: boolean;
    erreur:boolean;
    data: string[];
    idOrder : number;
  }

  interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    money:number;
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

    constructor( public dialog: MatDialog, private eventEmitterService: EventEmitterService, private userService: UserService, private orderService: OrderService) { 
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

    showListOrderOfUser($event : UserData):void{

      this.orderService.getAllOrderOneAccount($event.id).subscribe((response) => {
        this.dialog.open(DashboardDialogListOrderComponent,{
          data: { data : response }
        });
    });


  
    }

    editSolde($event : UserData):void{
      
        const dialogRefEditSolde = this.dialog.open(DashboardDialogEditSoldeComponent,{
          data: { SetNewSolde : true, name : $event.last_name, money : $event.money, }
        });
    
        dialogRefEditSolde.afterClosed().subscribe(result => {
          
          if((result !== $event.money) && (result != null )  && (result != '' ))
            {
              this.user.id = $event.id;
              this.user.money = result;
    
              this.userService.updateUser(this.user).then(() => {
    
                this.dialog.open(DashboardDialogEditSoldeComponent,{
                  data: { SetNewSolde : false , erreur :false }
                });

                this.checkListUser();   
    
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

  @Component({
    selector: 'app-dashboard-dialog-list-order',
    templateUrl: 'dashboard-dialog-list-order.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardDialogListOrderComponent implements OnInit {

    dataSource;
    displayedColumnsListOrderDashBoard: string[] = ['id','createdAt','total','done','show'];
    ListOrderLength = 0;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor( public dialogRef: MatDialogRef<DashboardDialogListOrderComponent>, private orderService: OrderService, public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
      ngOnInit(): void {
        if(this.data.data)
          {
            this.ListOrderLength = this.data.data.length;
            this.dataSource = new MatTableDataSource(this.data.data);
            this.dataSource.paginator = this.paginator;
          }
        
      }

      convertDate(dateISOstring:string):string{
        const dateOrder = new Date(dateISOstring);
        return dateOrder.toLocaleString();
      }

      orderContent(idOrder:number,priceTotal:number):void{

        this.orderService.getOrderContent(idOrder).subscribe((response) => {
    
          this.dialog.open(DashboardDialogOrderContentComponent,{
            data: { idOrder : idOrder, total: priceTotal, data : response }
          });
    
        });
    
      }
  }

  @Component({
    selector: 'app-dashboard-dialog-order-content',
    templateUrl: 'dashboard-dialog-order-content.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardDialogOrderContentComponent implements OnInit{
    
    displayedColumnsDialogListOrder: string[] = ['name','price'];
    dataSource;
  
    constructor( public dialogRef: MatDialogRef<DashboardDialogOrderContentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
      ngOnInit(): void {
  
        this.dataSource = new MatTableDataSource(this.data.data); 
  
      }
  
  }
  