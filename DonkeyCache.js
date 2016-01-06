var DonkeyCache = function() {
			var init: function(){
      		// Setup the local storage, we'll use
          if (!window.localStorage['CoolCache']){
          		window.localStorage['CoolCache'] = '[]';
          }
      }
      var updateDB: function(updateObj){
      		window.localStorage['CoolCache'] = JSON.stringify(updateObj);
      }
      var fetchDB: function(){
      		return JSON.parse(window.localStorage['CoolCache']);
      }
      var createCORSRequest = function(method, _url, responseType){
        var xhr = new XMLHttpRequest();
        var url = 'https://crossorigin.me/'+_url;
        if ("withCredentials" in xhr){
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined"){
            xhr = new XDomainRequest();
            xhr.open(method, url);
            xhr.responseType = responseType;
        } else {
            xhr = null;
        }
        return xhr;
			}
      var getBase64Image =  function(img) {
      	var txDeferred = $.Deferred();
        // Create an empty canvas element 
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
               
        var image = new Image();
        image.crossOrigin = "Anonymous";
        
        var url = 'https://crossorigin.me/'+img.src;
        
        image.onload =  function(){
        	// Copy the image contents to the canvas
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx.drawImage(image, 0, 0);
					
          try{
          		var ima  = canvas.toDataURL('image/png');
          		txDeferred.resolve(ima);
          } catch (e){
          		txDeferred.reject(e);
          }
          //$('#goat').attr('src', ima);
        }        
        image.src = url;        
        return txDeferred.promise();
		}
	return {
  		'xfetchImg': function(url){
          var request = createCORSRequest("get", url, 'blob');
          if (request){
              request.onload = function(e){
                  //do something with request.responseText
                  if (this.status == 200) {
                  	alert(JSON.stringify(this.response));
                  } else {
                    alert('couldnt fetch file');
                  }
              };
              request.send();
          }
      },
      // Store a single image
      // Even if a jq selection (Array) is passed in, we select the first one, so be  careful
      'storeImg': function(_img){
      		var img  = _img.get()[0];
          var CacheDB = fetchDB();
          var result = $.grep(CacheDB, function(e){
            	return e.src == img.src;
        	});
          if (!result.length){
          		$.when(getBase64Image(img))
              .done(function(data){
									CacheDB.push({src : img.src, data : data});
                  updateDB(CacheDB);
              })		
          }
      }
      'fetchImg': function(_img){
      			// Img is a jQuery object
            // Check its source to see it it already exist in the 
            var CacheDB = fetchDB();
            var result = $.grep(CacheDB, function(e){
            	return e.src == img.src;
        		});
            if (result.length){
            		_img.attr('src', result.data);
            }
      },
      
      // If you are lazy, this will choose whether to load from cache or network.
      // If it from the network, it auto caches it
      'resolve': function(img, success, error){
      		var selections = img.get();
          if (!selection.length && error){
          		error('Selection is empty. Check you JQM selection');
          } else if (selection.length == 1){
          		
          }
      }
  }
}();

$(document).ready(function(){
  // Cache.fetchLoadedImage($('#demo'));
  // Insert a "donkey-cache-src = 'bla bla.jpg' ito your img tag"
  // Pass a JQM selection for an image ('#bla') or images ('.bla') to CoolCache.resolve() with suc n error callback
    DonkeyCache.resolve($('#demo'), function(){
				alert()
    }, function(error){
    		alert(error);
    });
});
