  
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatDialog , MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';


import { UserService } from '../service/user.service';
import { OrderService } from '../service/order.service';
import { AuthService } from '../service/auth.service';
import { User } from '../shared/models/user.model';

export interface DialogData {
  
  idOrder: number;
  total: number;
  data;

  name: string;
  listTypeArticle: string;
  value:string;
  
  
  code_type: number;
  SetNewSolde: boolean;
  FormDialogTypeArticle: number;
  FormDialogArticle: number;
  FormDialogMenu: number;
  erreur:boolean;

}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  user : User;
  updateForm: FormGroup;
  dataUser : User;
  errorPasswordCheck = false;
  errorEmail = false;
  errorUpdate = false;
  foundOrderForThisUser = false; 
  helper = new JwtHelperService();
  
  dataSource;
  ListOrderLength = 0;
  displayedColumnsListOrder: string[] = ['id','createdAt','total','done','show'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor( public dialog: MatDialog, private formBuilder: FormBuilder, private userService: UserService, private orderService: OrderService, private authService: AuthService) {
    this.user = new User();
   }

  ngOnInit(): void {

    this.authService.refreshToken();
    
    this.dataUser = JSON.parse(sessionStorage.getItem('userData'));

    this.orderService.getAllOrderOneAccount(this.dataUser.id).subscribe((response) => {
        if(response){
            this.ListOrderLength = response.length;
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.foundOrderForThisUser = true;
          }
    });

    this.updateForm = this.formBuilder.group({
      id : this.dataUser.id,
      lastName: this.dataUser.last_name,
      firstName: this.dataUser.first_name,
      email: this.dataUser.email,
      password: '',
      checkPassword: ''
    });

  }

  onSubmit():void {

    if (( this.updateForm.value.lastName != this.dataUser.last_name ) || ( this.updateForm.value.firstName != this.dataUser.first_name ) ||
    ( this.updateForm.value.email != this.dataUser.email ) && (this.validateEmail(this.updateForm.value.email)) )
      {
        this.errorEmail = false ;

        this.user.id = this.dataUser.id;
        this.user.last_name = this.updateForm.value.lastName;
        this.user.first_name = this.updateForm.value.firstName;
        this.user.email = this.updateForm.value.email;

        this.userService.updateUser(this.user).then(() => {
          location.reload();
        }).catch((error) => {
          if(error.status == 409)
              {
                console.log("Certains champs n'ont pas pu être update");  
              }
            else
              {
                console.log(error); 
              }
        });

      }
    else if (!this.validateEmail(this.updateForm.value.email))
      {
        this.errorEmail = true ;
      }

    if(this.updateForm.value.password != '')
      {
        if(this.updateForm.value.password == this.updateForm.value.checkPassword)
          {
           this.errorUpdate = false;
           this.errorPasswordCheck = false;

           this.user.id = this.dataUser.id;
           this.user.password = this.updateForm.value.password;

            this.userService.updateUser(this.user).then(() => {
              location.reload();
              })
              .catch((error) => {
                if(error.status == 409)
                    {
                      this.errorUpdate = true;
                      console.log("Certains champs n'ont pas pu être update");  
                    }
                  else
                    {
                      console.log(error); 
                    }
                });
            }
        else
          {
            this.errorPasswordCheck = true;
          }
      }
  }


  convertDate(dateISOstring:string):string{
    const dateOrder = new Date(dateISOstring);
    return dateOrder.toLocaleString();
  }

  orderContent(idOrder:number,priceTotal:number):void{

    this.orderService.getOrderContent(idOrder).subscribe((response) => {

      this.dialog.open(ProfileDialogComponent,{
        data: { idOrder : idOrder, total: priceTotal, data : response }
      });

    });

  }



  validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }



}


@Component({
  selector: 'app-profile-dialog',
  templateUrl: 'profile.component-dialog.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileDialogComponent implements OnInit{
  
  displayedColumnsDialog: string[] = ['name','price'];
  dataSource;

  constructor( public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit(): void {

      this.dataSource = new MatTableDataSource(this.data.data); 

    }

}
