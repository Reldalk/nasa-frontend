import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router"

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input()showSearchBar : boolean;
  constructor(private router: Router) { }

  searchClick(buttonElement){
    const string = (buttonElement.currentTarget.previousSibling.value.trim());
    if(string.length > 0){
      this.router.navigate(['search', {searchQuery: string}]);
    } 
  }

  ngOnInit() {

  }

}
