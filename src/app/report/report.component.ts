  
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ReportService } from '../service/report.service'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  
  reportForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private router: Router, private reportService: ReportService) {
   // do nothing.
 }

  ngOnInit(): void {
    this.reportForm = this.formBuilder.group({
      sujet:'',
      message:''
    });
  }

  onSubmit(): void{
    if(this.reportForm.value.message)
    {
      this.reportService.sendReport(this.reportForm.value.sujet, this.reportForm.value.message).then(() => {

        const snackBarRef = this._snackBar.openFromComponent(ReportSnackComponent, {
          duration: 10 * 1000,
        });

        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigate([""]);
        });


      }).catch((error) => {

      this._snackBar.openFromComponent(ReportSnackErrorComponent, {
        data: error.status,
        duration: 10 * 1000,
      });

      });
      
    }
    else
    {
      this._snackBar.openFromComponent(ReportSnackEmptyComponent, {
        duration: 10 * 1000,
      });
    }
    
  }
}

@Component({
  selector: 'snack-bar-app-report',
  template: '<span> Votre message a bien été envoyé ! </span>',
})
export class ReportSnackComponent {}

@Component({
  selector: 'snack-bar-empty-app-report',
  template: '<span> Votre message est vide !</span>',
})
export class ReportSnackEmptyComponent {}

@Component({
  selector: 'snack-error-bar-app-report',
  template: '<span> Une erreur est survenue ! (code : {{ data }}) </span>',
})
export class ReportSnackErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}