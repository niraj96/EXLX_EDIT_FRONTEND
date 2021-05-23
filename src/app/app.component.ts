import { Component } from '@angular/core';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'frontend';
  fileList: File [] = [];
  jsonData:any = [];

  sheetOtions: Array<any> = [];
  subSheetOtions: Array<any> = [];
  fieldOtions: Array<any> = [];

  selectedSheet: any = '';
  slectedSubSheetName: string = '';
  slectedSubSheetIndex: any = '';
  slectedRow: any = 0;
  fieldKey:string = '';
  fieldName: string = '';
  fieldType: string = '';

  availableDataTypes: string[] = ['string', 'number', 'date'];



  constructor(private serv: AppService){
   
  }

  handleFile(event:any){
    this.fileList = event.target.files;
    const formData = new FormData();
    for (var i = 0; i < this.fileList.length; i++) { 
      formData.append("excels", this.fileList[i]);
    }

    this.serv.convertToJSON(formData).subscribe(data=>{ 
      this.jsonData = data;
  
      this.jsonData.forEach(ele=>{
  
        let sheetname = ele.name;
        this.sheetOtions.push(sheetname);
       
      });
  
      console.log(this.jsonData);
    },err=>{})

  }

  handeSheetName(event:any){

    if(event.target.value != ''){
      this.selectedSheet = event.target.value;
      let sheetData = this.jsonData[this.selectedSheet];
      this.subSheetOtions = Object.keys(sheetData.data);
      this.slectedSubSheetName = this.subSheetOtions[0];

      let fieldObj = this.jsonData[this.selectedSheet]['data'][ this.slectedSubSheetName][this.slectedRow];
      this.setFieldOption(fieldObj);
    }

  }

  handeSubSheetName(event:any){
    if(event.target.value != ''){
    let subsheetName = this.subSheetOtions[event.target.value];
    this.slectedSubSheetName = subsheetName;
    
    let fieldObj = this.jsonData[this.selectedSheet]['data'][ this.slectedSubSheetName][this.slectedRow];
    this.setFieldOption(fieldObj);
    }
    
  }

  handleRow(event:any){
    if(event.target.value != ''){
    this.slectedRow = event.target.value;
    let fieldObj = this.jsonData[this.selectedSheet]['data'][ this.slectedSubSheetName][this.slectedRow];
    this.setFieldOption(fieldObj);
    }
  }

  handleField(event:any){
    // let fieldObj = this.jsonData[this.selectedSheet]['data'][ this.slectedSubSheetName][this.slectedRow];
    // this.setFieldOption(fieldObj, event.target.value);
    console.log(this.fieldOtions[event.target.value], event.target.value);
    this.fieldKey = this.fieldOtions[event.target.value]['key'];
    this.fieldName = this.fieldOtions[event.target.value]['name'];
  }

  setFieldOption(fieldObj, index=0){
    this.fieldOtions.length = 0;
    Object.keys(fieldObj).forEach(el=>{
      this.fieldOtions.push({key:el, name: fieldObj[el]});
    });
    this.fieldKey = this.fieldOtions[index]['key'];
    this.fieldName = this.fieldOtions[index]['name'];
  }

 
  handleSubmit(){
    let postdata = {
      config:{
        sheetName: this.jsonData[this.selectedSheet]['name'],
        sheet: this.selectedSheet,
        subsheet: this.slectedSubSheetName,
        row: this.slectedRow,
        col: this.fieldKey,
        fieldName: this.fieldName,
        dataType: this.availableDataTypes[this.fieldType]
      },
      dataset:this.jsonData[this.selectedSheet]
      
    }


    this.serv.updateExcel(postdata);
    console.log('pppp', postdata);
    
  }
}
