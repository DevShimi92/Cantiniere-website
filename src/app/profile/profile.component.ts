  
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserService } from '../service/user.service';
import { User } from '../shared/models/user.model';

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
  helper = new JwtHelperService();

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.user = new User();
   }

  ngOnInit(): void {
    
    this.dataUser = JSON.parse(sessionStorage.getItem('userData'));

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



  validateEmail(email:string):boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


}
