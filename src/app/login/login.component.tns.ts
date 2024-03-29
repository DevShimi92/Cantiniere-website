import { Component } from '@angular/core';
import { Dialogs } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";


import { User } from '../shared/models/user.model';
import { AuthService } from '../service/auth.service.tns';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.tns.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  public isLoggingIn = true;
  public isforgotPassword = true;
  public confirmedPassword = '';
  public user : User;
  
  private acountExistOptions = {
    title: 'Compte existant',
    message: 'Cet email existe déjà dans notre base de données. Avez-vous oublié votre mot de passe ?',
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

  toggleForm():void {
    this.isLoggingIn = !this.isLoggingIn;
  }

  toggleFormForgotPassword():void {
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
            console.log(this.user.password)
            console.log(this.validatePassword(this.user.password))
            if(this.user.password =='' )
              {
                Dialogs.alert({
                  title: "Erreur",
                  message: "Il vous faut un mot de passe pour vous connecter ! ",
                  okButtonText: "OK",
                  cancelable: true
                }).then(()=> {
                    console.log("Mot de passe manqnaut pour l'inscription ");
                });
              }
            else if(!this.validatePassword(this.user.password))
              {
                Dialogs.alert({
                  title: "Erreur",
                  message: "Votre mot de passe doit contenir au moins un chiffre, une lettre majuscule et minuscule et un caractère spéciale",
                  okButtonText: "OK",
                  cancelable: true
                }).then(()=> {
                    console.log("Mot de passe non sécurisé !");
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
                            if(result)
                              {
                                  this.toggleFormForgotPassword();
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
                  message: "Le mot de passe et la confirmation de mot de passe entrés sont différents ",
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
            message: "Un email de réinitialisation de mot de passe a été envoyé à l'adresse indiquée.",
            okButtonText: "OK",
            cancelable: true
          }).then(()=> {
              console.log("Tentative envoyé pour : "+this.user.email);
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
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword(password:string): boolean {
    const re = /^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\d]))(?=(.*[!@#$%^&*()\-__+.]){+}).{8,}$/;
    return re.test(password);
  }
}

