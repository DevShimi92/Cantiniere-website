import { Component, OnInit} from '@angular/core';
import { Dialogs } from "@nativescript/core";
import { setString } from "@nativescript/core/application-settings";
import { RouterExtensions } from "@nativescript/angular";


import { User } from '../shared/models/user.model';
import { AuthService } from '../service/auth.service.tns';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.tns.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  public isLoggingIn = true;
  public isforgotPassword = true;
  public confirmedPassword = '';
  public user : User;
  
  private acountExistOptions = {
    title: 'Compte exsitant',
    message: 'Cet email existe déja dans notre base de donnée, avez vous oublié votre mot de passe ?',
    okButtonText: 'Oui',
    cancelButtonText: 'Non',
    cancelable: true
  }

  constructor(private routerExtensions: RouterExtensions, private userService: UserService, private authService: AuthService) {
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

  toggleFormForgotPassword() {
    this.isforgotPassword = !this.isforgotPassword;
  }

  submit():void {

    if(!this.isforgotPassword)
      {
        this.forgotPassword();
      }
    else if (this.isLoggingIn) {
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
                  okButtonText: "OK",
                  cancelable: true
                }).then(()=> {
                    console.log("Mot de passe manqnaut pour l'inscription ");
                });
              }
            else if(this.user.password == this.confirmedPassword)
              {

                this.userService.createUser(this.user).then(() => {

                  this.routerExtensions.navigate(["/home"], { clearHistory: true });

                })
                .catch((error) => {

                  if(error.status == 409)
                        {
                          console.log("L'email utilisé pour l'enregistrement est déja exsitant dans la base de donnée. Demmande de réinitialisation de mot de passe...")
                          Dialogs.confirm(this.acountExistOptions).then(result => {
                            if( result == true )
                              {
                                  console.log('Vers la page de restoration de mdp...');
                              }
                            else
                              {
                                console.log("L'utilisateur n'a pas voulu tenté de réinitialiser son mot de passe")
                              }
                          });
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
                  message: "Le mot de passe et la confirmation de mot de passe entrées sont différents ",
                  okButtonText: "OK",
                  cancelable: true
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
              okButtonText: "OK",
              cancelable: true
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
          okButtonText: "OK",
          cancelable: true
        }).then(()=> {
            console.log("Nom et prénom manquant pour l'inscription");
        });
      }

  }


  login(): void {

    if (this.user.email != '' && this.user.password != '' )
      {
        this.authService.login(this.user.email,this.user.password).then(() =>
        {
            this.routerExtensions.navigate(["/home"], { clearHistory: true });

        }).catch((error) => {
          if(error.status == 401)
            {
              console.log("Erreur dans login : ");
              console.log(error);
              Dialogs.alert({
                title: "Erreur",
                message: "Identifiant incorrect",
                okButtonText: "OK",
                cancelable: true
            });
            }
          else
            {
              Dialogs.alert({
                title: "Erreur",
                message: "Erreur inattendu avec le serveur, veuillez réessayer plus tard .",
                okButtonText: "OK",
                cancelable: true
              });
            }

        });

      }
    else
    {
      Dialogs.alert({
        title: "Erreur",
        message: "Email ou Mot de passe manquant",
        okButtonText: "OK",
        cancelable: true
      }).then(()=> {
          console.log("Email ou Mot de passe manquant dans login");
      });
    }
  }

  forgotPassword(): void {
    
    if(this.validateEmail(this.user.email) && this.user.email != '')
      {
        this.authService.forgotPassword(this.user.email).then(() => {

          Dialogs.alert({
            title: "Email envoyé ",
            message: "Un email de réinitiation de mot de passe à été envoyé à l'adresse indiqué.",
            okButtonText: "OK",
            cancelable: true
          }).then(()=> {
              console.log("Tentative envoié pour : "+this.user.email);
          });

        }).catch((error) => {

          Dialogs.alert({
            title: "Erreur inattentdu ",
            message: "Une erreur s'est produit durant l'opération (code "+error.status+" )",
            okButtonText: "OK",
            cancelable: true
          }).then(()=> {
              console.log("Erreur inattentdu : ");
              console.log(error);
          });

        })
      }
    else
      {
        Dialogs.alert({
          title: "Erreur",
          message: "Il nous faut le email utilisé sur votre compte pour vous envoyer un email de réinitiation de mot de passe !",
          okButtonText: "OK",
          cancelable: true
        }).then(()=> {
            console.log("Email manqnaut ou invalide pour la réinitiation de mot de passe ");
        });
      }
  }
  
  validateEmail(email:string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}

