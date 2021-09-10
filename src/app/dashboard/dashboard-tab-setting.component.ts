import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SettingService } from '../service/setting.service';

@Component({
    selector: 'app-dashboard-tab-setting',
    templateUrl: './dashboard-tab-setting.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardSettingComponent {

    settingForm: FormGroup;
    totalOrderLimitAccountDay: any ;
    dataReponse:any;

    constructor( private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private settingService: SettingService ) { } 

    ngOnInit(): void {
      this.settingService.getAllSetting().subscribe((response) => {

        this.dataReponse = response;
        
        this.settingForm = this.formBuilder.group({
          hourlimit : response.hourlimit,
          totalOrderLimitDay: response.totalOrderLimitDay,
          totalOrderLimitAccountDay: response.totalOrderLimitAccountDay,
          canPreOrder: JSON.parse(response.canPreOrder)
        });
      
      });
    }

    onSubmit():void {
      let error = false;
      let updateOk = false;

      if (!(JSON.stringify(this.dataReponse.hourlimit) === JSON.stringify(this.settingForm.value.hourlimit)))
        {
          this.settingService.putHourLimit(this.settingForm.value.hourlimit+':00').then(()=>{

            if (!updateOk){
                this._snackBar.openFromComponent(SettingSnackComponent, {
                  duration: 5 * 1000,
                });
            }
            updateOk = true;

          })
          .catch(()=>{

              this._snackBar.openFromComponent(SettingSnackErrorComponent, {
                duration: 5 * 1000,
              });
              error = true;

          });
        }

      if (!(JSON.stringify(this.dataReponse.totalOrderLimitDay) === JSON.stringify(this.settingForm.value.totalOrderLimitDay)))
        {
          this.settingService.putTotalOrderLimitDay(this.settingForm.value.totalOrderLimitDay).then(()=>{
            
            if (!updateOk){
              this._snackBar.openFromComponent(SettingSnackComponent, {
                duration: 5 * 1000,
              });
            }
            updateOk = true;

          })
          .catch(()=>{

              this._snackBar.openFromComponent(SettingSnackErrorComponent, {
                duration: 5 * 1000,
              });
              error = true;


          });
        }

      if (!(JSON.stringify(this.dataReponse.totalOrderLimitAccountDay) === JSON.stringify(this.settingForm.value.totalOrderLimitAccountDay)))
        {
          this.settingService.putTotalOrderLimitAccountPerDay(this.settingForm.value.totalOrderLimitAccountDay).then(()=>{

            if (!updateOk){
                this._snackBar.openFromComponent(SettingSnackComponent, {
                  duration: 5 * 1000,
                });
            }
            updateOk = true;

          })
          .catch(()=>{

            this._snackBar.openFromComponent(SettingSnackErrorComponent, {
              duration: 5 * 1000,
            });
            error = true;


          });
        }

      if (!(JSON.stringify(this.dataReponse.canPreOrder) === JSON.stringify(this.settingForm.value.canPreOrder)))
        {
          this.settingService.putCanPreOrder(this.settingForm.value.canPreOrder).then(()=>{

            if (!updateOk){
                this._snackBar.openFromComponent(SettingSnackComponent, {
                  duration: 5 * 1000,
                });
            }

            updateOk = true;
          })
          .catch(()=>{
            
            this._snackBar.openFromComponent(SettingSnackErrorComponent, {
              duration: 5 * 1000,
            });
            error = true;


          });
      
        }
      
    }

  }

  @Component({
    selector: 'snack-bar-app-dashboard-tab-setting',
    template: '<span> Modification prise en compte. </span>',
  })
  export class SettingSnackComponent {}

  @Component({
    selector: 'snack-error-bar-app-dashboard-tab-setting',
    template: '<span> Une erreur est survenue, veuillez réessayer ultérieurement. </span>',
  })
  export class SettingSnackErrorComponent {}