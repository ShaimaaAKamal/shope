import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

interface PopScreenInterface{
 headerLabel:string,
 btnLabel:string,
 hideCancalBtn:boolean
}
@Component({
  selector: 'app-pop-screen',
  standalone: false,
  templateUrl: './pop-screen.component.html',
  styleUrl: './pop-screen.component.scss'
})
export class PopScreenComponent {
@Input() PopScreenComponentData:PopScreenInterface={
  headerLabel:'',
  btnLabel:'',
  hideCancalBtn:false
}
@Output() doneChange=new EventEmitter<boolean>();
@Output() closeChange=new EventEmitter<boolean>();
@ViewChild('popScreen') popScreen!:ElementRef;

togglePopScreen(key:string){
this.popScreen.nativeElement.classList.toggle('d-none');
if(key == 'close') this.closeChange.emit(true);
}
done(){
  this.doneChange.emit(true);
}
}
