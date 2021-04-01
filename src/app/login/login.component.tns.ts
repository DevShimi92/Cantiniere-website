import { Component, OnInit} from '@angular/core';
import { Dialogs } from "@nativescript/core";
import { setString } from "@nativescript/core/application-settings";
import { RouterExtensions } from "@nativescript/angular";


import { User } from '../shared/models/user.model';
import { DefaultService } from '../default.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.tns.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public user : User;

  constructor(private routerExtensions: RouterExtensions, private defaultService: DefaultService) {
    this.user = new User();
    this.user.email = '';
    this.user.password = '';
  }


  ngOnInit(): void {
    // do nothing
  }

  submit(): void {

    if (this.user.email != '' && this.user.password != '' )
      {
        this.defaultService.getToken(this.user.email,this.user.password).subscribe((response) => 
              {
                setString("token", response.token);
                this.routerExtensions.navigate(["/home"], { clearHistory: true });
              },
            (error) => 
              {
                if(error.status == 401)
                {
                  Dialogs.alert({
                    title: "Erreur",
                    message: "Identifiant incorrect",
                    okButtonText: "OK"
                }).then(()=> {
                    console.log("Erreur 401 dans login");
                });
                
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
      Dialogs.alert({
        title: "Erreur",
        message: "Email ou Mot de passe manquant",
        okButtonText: "OK"
    }).then(()=> {
        console.log("Email ou Mot de passe manquant dans login");
    });
    }
  }

}
