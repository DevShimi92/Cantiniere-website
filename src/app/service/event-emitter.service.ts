import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    
import { Observable, Subject  } from 'rxjs';

@Injectable({    
  providedIn: 'root'    
})    
export class EventEmitterService { 
  
  private emitChangeSource = new Subject<any>();
    
  changeEmitted$ = this.emitChangeSource.asObservable();

  invokeCheckListUser = new EventEmitter();    
  invokeRestTabEditFood = new EventEmitter();
  invokeOpenLogin = new EventEmitter();  

  subsVarUser: Subscription; 
  subsVarTabEditFood: Subscription;  
  subsVarOpenLogin: Subscription;  
    
  emitChange():void{
    this.emitChangeSource.next();
  }

  onCallCheckListUser():void {    
    this.invokeCheckListUser.emit();    
  }  

  onCallRestTabEditFood():void {    
    this.invokeRestTabEditFood.emit();    
  }  

  onCallOpenLogin():void{
    this.invokeOpenLogin.emit(); 
  }
}   