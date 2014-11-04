//router 
var AppRouter = Backbone.Router.extend({
	routes:{
		"":"home",
		"new":"newAddress",
		"view/:id":"viewAddress",
		"delete/:id":"deleteAddress"
	},
	home:function(){
		console.log("Showing home....");
		React.render(React.createElement(Home, null), document.getElementById("content"));
	},
	newAddress:function(){
		React.render(React.createElement(New, null), document.getElementById("content"));
	},
	viewAddress:function(id){
		console.log("Loading view address ", id);
		//var el  = React.createElement(ViewAddress, {addressID:id});
		//console.log(el);
		React.render(React.createElement(ViewAddress, {addressID: id}), document.getElementById("content"));
	},
	deleteAddress:function(id){
		var el = React.createElement(Home, {addressID: id});
		React.render(el, document.getElementById("content"));
	}
});
var appRouter = new AppRouter();

Backbone.history.start();