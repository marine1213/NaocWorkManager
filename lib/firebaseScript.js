// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAc209gF_vDTZdjLi7VTusnKipdFcp3tNc",
  authDomain: "naocworkmanager.firebaseapp.com",
  databaseURL: "https://naocworkmanager.firebaseio.com",
  projectId: "naocworkmanager",
  storageBucket: "naocworkmanager.appspot.com",
  messagingSenderId: "753176498410",
  appId: "1:753176498410:web:0b1f4b9e42feb981178793",
  measurementId: "G-YJ5N6D8FK6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var appscriptConfig = {
  url:'https://script.google.com/macros/s/AKfycbxBeG7SIkZb5wR-vzTvBepIxgfD1WIkmK4SbHKFuMZs2F7AO_x7/exec',
  debug:'https://script.google.com/macros/s/AKfycbyb10Q1iK8cW_DFravhr6djs9I5TWt1CX3rDat3Gr6D/dev',
}

var loggedInUser=null;
initFirebaseApp = (p)=>{
	firebase.auth().onAuthStateChanged(
    (user)=>{(user)?/*Signed in.*/processUserData(user,p.callback)://user.getIdToken().then((accessToken)=>{__})
                    /*Signed out.*/window.location.assign('signin.html');}, 
    (error)=>{logE(null,error);});
};
onSignOut=()=>{firebase.auth().signOut().then(()=>{logE('Signed Out');}, (error)=>{logE('Sign Out Error', error);});}

processUserData=(user,callback)=>{
  var signinUrl=`${appscriptConfig.url}?action=signIn&email=${user.email}&uid=${user.uid}`;
  // logE('signin:'+signinUrl);
  callGasApi(signinUrl,true).then(gasApiCb).then(aUser=>{// merge data + main.user
      logE('signin Ok');//logE(JSON.stringify(user));
      mainData.user={ten:aUser.hoten,tenkhac:'('+user.displayName+')',email:user.email,acvId:aUser.maAcv,uid:aUser.uid,rowIndex:aUser.rowIdx,chucdanh:aUser.chucdanh,donvi:aUser.donvi,maquyen:aUser.maquyen,img:user.photoURL};
      document.body.classList.remove('unseen');callback();

    },(er)=>{if(er.error!=501) {alertEr('GasApiError',er);  return;}
        var maAcv = prompt("Hãy nhập mã ACV của bạn vào ô dưới đây:", "ACV");
        var signupUrl=`${appscriptConfig.url}?action=signUp&email=${user.email}&uid=${user.uid}&maAcv=${maAcv}`;
        // logE(null,er);logE('signup:'+signupUrl);
        callGasApi(signupUrl,true).then(gasApiCb).then(data=>alert(`Đã đăng ký email ${data.email} thành công!`),er=>alertEr('Error signup',er));
      }
    )
}

const NetEr='Network response was not ok';
const FetchEr='There has been a problem with fetch operation';
alertEr=(description,er)=>{alert(description+':'+JSON.stringify(er));logE(description,er);}

callGasApi=(url,isJson)=>new Promise(dataCb=>{fetch(url).then(r=>(r.ok)?isJson?r.json():r.blob():alertEr(NetEr,'GasApi')).then(dataCb).catch(er=>alertEr(FetchEr,er));})
gasApiCb=data=>new Promise((dataCb,errorCb)=>(data.status==false||data.message.error != undefined)?errorCb(data.message):dataCb(data.message.data))
//`Error:${data.message.error}-${data.message.text}`

// fetch('flowers.jpg')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.blob();
//   })
//   .then(myBlob => {
//     myImage.src = URL.createObjectURL(myBlob);
//   })
//   .catch(error => {
//     console.error('There has been a problem with your fetch operation:', error);
//   });
// credit:https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch