import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';

@Component({
    selector: 'app-dashboard-tab-recap-order',
    templateUrl: './dashboard-tab-recap-order.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardRecapOrderComponent implements OnInit  {

    row = null;
    dataRecapOrder;
    dataOrderContent;
    listOfOrder;
    displayedColumnsRecapOrder: string[] = ['name', 'nombre'];
    displayedColumnsOrderContent: string[] = ['name'];
    resultsLength = 0 ;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor( private userService: UserService, private orderService: OrderService) { } 

    ngOnInit():void{   
      console.log('hey');
      this.listOfOrder = '';

      this.orderService.getAllOrder().subscribe((response)=>{
        this.listOfOrder = response;
        console.log(this.listOfOrder);
        
      });

      this.dataRecapOrder = '';
      this.orderService.getRecapOrder().subscribe((response)=>{
        this.dataRecapOrder = new MatTableDataSource(response);
      });

    }
    

    setRow(index: number, idOrder : number):void{
        console.log('test');
        this.row = index;
        this.dataOrderContent = '';
        console.log(idOrder);

        this.orderService.getOrderContent(idOrder).subscribe((response)=>{
          console.log(response);
          this.resultsLength = response.length;
          this.dataOrderContent = new MatTableDataSource(response);
          this.dataOrderContent.paginator = this.paginator;

        });
      }

    comfirmOrder(idOrder: number):void{
      this.orderService.putValidOrder(idOrder).then(()=> {
        console.log('valid-ok');
      }).catch(()=>{
        console.log('valid-not-ok');
      });
    }

    cancelOrder(idOrder: number):void{
      this.orderService.deleteOrder(idOrder).then(()=> {
        console.log('delete-ok');
      }).catch(()=>{
        console.log('delete-not-ok');
      });
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