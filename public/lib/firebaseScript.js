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


var loggedInUser=null;
initFirebaseApp = (p)=>{
	firebase.auth().onAuthStateChanged(
    (user)=>{(user)?/*Signed in.*/processUserData(user,p.callback)://user.getIdToken().then((accessToken)=>{__})
                    /*Signed out.*/window.location.assign('signin.html');}, 
    (error)=>{logE(null,error);});
};
onSignOut=()=>{firebase.auth().signOut().then(()=>{logE('Signed Out');}, (error)=>{logE('Sign Out Error', error);});}

processUserData=(user,callback)=>{
  var url=`${appscriptConfig.userUrl}?action=signIn&email=${user.email}&uid=${user.uid}`;
  logE('signin:'+url);
  callGasApi(url,true).then(gasApiCb).then(message=>{// merge data + main.user
      logE('signin Ok');var aUser=message.data;aUser.tenkhac='('+user.displayName+')';aUser.uid=user.uid;aUser.img=user.photoURL;aUser.email=user.email;
      mainData.user=aUser;
      document.body.classList.remove('unseen');callback();

    },(er)=>{if(er.error!=501) {alertEr('GasApiError',er);  return;}
        var maAcv = prompt("Hãy nhập mã ACV của bạn vào ô dưới đây:", "ACV");
        var signupUrl=`${appscriptConfig.userUrl}?action=signUp&email=${user.email}&uid=${user.uid}&maAcv=${maAcv}`;
        // logE(null,er);logE('signup:'+signupUrl);
        callGasApi(signupUrl,true).then(gasApiCb).then(data=>{alert(`Đã đăng ký email ${data.email} thành công!`);window.location.assign('/');},
          er=>alertEr('Error signup',er));
      }
    )
}

const NetEr='Network response was not ok';
const FetchEr='There has been a problem with fetch operation';
alertEr=(description,er)=>{alert(description+':'+er);logE(description,er);}

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