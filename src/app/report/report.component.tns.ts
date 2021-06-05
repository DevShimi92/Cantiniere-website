import { Component, OnInit} from '@angular/core';
import { Dialogs } from "@nativescript/core";

import { ReportService } from '../service/report.service'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  
  reportSubject = '';
  reportMessage: string

  constructor(private reportService: ReportService) {
   // do nothing.
  }


  ngOnInit(): void {
    // do nothing
  }

  submit():void {

    this.reportService.sendReport(this.reportSubject,this.reportMessage).then(() => {

      Dialogs.alert({
        title: "Information",
        message: "Message bien envoyé !",
        okButtonText: "OK",
        cancelable: true
      }).then(()=> {
        console.log('Message de support bien envoyé');
      });
          
    }).catch((error) => {

      Dialogs.alert({
        title: "Erreur",
        message: "Une erreur est survenue ! ("+error.status+") ",
        okButtonText: "OK",
        cancelable: true
      }).then(()=> {
          console.log("Une erreur est survenue : ");
          console.log(error);
      });

    });
  }

}
