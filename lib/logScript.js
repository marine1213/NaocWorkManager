// description="debug"
  logF=(functionObj,paramObj)=>{console.log(`${functionObj.name}(${JSON.stringify(paramObj)})`); functionObj(paramObj);};
  logE=(information,error)=>{if(information)console.log(information);if(error)console.error(error)}
//=================================================
// description="announce"

//=================================================