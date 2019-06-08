import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import {ActivatedRoute, Router} from "@angular/router"
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query;
  offset;
  searchResults;
  currentPicture;
  currentPictureDate;
  count;
  viewingNumber;
  constructor(private _searchService: SearchService,
     private router: Router,
     private route: ActivatedRoute) { }

  nextButton(){
    const previousButton = document.getElementsByClassName('previousButton')[0] as HTMLButtonElement;
    previousButton.style.visibility = 'visible';
    this.offset += 35;
    this.viewingNumber += 35;
    this.searchClick();
  }

  previousButton(){
    this.offset -= 35;
    this.viewingNumber -= 35;
    if(this.offset === 0){
      const previousButton = document.getElementsByClassName('previousButton')[0] as HTMLButtonElement;
      previousButton.style.visibility = 'hidden';
    }
    this.searchClick();
  }

  switchVisibility(){
    const pictureBox = document.getElementsByClassName('pictureClickBox')[0] as HTMLDivElement;
    const blockOverlay = document.getElementsByClassName('block')[0] as HTMLDivElement;
    if(pictureBox.style.visibility === 'visible'){
      blockOverlay.style.display = 'none';
      pictureBox.style.visibility = "hidden";
    }
    else{
      blockOverlay.style.display = 'block';
      pictureBox.style.visibility = "visible";
    }
  }

  getArrayPositions(idString){
    let array = new Array(2);
    array[0] = parseInt(idString.charAt(0));
    array[1] = parseInt(idString.charAt(1));
    return array;
  }

  pictureClick(event){
    this.switchVisibility();
    const pictureElement = event.currentTarget as HTMLDivElement;
    this.currentPicture = this.searchResults[pictureElement.id];
    const tempDate = new Date(this.currentPicture.date);
    tempDate.setDate(tempDate.getDate() + 1);
    this.currentPictureDate = 
    (tempDate.getMonth() + 1) + '-' +
    (tempDate.getDate()) + '-' +
    tempDate.getFullYear()
  }

  exit(){
    this.switchVisibility();
    this.currentPicture = "";
  }


  async populateArray(performCount){
    if(this.query){
      await this._searchService.populateSearchArray(this.query, this.offset)
      .toPromise()
      .then(res => {
        this.searchResults = res;
        this.searchResults = this.searchResults.rows;
      });
      if(performCount){
        await this._searchService.getCount(this.query)
        .toPromise()
        .then(res => {
          this.count = res;
        });
      }
      const button = document.getElementsByClassName('nextButton')[0] as HTMLButtonElement;
      if(this.searchResults.length === 35){
        button.style.visibility = 'visible';
      }
      else{
        button.style.visibility = 'hidden';
      }
    }
  }

  pictureSearchClick(){
    const searchText = document.getElementsByClassName('pictureSearchBox')[0] as HTMLInputElement;
    const string = searchText.value.trim();
    if(string.length > 0){
      this.query = string;
      this.switchVisibility();
      const searchBar = document.getElementsByClassName('searchBar')[0] as HTMLInputElement;
      searchBar.value = string;
      this.viewingNumber = 0;
      this.populateArray(true);
    } 
  }

  async searchClick(){
    let performCount = false;
    const searchBar = document.getElementsByClassName('searchBar')[0] as HTMLInputElement;
    if(searchBar.value !== this.query){
      this.offset = 0;
      this.viewingNumber = 0;
      performCount = true;
      const previousButton = document.getElementsByClassName('previousButton')[0] as HTMLButtonElement;
      previousButton.style.visibility = "hidden";
      this.query = searchBar.value;
      this.populateArray(performCount);
    }
    else{
      this.populateArray(performCount);
    }
  }

  bindEventListener(){
    let blockOverlay = document.getElementsByClassName('block')[0] as HTMLDivElement;
    const pictureBox = document.getElementsByClassName('pictureClickBox')[0] as HTMLDivElement;
    document.addEventListener('click', function pictureBoxEvent(event){
      const target = event.target as HTMLDivElement;
      if(target === blockOverlay){
        pictureBox.style.visibility = "hidden";
        blockOverlay.style.display = "none";
      }
      return;
    });
  }

  ngOnInit() {
    this.query = this.route.snapshot.paramMap.get('searchQuery');
    this.bindEventListener();
    if(this.query){
      this.offset=0;
      this.viewingNumber = 0;
      const searchBar = document.getElementsByClassName('searchBar')[0] as HTMLInputElement;
      searchBar.value = this.query;
      this.populateArray(true);
    }
  }

}
