import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { OrderService } from '../service/order.service';
import { OrderInfoRecap } from '../shared/models/orderInfo.model';


class TabOfWeek {    
  
  constructor(
    public idDay: number,
    public Day: string
  ) {}

}

@Component({
    selector: 'app-dashboard-tab-recap-order',
    templateUrl: './dashboard-tab-recap-order.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardRecapOrderComponent implements OnInit  {

    row = null;
    indexDay: number;
    dataRecapOrder;
    dataOrderContent;
    listOfOrder = [] ;
    displayedColumnsRecapOrder: string[] = ['name', 'nombre'];
    displayedColumnsOrderContent: string[] = ['name'];
    dayWeek: TabOfWeek[] = [];
    resultsLength = 0 ;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor( private orderService: OrderService) { } 

    ngOnInit():void{
      
      this.prepareTabOfDate();
      this.refreshTabForThisDay(this.dayWeek[0].Day);
    }
    

    setRow(index: number, idOrder : number):void{

        this.row = index;
        this.dataOrderContent = '';

        this.orderService.getOrderContent(idOrder).subscribe((response)=>{
          this.resultsLength = response.length;
          this.dataOrderContent = new MatTableDataSource(response);
          this.dataOrderContent.paginator = this.paginator;

        });
      }

    comfirmOrder(idOrder: number):void{
      this.orderService.putValidOrder(idOrder).then(()=> {
        this.refreshTabForThisDay(this.dayWeek[this.indexDay].Day);
      }).catch(()=>{
        console.log('valid-not-ok');
      });
    }

    cancelOrder(idOrder: number):void{
      this.orderService.deleteOrder(idOrder).then(()=> {
        this.refreshTabForThisDay(this.dayWeek[this.indexDay].Day);
      }).catch(()=>{
        console.log('delete-not-ok');
      });
    }


    dayOn($event: { index: number; }):void{
      this.indexDay = $event.index;
        switch($event.index){
          case 0 :
            this.refreshTabForThisDay(this.dayWeek[0].Day);
            break;
          case 1 :
            this.refreshTabForThisDay(this.dayWeek[1].Day);
            break;
          case 2 :
              this.refreshTabForThisDay(this.dayWeek[2].Day);
              break;
          case 3 :
              this.refreshTabForThisDay(this.dayWeek[3].Day);
              break;
          case 4 :
              this.refreshTabForThisDay(this.dayWeek[4].Day);
              break;
        }
      }

    prepareTabOfDate():void{
      
      const date = new Date();
      const index = date.getDay();
      let d = new Date();
      let day;
      if ( date.getDay() != 1){
        
        for(let  i = 1 ; i < index; i++)
        {
          d.setDate(date.getDate()-index+i);
          if ( d.getDate() < 10 )
              day = "0"+d.getDate();
            else
              day = d.getDate();
            
          this.dayWeek.push(new TabOfWeek( d.getDay(),d.getFullYear() +'-'+(d.getMonth()+1)+'-'+day));
        }

      }
      if ( date.getDate() < 10 )
          day ="0"+date.getDate();
        else
          day = date.getDate();

      this.dayWeek.push(new TabOfWeek( date.getDay(),date.getFullYear() +'-'+(date.getMonth()+1)+'-'+day));

      d = new Date();

      for(let  i = index; i < 5; i++)
        {
          d.setDate(d.getDate()+1);
          this.dayWeek.push(new TabOfWeek( d.getDay(),d.getFullYear() +'-'+(d.getMonth()+1)+'-'+d.getDate()));
        }
      
    }

    refreshTabForThisDay(date:string):void{

      this.dataRecapOrder = [];

      this.orderService.getAllOrderOfOneDay(date).subscribe((response)=>{
        if(response != null)
          {
            this.listOfOrder = response;
            
            this.orderService.getRecapOrder(date).subscribe((response)=>{
              if(response != null)
                this.dataRecapOrder = new MatTableDataSource<OrderInfoRecap>(response);
            });
            
          }
      });


    }
  }