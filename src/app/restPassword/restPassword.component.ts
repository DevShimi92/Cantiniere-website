  
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { interval } from 'rxjs';
import { switchMap } from "rxjs/operators";


import { AuthService } from '../service/auth.service'


@Component({
  selector: 'app-restPassword',
  templateUrl: './restPassword.component.html',
  styleUrls: ['./restPassword.component.css'],
})
export class RestPasswordComponent implements OnInit {

  token: string;
  tokenExpired = false;
  error = false;
  done = false;
  restPasswordForm: FormGroup;
  private helper = new JwtHelperService();


  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private authService: AuthService ) {
   // do nothing.
 }

  ngOnInit(): void {

    this.restPasswordForm = this.formBuilder.group({
      password: '',
      checkPassword: ''
    });

    this.token = this.route.snapshot.paramMap.get('token');

    const dataUser = this.helper.decodeToken(this.token);
    const expToken = new Date(0);
    expToken.setUTCSeconds(dataUser.exp);
    const timeInMsc = new Date(expToken).getTime() - new Date().getTime();

    if(timeInMsc < 0)
      {
        this.tokenExpired = true;
      }
  }

  onSubmit(): void {
    
    if(this.restPasswordForm.value.password == this.restPasswordForm.value.checkPassword && this.restPasswordForm.value.password != '')
      {
        this.error = false;

        this.authService.restPassword(this.restPasswordForm.value.password, this.token).then(() => {
            this.done = true;

            interval(5000).pipe(switchMap(async () => this.router.navigate(['home']) )).subscribe();

        }).catch((error) => {
          console.log(error);
        });
      }
    else
      {
        this.error = true;
      }
  }
}
