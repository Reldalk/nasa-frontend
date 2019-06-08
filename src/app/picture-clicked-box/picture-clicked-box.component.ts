import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router"

@Component({
  selector: 'picture-clicked-box',
  templateUrl: './picture-clicked-box.component.html',
  styleUrls: ['./picture-clicked-box.component.scss']
})
export class PictureClickedBoxComponent implements OnInit {
  currentPictureDate;
  
  @Input()currentPicture;
  @Output() toExit = new EventEmitter();

  constructor(private router: Router) { }
  
  onExit(){
    this.toExit.emit();
  }

  searchClick(buttonElement){
    const string = (buttonElement.currentTarget.previousSibling.value.trim());
    if(string.length > 0){
      this.router.navigate(['search', {searchQuery: string}]);
    } 
  }
  ngOnInit() {
    const tempDate = new Date(this.currentPicture.date);
    tempDate.setDate(tempDate.getDate() + 1);
    this.currentPictureDate = 
    (tempDate.getMonth() + 1) + '-' +
    (tempDate.getDate()) + '-' +
    tempDate.getFullYear()
  }
  

}
