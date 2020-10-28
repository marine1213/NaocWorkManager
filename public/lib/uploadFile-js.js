	
	onInitUploadEvent=(className)=>{
		var fileUploadElmList = document.querySelectorAll(className);
		Array.from(fileUploadElmList).forEach(node=>node.addEventListener('change', e => {logE(e);logF(handleFileUpload,e); }));
		//Credit to: https://stackoverflow.com/questions/43113018/javascript-change-event-trigger-multiple-times/43113191
	}

	handleFileUpload = event => {
  		const elm = event.target,f=elm.files[0]; 
  		if(elm.files.length==0) return;
  		if(f.size>fLimit){alert('Chỉ chọn được file có kích thước nhỏ hơn 30MB!'); return;}

  		var fs = new FileReader();
  		fs.readAsDataURL(f);
  		var thumbnailParent = elm.parentElement.parentElement.parentElement;
  		var thumbnailElm = thumbnailParent.getElementsByClassName('flexThumbnailContainer')[0]; //the first is the only
		var thumbnailIdx = thumbnailElm.getElementsByClassName('customFileItem').length;
		var origin = thumbnailElm.innerHTML;

  		fs.onload=(fileEvent)=>{
  			thumbnailElm.innerHTML = origin+`<div class="customFileItem">
									<div class="frameThumbnail">
										<img src="./icons/svg/753/753345.svg" class="closeOnTopThumbnail lv4" onclick="this.parentElement.parentElement.remove(); return false" width="20px">
										<div class="fadeContainer">
											<img width="80px" src="${fileEvent.target.result}" alt="Lỗi Ảnh" class="fadeUnder">
											<div class="lds-spinner fadeAbove" width="80px">
												<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
											</div>
										</div>
									</div>
									<label>${f.name}</label>
								</div>`;
  		}
  		event.handled = false;
  		postMultipart(f,localStorage.getItem("accessToken")).then(response=>fileUploadCompleted(thumbnailParent,f.name,response.id,thumbnailIdx));

  	}
	
	fileUploadCompleted = (elmParent,fileName,fileId,thumbnailIdx)=>{//add file preview
		var thumbnailElm = elmParent.getElementsByClassName('flexThumbnailContainer')[0]; //the first is the only
		var loadingElm = thumbnailElm.getElementsByClassName('customFileItem')[thumbnailIdx];
		var thumbnailUrl = getThumbnailUrl(fileId), driveUrl = getDriveUrl(fileId);
		replaceLoadedImage=()=>{
			loadingElm.innerHTML = `<div class="frameThumbnail">
										<img src="./icons/svg/753/753345.svg" class="closeOnTopThumbnail" onclick="onRemoveFilePreview(this.parentElement.parentElement,'${fileId}')" width="20px">
										<img width="80px" src="${thumbnailUrl}" onclick="window.open('${driveUrl}')" alt="Lỗi Ảnh" >
								</div>
								<label onclick="window.open('${driveUrl}')">${fileName}</label>
								<input type="text" class="hidden fileUploadedId" value="${fileId}?${fileName}">`;
		}
		replaceLoadedImage();
		testImage(thumbnailUrl).then(replaceLoadedImage,()=>{setTimeout(()=>{testImage(thumbnailUrl).then(replaceLoadedImage,replaceLoadedImage);},10000);});

		
	 	logE(fileId+' - '+fileName);
	}

	onRemoveFilePreview=(parentElm,fileId)=>{parentElm.remove();deleteFile(fileId,localStorage.getItem('accessToken')); return false;}

	getThumbnailUrl=(fileId)=>`${DRIVE_THUMBNAIL}&sz=w80&id=${fileId}`;
	getDriveUrl=(fileId)=>`${DRIVE_OPEN}id=${fileId}`;

	getFileUploadedIdList=(p)=>Array.from(p.elm.form.getElementsByClassName('fileUploadedId')).map(elm=>elm.value).join(',');

	async function testImage(url){ return await new Promise(function imgPromise(resolve, reject) {
	        // Create the image
	        const imgElement = new Image();
	        // When image is loaded, resolve the promise
	        imgElement.addEventListener('load', function imgOnLoad() {resolve(this);});
	        // When there's an error during load, reject the promise
	        imgElement.addEventListener('error', function imgOnError() {reject();})

	        // Assign URL
	        imgElement.src = url;
	    });
	}