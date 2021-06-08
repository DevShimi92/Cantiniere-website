import { Component, OnInit} from '@angular/core';
import { getString } from "@nativescript/core/application-settings";
import { Dialogs } from "@nativescript/core";

import { User } from '../shared/models/user.model';
import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.tns.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
  listOrderLocal;
  contentOrderLocal;
  dataUser : any;
  checkPassaword : string;
  fieldsUser : User;
  user : User;
  isShowOrder = false;
  isShowOrderContent = false;

  constructor( private userService: UserService, private orderService: OrderService ) {
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
    if(this.isShowOrderContent)
      this.isShowOrderContent=false; 
    else
      this.isShowOrder = !this.isShowOrder;

    if(this.isShowOrder)
      {
          this.refresListOrder();
      }
  }

  refresListOrder():void{

      this.orderService.getAllOrderOneAccount(this.dataUser.id).subscribe((response) => {
        this.listOrderLocal = response;
      },(error) => {
        console.log(error);
      });
  }

  showOrderContent(idOrder:number):void{

    this.orderService.getOrderContent(idOrder).subscribe((response) => {
      this.contentOrderLocal = response;
      //console.log(this.contentOrderLocal[0]["Article.name"])
      this.isShowOrderContent = true;
    },(error) => {
      console.log(error);
    });

  }

  convertArticleName(row:any):string
    {
      const name : string = row["Article.name"];
      return name;
    }

  convertArticlePrice(row:any):string
    {
      const price : string = row["Article.price"];
      return price;
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
