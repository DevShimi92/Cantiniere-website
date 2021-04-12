import { Component, OnInit} from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { getString } from "@nativescript/core/application-settings";
import { Dialogs } from "@nativescript/core";

import { User } from '../shared/models/user.model';
import { DefaultService } from '../default.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.tns.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
  dataUser : any;
  checkPassaword : string;
  helper = new JwtHelperService();
  public user : User;

  constructor( private defaultService: DefaultService ) {
    this.user = new User();
  }


  ngOnInit(): void {
    
    this.dataUser = this.helper.decodeToken(getString("token"));
    this.user.last_name = this.dataUser.last_name; 
    this.user.first_name = this.dataUser.first_name; 
    this.user.email = this.dataUser.email; 
    this.user.password = '';
  }

  submit():void {
    
    if ((this.dataUser.last_name != this.user.last_name) || (this.dataUser.first_name != this.user.first_name) || (this.dataUser.email != this.user.email) )
      {
        this.defaultService.updateUser(this.dataUser.id, this.user.last_name, this.user.first_name, this.user.email).subscribe((response) => 
                        {
                          Dialogs.alert({
                            title: "Information",
                            message: "Profile mise à jour !",
                            okButtonText: "OK",
                            cancelable: true
                          }).then(()=> {
                            console.log('Update profile résussi');
                          });
                          
                        },
                      (error) => 
                        {
                          if(error.status == 409)
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
                          else
                          {
                            console.log(error);
                          }
                        }
                    );
      }
    if (this.user.password)
      {
        if (this.user.password == this.checkPassaword)
          {
            this.defaultService.updateUser(this.dataUser.id, null, null, null, this.user.password).subscribe((response) => 
                    {
                      Dialogs.alert({
                        title: "Information",
                        message: "Profile mise à jour !",
                        okButtonText: "OK",
                        cancelable: true
                      }).then(()=> {
                        console.log('Update profile résussi');
                      });
                      
                    },
                  (error) => 
                    {
                      if(error.status == 409)
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
              message: "Le mot de passe de confirmation est différent du mot de pasee défini",
              okButtonText: "OK",
              cancelable: true
            }).then(()=> {
                console.log("Le mot de passe de confirmation est différent du mot de pasee défini");
            });
          }
      }

  }




}
