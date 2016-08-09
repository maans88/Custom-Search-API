var API_KEY = "AIzaSyAFjp3Zt69cL4Ib7estODjPTeJ6VbDPU6o";
var ENGINE_ID = "005219668912530318901:_nxr0fy3gww";
var apiUrl = "https://www.googleapis.com/customsearch/v1";

$(function() {
  $("#btn").click(function() {
    var keywordsArray = $("#desc").val().split(",");
    
    fetchImages(keywordsArray, function(images) {
        /** Images structure:  
        images = [
          {"keyword": "...", "url": "..."},
          {"keyword": "...", "url": "..."},
          {"keyword": "...", "url": "..."},
          ...
        ]
        */
       
		
		SendToNodeRed(images);
        console.log(images);
        printImages(images);
      
    });
  })
})


function SendToNodeRed(images){
	$.ajax({
  		type: "POST",
  		url: 'http://njb-mainapplication.mybluemix.net/pic',
  		data: images
	});
}


function fetchImages(keywords, completeCallback) {
    if (keywords.length == 0)
        return;
    
    var args = {
      "key"         : API_KEY,
      "cx"          : ENGINE_ID,
      "searchType"  : "image"
    };
  
    var images = [];
    for (var i in keywords) {
        args["q"] = keywords[i].trim();
        $.get(apiUrl, args, function(result) {
            // images.push([extractFirstImageUrl(result), extractSearchTerm(result)]
            images.push({"keyword": extractSearchTerm(result), 
                         "url": extractFirstImageUrl(result)});
            if (images.length == keywords.length) {
               completeCallback(images);
            }
        });
    }
}

function extractSearchTerm(results) {
    if (results && results.queries && results.queries.request[0])
        return results.queries.request[0].searchTerms;
    return "";
}

function extractFirstImageUrl(results) {
    if (results.items && results.items.length > 0)
        return results.items[0].link;
    return "";
}

function printImages(images) {
    var resultsDiv = $("#results").empty();
    if (images.length > 0) {
        for (var i in images) {
            resultsDiv.append('<div style="float: left">' + images[i]['keyword'] + '<br />' +
                              '<img src="' + images[i]['url'] + '" height="400" /></div>');
        }
    }
}
