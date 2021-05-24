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
  inputStruct: any = [];
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
  
      this.jsonData.forEach((ele,i)=>{

        let obj = {};
        obj['name'] = ele.name;
        let fieldData = ele.data;
        let subSheetList = Object.keys(fieldData);
        obj['subsheet'] = subSheetList;
        obj['field'] = {};
        obj['row'] = 0;
        obj['selectedSubsheet'] = 0;
        obj['fieldKey'] = 0;
  
        subSheetList.forEach(key=>{
          obj['field'][key] = [];
          
          fieldData[key].forEach(element => {
            let arr = [];
            for(let x in element){
              arr.push({col:x, name: element[x]})
            }
            obj['field'][key].push(arr);
          });
         
        });

        obj['fieldName']  = obj['field'][subSheetList[0]][0][0]['name']
        obj['fieldType'] = "";

        this.inputStruct.push(obj);
       
      });
  
      console.log(this.jsonData, this.inputStruct);
    },err=>{})

  }


  
  handleSubmit(){
    this.inputStruct.forEach((element,i) => {

      let fieldtyepe = ( element.fieldType !="")?this.availableDataTypes[element.fieldType]:"";
    
     
      let postdata = {
        config:{
          sheetName: this.jsonData[i]['name'],
          sheet: i,
          subsheet: element.subsheet[element.selectedSubsheet],
          row: element.row,
          col: element.field[element.subsheet[element.selectedSubsheet]][element.row][element.fieldKey]['col'],
          fieldName: element.fieldName,
          dataType: fieldtyepe
        },
        dataset:this.jsonData[i]
        
      }

      console.log(postdata);
      this.serv.updateExcel(postdata);

    });
    
    
  }
}
