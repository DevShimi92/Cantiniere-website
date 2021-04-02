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

  public isLoggingIn = true;
  public confirmedPassword = '';
  public user : User;
  

  constructor(private routerExtensions: RouterExtensions, private defaultService: DefaultService) {
    this.user = new User();
    this.user.last_name = '';
    this.user.first_name = '';
    this.user.email = '';
    this.user.password = '';
  }


  ngOnInit(): void {
    // do nothing
  }

  toggleForm() {
    this.isLoggingIn = !this.isLoggingIn;
  }

  submit():void {
    //check ici

    if (this.isLoggingIn) {
        this.login();
    } else {
        this.register();
    }
  }

  register(): void {
    
    if (this.user.last_name != '' && this.user.first_name != '' )
      {

        if(this.validateEmail(this.user.email) && this.user.email != '')
          {
            if(this.user.password =='' )
              {
                Dialogs.alert({
                  title: "Erreur",
                  message: "Il vous faut un mot de passe pour vous connectez ! ",
                  okButtonText: "OK"
                }).then(()=> {
                    console.log("Mot de passe manqnaut pour l'inscription ");
                });
              }
            else if(this.user.password == this.confirmedPassword)
              {
                this.defaultService.register(this.user.last_name, this.user.first_name, this.user.email, this.user.password).subscribe((response) => 
                      {
                          setString("token", response.token);
                          this.routerExtensions.navigate(["/home"], { clearHistory: true });
                      },
                    (error) => 
                      {
                          console.log(error); 
                      }
                  );
              }
            else
              {
                Dialogs.alert({
                  title: "Erreur",
                  message: "Le mot de passe et la confirmation de mot de passe entrées sont différents ",
                  okButtonText: "OK"
                }).then(()=> {
                    console.log("Le Mot de passe normal et de confirmation sont différente pour l'inscription ");
                });
              }
          }
        else
          {
            Dialogs.alert({
              title: "Erreur",
              message: "Email manquant ou invalide",
              okButtonText: "OK"
            }).then(()=> {
                console.log("Email manquant ou invalide pour l'inscription");
            });
          }

      }
    else
      {
        Dialogs.alert({
          title: "Erreur",
          message: "Nom et prénom nécessaire pour l'inscription",
          okButtonText: "OK"
        }).then(()=> {
            console.log("Nom et prénom manquant pour l'inscription");
        });
      }

  }


  login(): void {

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

  validateEmail(email:string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}

