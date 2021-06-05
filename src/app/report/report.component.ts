  
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../service/report.service'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  
  reportForm: FormGroup;
  errorReport = false;
  sendReport = false;
  errorReportMsg = '';

  constructor(private formBuilder: FormBuilder, private reportService: ReportService) {
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
      this.errorReport = false;
      this.reportService.sendReport(this.reportForm.value.sujet, this.reportForm.value.message).then(() => {
          
        this.sendReport = true;

      }).catch((error) => {

      this.errorReport = true;
      this.errorReportMsg = 'Une erreur est survenue ! (code : '+error.status+' )';

      });
      
    }
    else
    {
      this.errorReport = true;
      this.errorReportMsg = 'Votre message est vide !';
    }
    
  }
}
