import { Component, OnInit} from '@angular/core';
import { getString } from "@nativescript/core/application-settings";
import { Dialogs } from "@nativescript/core";

import { User } from '../shared/models/user.model';
import { DataUser } from '../shared/models/dataUser.model';
import { OrderContent } from '../shared/models/orderContent.model';
import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';
import { FoodStockService } from '../service/foodStock.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.tns.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
  listOrderLocal;
  contentOrderLocal;
  contentMenuLocal;
  dataUser : DataUser;
  checkPassaword : string;
  fieldsUser : User;
  user : User;
  Expired = false;
  emptylistOrder = false;
  isShowOrder = false;
  isShowOrderContent = false;
  isShowMenuContent = false;

  constructor( private userService: UserService, private orderService: OrderService, private foodStockService: FoodStockService ) {
    this.user = new User();
    this.fieldsUser = new User();
  }


  ngOnInit(): void {

    this.dataUser = JSON.parse(getString('userData'));
    
    this.fieldsUser.id = this.dataUser.id;
    this.fieldsUser.last_name = this.dataUser.last_name; 
    this.fieldsUser.first_name = this.dataUser.first_name; 
    this.fieldsUser.email = this.dataUser.email; 
    this.fieldsUser.password = '';
  }

  toggle():void{

    if(this.isShowMenuContent)
      {
        this.isShowMenuContent = !this.isShowMenuContent;
      }
    else
      {
        if(this.isShowOrderContent && !this.isShowMenuContent) 
          this.isShowOrderContent=false; 
        else
          this.isShowOrder = !this.isShowOrder;

        if(this.isShowOrder)
          {
              this.refresListOrder();
          }
      }
  }

  refresListOrder():void{

      this.orderService.getAllOrderOneAccount(this.dataUser.id).subscribe((response) => {
        this.Expired = false;
        if(response)
          {
            this.emptylistOrder = false;
            this.listOrderLocal = response;
          }
        else
          {
            this.emptylistOrder = true;
          }
        
      },(error) => {
        this.Expired = true;
        console.log(error);
      });
  }

  showOrderContent(idOrder:number):void{

    this.orderService.getOrderContent(idOrder).subscribe((response) => {
      this.contentOrderLocal = response;
      this.isShowOrderContent = true;
    },(error) => {
      console.log(error);
    });

  }

  showMenuContent(row:OrderContent):void{
    if(row["MenuInfo.id"])
      {
        this.foodStockService.getMenuContent(row["MenuInfo.id"]).subscribe((response) => {
          this.isShowMenuContent = true;
          this.contentMenuLocal  = response;
        });
      }
  }

  convertName(row:OrderContent):string
    {
      if(row["MenuInfo.id"] == null)
        {
          return row["Article.name"];
        }
      else
        {
          return row["MenuInfo.name"];
        }
    }

  convertPrice(row:OrderContent):string
    {
      if(row["MenuInfo.id"] == null)
        {
          return row["Article.price"].toString();
        }
      else
        {
          return row["MenuInfo.price_final"].toString();
        }

    }

  convertDate(dateISOstring:string):string{
    const dateOrder = new Date(dateISOstring);
    const year = dateOrder.getFullYear();
    const month = dateOrder.getMonth()+1;
    const day = dateOrder.getDate();
    let dateFormated : string;

    if (day < 10) {
      dateFormated = '0' + day+'/';
    }
    else{
      dateFormated = day+'/';
    }

    if (month < 10) {
      dateFormated = dateFormated +'0' + month+'/'+year;
    }
    else{
      dateFormated = dateFormated + month+'/'+year;
    }
    
    return dateFormated;
  }

  convertBoolean(status:boolean):string{
    
    if(status)
      return 'Terminé';
    else
      return 'En cours';

  }

  submit():void {
    
    if ((this.dataUser.last_name != this.fieldsUser.last_name) || (this.dataUser.first_name != this.fieldsUser.first_name) || (this.dataUser.email != this.fieldsUser.email) )
      {
        this.user.id = this.fieldsUser.id;
        this.user.last_name = this.fieldsUser.last_name; 
        this.user.first_name = this.fieldsUser.first_name; 
        this.user.email = this.fieldsUser.email; 

        this.userService.updateUser(this.user).then(() => {
          
          this.dialogsOK();

        }).catch((error) => {
          if(error.status == 409)
            {
              this.dialogsErreur();
            }
          else
            {
              console.log(error);
            }

        });
 
      }
    if (this.fieldsUser.password)
      {
        if (this.fieldsUser.password == this.checkPassaword)
          {
            this.user.id = this.fieldsUser.id;
            this.user.password = this.fieldsUser.password;

              this.userService.updateUser(this.user).then(() => {
                
                this.dialogsOK();

              }).catch((error) => {
                if(error.status == 409)
                  {
                    this.dialogsErreur();
                  }
                else
                  {
                    console.log(error);
                  }

              });
          }
        else
          {
            Dialogs.alert({
              title: "Erreur",
              message: "Le mot de passe de confirmation est différent du mot de pasee défini",
              okButtonText: "OK",
              cancelable: true
            }).then(()=> {
                console.log("Le mot de passe de confirmation est différent du mot de pasee défini");
            });
          }
      }

  }

  dialogsErreur(): void
  {
    Dialogs.alert({
      title: "Erreur",
      message: "Certains champs n'ont pas pu être mis à jour",
      okButtonText: "OK",
      cancelable: true
    }).then(()=> {
        console.log("Erreur 409 dans updateProfile");
    });
  }

  dialogsOK(): void
  {
    Dialogs.alert({
      title: "Information",
      message: "Profile mise à jour !",
      okButtonText: "OK",
      cancelable: true
    }).then(()=> {
      console.log('Update profile résussi');
    });
  }

}
