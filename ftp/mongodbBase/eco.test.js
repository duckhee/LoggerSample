const FileUtil = require('./util/get.file.type');
const TestPath = process.cwd()+'/../SampleData/ecolog';
//const TestCtrl = require('./ctrl/logger.ctrl.sample');
const Delay = async ()=>{
    return new Promise(resolve=>setTimeout(resolve, 100));
}
const Testing = async () =>{
   let FileList = FileUtil.GetFileList(TestPath);
   //console.log('Get File List ::: ',FileList);
   let CheckPath = TestPath+'/'+FileList[0];
   console.log("Check Path ::: ", CheckPath);
   let GetText = FileUtil.GetFileText(CheckPath);
   //console.log("Get Text ::: ", GetText );
   let Names = new Array();
   var Sensors;
   var Values = GetText;
    while(1){
        console.log('Value ::: ', typeof(Values));
        //console.log("Get Data["+i+']  :::: ', GetText[i]);
       if(Values.indexOf('<') != -1){
        let NameValue = new Array();
        let DataValues;
        let temp = Values;
        //console.log('Get < Value ::: ', GetText[i]);
        let StationValue = Values.split('</STATION>')[0].split('<STATION>')[1];
        //console.log("split StatusValue ::: ", StationValue);
        let SensorValue = Values.split('</SENSOR>')[0].split('<SENSOR>')[1];
        Sensors = SensorValue;
        let DateFormat = Values.split('</DATEFORMAT>')[0].split('<DATEFORMAT>')[1];
        //PUSH Testing ecolog
        let NamesValue = StationValue+','+SensorValue+','+DateFormat;
        NameValue.push(NamesValue);
        console.log('get Name Value ::: ', NameValue);
        let GetData = Values.split('</DATEFORMAT>')[1].split("<");
        console.log('get Data ::: ', GetData[0]);
        console.log("testing value ::; ", Values);
        Values = Values.split(SensorValue)[1];
        console.log('GET VALUE ::: ', Values);
        await Delay();
    }else{
        
        //console.log('else Value ::: ', Values);
        console.log(Values.length);
        break;
    }
    }
       
    console.log("get Sensor Name ::: ", Names);
};

Testing();