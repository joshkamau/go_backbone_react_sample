console.log("Creating doPost function...");
doPost = function(url, data, onSuccess){
	$.ajax({
  		type: "POST",
  		url: url,
  		processData: false,
  		contentType: 'application/json',
    	data: JSON.stringify(data),
  		success: onSuccess,
  		dataType: "json"
	}).fail(function(err){
		console.log(err)
	});
}

var eventer = {};

_.extend(eventer, Backbone.Events);
