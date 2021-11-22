import { Component,OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

@Component({selector: 'pm-leave-tracker', 
templateUrl: 'leave-tracker.component.html',
styleUrls:['leave-tracker.component.css']})
export class LeaveTrackerComponent implements OnInit {
    currentDate;
    monthName
    leaveData =[];
    monthsAvailable =[];
    datesLeave;
    obj={};
    leaveObjArray = [];
    monthsNameArray = [];
    monthCounter=[];
    sampleData = [{"name":"Neethu","leaves":[{"year":"2021","September":[17,21],"October":[11,1,13],"November":[20,21],"December":[10,1,13]}]},
    {"name":"emp1","leaves":[{"November":[2,21],"December":[10,12,13],"year":"2021"}]}]
    daysInCurrentMonth;
    currentYear;
    dateForDay;
    nextDisable = "false"  
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    day;
    dayCounter=[];
    prevDisable ="false"
    nextMonthName;
    preMonthName
    constructor(private accountService: AccountService) {
            this.currentDate = new Date();
            const currentMonth = this.currentDate.getMonth() + 1;
            this.monthName = this.currentDate.toLocaleString("default", {month: "long"});
            this.daysInCurrentMonth = new Date(this.currentDate.getFullYear(), currentMonth, 0).getDate();
            this.currentYear = this.currentDate.getFullYear();
            for(var i=1;i<=this.daysInCurrentMonth;i++){
                this.monthCounter.push(i);
                this.dateForDay = new Date(this.currentYear,currentMonth-1,i).getDay();
                // var day =  this.dateForDay.getUTCDate();
                this.day = this.days[this.dateForDay]
                this.dayCounter.push(this.day);

            }                
            
    }
    ngOnInit() {
        // Called after the constructor and called  after the first ngOnChanges() 
        this.getLeaveDetails();
        if(this.monthName=='January'){
            this.prevDisable = "true";
        }
        if(this.monthName =='December'){
            this.nextDisable="true"
        }
     }
      daysInMonth (month, year) { // Use 1 for January, 2 for February, etc.
        return new Date(year, month, 0).getDate();
      }
    getLeaveDetails(){
      
        this.monthCounter=[]
        for(var i=1;i<=this.daysInCurrentMonth;i++){
            this.monthCounter.push(i);
        }     
        this.leaveObjArray = [];
        for(var i=0;i<this.sampleData.length;i++){
            console.log(this.sampleData[i].leaves);
            this.leaveData =  this.sampleData[i].leaves
            console.log(this.sampleData[i].leaves)

            console.log(this.sampleData[i].leaves[0])

            for(var j=0;j<this.sampleData[i].leaves.length;j++){
                console.log(this.monthName)
                console.log(Object.keys(this.sampleData[i].leaves[j]))
                this.monthsNameArray = Object.keys(this.sampleData[i].leaves[j])
                for(var k =0;k<this.monthsNameArray.length;k++){                    
                    if(this.monthName==this.monthsNameArray[k]){
                        this.leaveObjArray[this.sampleData[i].name]=this.sampleData[i].leaves[j][this.monthsNameArray[k]]
                    }
                }
            }                             
         
        }
    }

    nextMonth(){
        this.prevDisable ="false"
        
        this.dayCounter=[];
        for(var k=0;k<this.months.length;k++){
            
         if(this.monthName==this.months[k]){
                this.monthName=this.months[k+1]
                this.nextMonthName = this.months[k+2]
                console.log("monthName",k+1)
                this.daysInCurrentMonth =  this.daysInMonth(k+2,2021);
                console.log(this.monthName)
                for(var r =1;r<=this.daysInCurrentMonth;r++){
                    this.dateForDay = new Date(this.currentYear,k+1,r).getDay();
                    // var day =  this.dateForDay.getUTCDate();
                    this.day = this.days[this.dateForDay]
                    this.dayCounter.push(this.day);
                }
                if( this.nextMonthName==undefined) {
                    this.nextDisable ="true"
                }
                break;
            }
            
           
        }
        this.getLeaveDetails();

    }
    preMonth(){
        this.nextDisable = "false" 
        this.dayCounter=[]
        for(var k=0;k<this.months.length;k++){
            console.log(this.monthName)
            if(this.monthName==this.months[k]){
                this.monthName=this.months[k-1]
                this.preMonthName = this.months[k-2]
                console.log("month",k-1)
                this.daysInCurrentMonth = this.daysInMonth(k,2021)
                for(var r =1;r<=this.daysInCurrentMonth;r++){
                    this.dateForDay = new Date(this.currentYear,k-1,r).getDay();
                    this.day = this.days[this.dateForDay]
                    this.dayCounter.push(this.day);
                    console.log(this.day)
                }
                console.log("premonth",this.preMonthName)
                if( this.preMonthName==undefined) {
                    this.prevDisable ="true"
                }
                break;
            }
           
        }
        this.getLeaveDetails();

    }
     
    
    
}