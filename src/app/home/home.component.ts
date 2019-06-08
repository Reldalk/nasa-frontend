import { Component, OnInit } from '@angular/core';
import {BaseService} from './home.service';
import {Router} from "@angular/router"
import { ThrowStmt } from '@angular/compiler';
import { TargetLocator } from 'selenium-webdriver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  calander;
  startMonth;
  startYear;
  currentMonth;
  currentYear;
  years = [2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1999,1998,1997,1996,1995];
  currentPictureDate;
  months;
  currentSelectMonthIndex;
  currentSelectYearIndex;
  currentPicture = null;

  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  currentMonthToYear = [];
  firstMonthToYear = ["June", "July", "August", "September", "October", "November", "December"];
  constructor(private _baseService: BaseService, private router: Router) { }

  
  changeMonthClick(){
    const monthLabel = document.getElementsByClassName('month')[0] as HTMLLabelElement;
    const monthSelect = document.getElementsByClassName('monthSelect')[0] as HTMLSelectElement;
    const arrowMonth = document.getElementsByClassName('arrowMonth')[0] as HTMLButtonElement;
    arrowMonth.style.display = "none";
    monthSelect.selectedIndex = this.currentSelectMonthIndex;
    console.log(this.currentSelectMonthIndex);
    monthSelect.style.display = 'block';
    monthLabel.style.display = "none";
  }

  changeYearClick(){
    const yearLabel = document.getElementsByClassName('year')[0] as HTMLLabelElement;
    const yearSelect = document.getElementsByClassName('yearSelect')[0] as HTMLSelectElement;
    const arrowYear = document.getElementsByClassName('arrowYear')[0] as HTMLButtonElement;
    arrowYear.style.display = "none";
    yearSelect.style.display = 'block';
    yearSelect.selectedIndex = this.currentSelectYearIndex;
    yearLabel.style.display = "none";
  }

  onMonthChange(event){
    this.currentMonth = event.currentTarget.value;
    this.currentSelectMonthIndex = this.currentMonth;
    console.log(this.currentMonth)
    let date;
    if(this.currentYear == '1995'){
      this.currentMonth = parseInt(this.currentMonth) + 5;
    }
    date = new Date(this.currentYear, this.currentMonth);
    this.getDateInfo(date);
    const monthLabel = document.getElementsByClassName('month')[0] as HTMLLabelElement;
    const monthSelect = document.getElementsByClassName('monthSelect')[0] as HTMLSelectElement;
    const arrowMonth = document.getElementsByClassName('arrowMonth')[0] as HTMLButtonElement;
    arrowMonth.style.display = "block";
    monthLabel.style.display = "block";
    monthSelect.style.display = "none";
  }

  onYearChange(event){
    this.currentYear = event.currentTarget.value;
    this.currentSelectYearIndex = 2019 - parseInt(this.currentYear);
    if(event.currentTarget.value === '1995'){
      this.months = this.firstMonthToYear;
      if(this.currentMonth < 6){
        this.currentMonth = 6;
      }
    }
    else if(event.currentTarget.value == '2019'){
      this.months = this.currentMonthToYear
      if(this.currentMonth > this.currentMonthToYear.length){
        this.currentMonth = this.currentMonthToYear.length;
      }
    }
    else{
      this.months = this.monthNames;
    }
    this.prevNextVisibility();
    let date = new Date(this.currentYear, (this.currentMonth - 1));
    this.getDateInfo(date);
    const yearLabel = document.getElementsByClassName('year')[0] as HTMLLabelElement;
    const yearSelect = document.getElementsByClassName('yearSelect')[0] as HTMLSelectElement;
    const arrowYear = document.getElementsByClassName('arrowYear')[0] as HTMLButtonElement;
    arrowYear.style.display = "block";
    yearLabel.style.display = "block";
    yearSelect.style.display = "none";
  }

  returnTotalDays(dayOne, dayTwo){
    return dayOne > dayTwo ? (dayOne - dayTwo) + 28 : (dayTwo - dayOne) + 28;
  }

  setupMonthArray(monthObj, totalDays){
    let array = new Array(totalDays);
    for(let i = 0; i < monthObj.length; i++){
      let position = parseInt(monthObj[i].date.charAt(8) + monthObj[i].date.charAt(9)) - 1;
      array[position] = monthObj[i];
      array[position]['style'] = 'dayBox cursor';
    }
    for(let i = 0; i < totalDays; i++){
      if(!array[i]){
        array[i] = {
          copyright: null,
          explanation: null,
          hrurl: null,
          title: null,
          url: null,
          thumbnail: '',
          style: 'dayBox'
        };
      }
    }
    return array;
  }

  fillMonthArray(dayCounter, objArray){
    let array = [];
    let j = -1;
    const emptyObject = {
      copyright: null,
      explanation: null,
      hrurl: null,
      title: null,
      url: null,
      style: 'emptyBox'
    };
    if(dayCounter){
      array.push([]);
      j = 0;
      for(let i = 0; i < dayCounter; i++){
        array[j].push(emptyObject);
      }
    }
    for(let i = 0; i < objArray.length; i++){
      if((dayCounter%7) === 0){
        array.push([]);
        j++;
      }
      dayCounter++;
      objArray[i]['day'] = i + 1;
      array[j].push(objArray[i]);
    }
    for(let i = array[j].length; i < 7; i++){
      array[j].push(emptyObject)
    }
    this.calander = array;
  }

  exit(){
    this.switchVisibility();
    this.currentPicture = "";
    this.currentPictureDate = "";
  }

  async getDateInfo(date){
    this.currentYear = date.getFullYear();
    this.currentMonth = date.getMonth() + 1;
    const totalDays = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const start = (this.currentYear + '-' + this.currentMonth  + '-' + '1');
    const end = (this.currentYear + '-' + this.currentMonth  + '-' + totalDays);

    let monthObj;
    await this._baseService.populateMonthArray(start, end)
    .toPromise()
    .then(res => {
      monthObj = res;
    })

    const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    const arrayRef = this.setupMonthArray(monthObj, totalDays);
    this.fillMonthArray(firstDay, arrayRef);
  }

  toggleSelectVisibility(){
    const yearLabel = document.getElementsByClassName('year')[0] as HTMLLabelElement;
    if(yearLabel.style.display === "none"){
      const yearSelect = document.getElementsByClassName('yearSelect')[0] as HTMLSelectElement;
      const arrowYear = document.getElementsByClassName('arrowYear')[0] as HTMLButtonElement;
      arrowYear.style.display = "block";
      yearLabel.style.display = "block";
      yearSelect.style.display = "none";
    }
    const monthLabel = document.getElementsByClassName('month')[0] as HTMLLabelElement;
    if(monthLabel.style.display === "none"){
      const monthSelect = document.getElementsByClassName('monthSelect')[0] as HTMLSelectElement;
      const arrowMonth = document.getElementsByClassName('arrowMonth')[0] as HTMLButtonElement;
      monthLabel.style.display = "block";
      arrowMonth.style.display = "block";
      monthSelect.style.display = 'none';
    }
  }
  nextMonth(){
    this.currentSelectMonthIndex += 1;
    if(this.currentMonth === 12){
      this.currentMonth = 0;
      this.currentYear += 1;
      this.currentSelectYearIndex -= 1;
      this.currentSelectMonthIndex = 0;
      if(this.currentYear === this.startYear){
        this.months = this.currentMonthToYear;
      }
      else if(this.currentYear === 1996){
        this.months = this.monthNames;
      }
    }
    this.toggleSelectVisibility();
    const date = new Date(this.currentYear, this.currentMonth);
    this.getDateInfo(date);
    this.prevNextVisibility();
  }
  prevNextVisibility(){
    const nextButton = document.getElementsByClassName('nextButton')[0] as HTMLButtonElement;
    const previousButton = document.getElementsByClassName('previousButton')[0] as HTMLButtonElement;
    nextButton.style.visibility = "visible";
    previousButton.style.visibility = "visible";
    if(this.currentMonth == this.startMonth && this.currentYear == this.startYear){
      nextButton.style.visibility = 'hidden';
    }
    else if(this.currentMonth == 6 && this.currentYear == '1995'){
      previousButton.style.visibility = 'hidden';
    }
  }

  previousMonth(){
    const nextButton = document.getElementsByClassName('nextButton')[0] as HTMLButtonElement;
    nextButton.style.visibility = 'visible';
    this.toggleSelectVisibility();
    this.currentSelectMonthIndex -= 1;
    if(this.currentMonth === 1){
      if(this.currentYear === this.startYear){
        this.months = this.monthNames;
      }
      else if(this.currentYear === 1996){
        this.months = this.firstMonthToYear;
      }
      this.currentYear = this.currentYear - 1;
      this.currentMonth = 12;
      this.currentSelectYearIndex += 1;
      this.currentSelectMonthIndex = 11;
    }
    else{
      this.currentMonth = this.currentMonth - 1;
    }
    const date = new Date(this.currentYear, this.currentMonth - 1);
    this.prevNextVisibility();
    this.getDateInfo(date);
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
    const arrayPositions = this.getArrayPositions(pictureElement.id);
    this.currentPicture = this.calander[arrayPositions[0]][arrayPositions[1]];
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
    let date = new Date();
    this.startYear = date.getFullYear();
    this.startMonth = date.getMonth() + 1;
    for(let i = 0; i < this.startMonth; i++){
      this.currentMonthToYear.push(this.monthNames[i]);
    }
    this.currentSelectMonthIndex = this.startMonth - 1;
    this.currentSelectYearIndex = 0;
    this.months = this.currentMonthToYear;
    this.getDateInfo(date);
    this.bindEventListener();
  }
}
