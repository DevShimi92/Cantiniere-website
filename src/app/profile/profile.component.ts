  
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DefaultService } from '../default.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  updateForm: FormGroup;

  dataUser : any;
  errorPasswordCheck = false;
  errorEmail = false;
  errorUpdate = false;
  helper = new JwtHelperService();

  constructor(private formBuilder: FormBuilder, private defaultService: DefaultService) {
    // do nothing.
   }

  ngOnInit(): void {
    
    this.dataUser = this.helper.decodeToken(sessionStorage.getItem('token'));

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
        this.defaultService.updateUser(this.updateForm.value.id,this.updateForm.value.lastName,this.updateForm.value.firstName,this.updateForm.value.email,null).subscribe(() =>
           {
             console.log('it ok'); // Need new token here for update data
             location.reload();
           },
              (error) => 
                {
                  if(error.status == 409)
                    {
                      console.log("Certains champs n'ont pas pu être update");  
                    }
                  else
                    {
                      console.log(error); 
                    }
                }
            );
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
           this.defaultService.updateUser(this.updateForm.value.id,null,null,null,this.updateForm.value.password).subscribe((response) =>
           {
             console.log('it ok');
             location.reload();
           },
              (error) => 
                {
                  if(error.status == 409)
                    {
                      this.errorUpdate = true;
                      console.log("Certains champs n'ont pas pu être update"); 
                     }
                  else
                    {
                      console.log(error); 
                    }
                }
            );
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
