
const DRIVE_THUMBNAIL='https://drive.google.com/thumbnail?authuser=0';
const DRIVE_OPEN='https://drive.google.com/open?';

testPostJSON=()=>{
  postData('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', { answer: 43 },localStorage.getItem("accessToken")).then(data =>console.log(data));
}

testGetJSON=()=>{
  getData('https://www.googleapis.com/drive/v3/files',localStorage.getItem('accessToken')).then(r=>{if(r.error) {alert(r.error.message);window.location.assign('signin.html');} else logE(r)});
}

checkAccessToken=()=>{
  getData('https://www.googleapis.com/drive/v3/files',localStorage.getItem('accessToken')).then(r=>{if(r.error) window.location.assign('signin.html'); else logE('Connected to File DB!')});
}

getFileMetadata=(fileId,callback)=>{
  getData('https://www.googleapis.com/drive/v3/files/'+fileId,localStorage.getItem('accessToken')).then(r=>(callback)?callback(r.name):logE(r));
}

async function postData(url = '', data = {},accessToken) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+accessToken
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '', accessToken) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Authorization': 'Bearer '+accessToken
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function postFile(url = '', file = {},accessToken) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': file.type,
      'Authorization': 'Bearer '+accessToken
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: file // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

// Credit to: https://gist.github.com/tanaikech/bd53b366aedef70e35a35f449c51eced
async function postMultipart(file = {},accessToken) {
  // var fileContent = 'sample text'; // As a sample, upload a text file.
  // var file = new Blob([fileContent], {type: 'text/plain'});

  var url='https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
  var metadata={
      'name': file.name, // Filename at Google Drive
      'mimeType': file.type, // mimeType at Google Drive
      'parents': ['1sVgYcRn8c-z9D9iYKwJEoFr7TeDhAFkA'], // Folder ID at Google Drive
  };

  var form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  var body = form;

  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Authorization': 'Bearer '+accessToken
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: body // body data type must match "Content-Type" header
  });
  logE(body);
  return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteFile(fileId, accessToken) {
  var url = 'https://www.googleapis.com/drive/v3/files/'+fileId;
  const response = await fetch(url, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Authorization': 'Bearer '+accessToken
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  response.status==204?logE(response):alert(response.statusText);
  return response; // parses JSON response into native JavaScript objects
}
