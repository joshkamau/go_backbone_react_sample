var Delete = React.createClass({displayName: 'Delete',
	render:function(){
		var me = this;
		return(
			React.createElement("div", null, 
				React.createElement("h1", null, "Are you sure you want to delete"), 
				React.createElement("a", {href: "#/"}, "Delete")
			)
		);
	}
});


var Home = React.createClass({displayName: 'Home',
	getInitialState:function(){
		return {
			addresses:[]
		}
	},

	loadAddresses:function(){
		var me = this;
		doPost("/api/address/loadAll", {}, function(result){
	    	console.log(result.data)
	    	me.setState({addresses:result.data});
	   	}); 		
	},

	componentDidMount: function () {
	    var me = this;
	    console.log("Mounting home component")
	    me.loadAddresses();
	    eventer.on("ADDRESS_DELETED", me.loadAddresses);
	},

	componentWillUnmount: function () {
	    //clear events here  
	    eventer.off(null, this.loadAddresses);
	},

	deleteAddress:function(address, e){
		console.log("Deleting address ", address);
		var id = address.id;
		doPost("/api/address/delete", {id:id}, function(response){
			console.log("deleted...", response)
			if(response.success){
				console.log("EVENTER...", eventer);
				eventer.trigger("ADDRESS_DELETED", id);
			}
		});
		e.preventDefault();
	},
	render:function(){
		var me = this;
		if(me.state.addresses){
			console.log("addresses ::",me.state.addresses);
			var rows = me.state.addresses.map(function(address){
				return React.createElement("tr", {key: address.id}, 
					React.createElement("td", null, address.id), 
					React.createElement("td", null, address.firstname), 
					React.createElement("td", null, address.lastname), 
					React.createElement("td", null, address.mobile), 
					React.createElement("td", null, address.email), 
					React.createElement("td", null, 
						React.createElement("a", {href: "#/view/"+address.id}, "select"), "|", 
						React.createElement("a", {href: "", onClick: me.deleteAddress.bind(null, address)}, "delete")
					)
				)
			});
		};
	
		return(
			React.createElement("div", null, 
				React.createElement("h1", null, "Addresses"), 
				React.createElement("a", {href: "#/new", className: "pure-button pure-button-primary"}, "New Address"), 
				React.createElement("hr", null), 
				React.createElement("table", {className: "pure-table"}, 
					React.createElement("thead", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "ID"), 
							React.createElement("th", null, "First Name"), 
							React.createElement("th", null, "Last Name"), 
							React.createElement("th", null, "Mobile"), 
							React.createElement("th", null, "Email"), 
							React.createElement("th", null)
						)
					), 
					React.createElement("tbody", null, 
						rows
					)
				)
			)
		);
	}
})
var New = React.createClass({displayName: 'New',
	getInitialState:function(){
		return {};
	},
	updateFirstname:function(e){
		var state = this.state;
		state.firstname = e.target.value
		this.setState(state);
	},
	updateLastname:function(e){
		var state = this.state;
		state.lastname = e.target.value
		this.setState(state);
	},
	updateMobile:function(e){
		var state = this.state;
		state.mobile = e.target.value
		this.setState(state);
	},
	updateEmail:function(e){
		var state = this.state;
		state.email = e.target.value
		this.setState(state);
	},
	saveAddress:function(){
		console.log(this.state);
		var data = this.state;
		doPost("/api/address/save", data, function(result){
			console.log("Successfully submitted", result);
			var id = result.data
			appRouter.navigate("view/"+id, true);
		});
	},
	cancelAddress:function(){
		this.replaceState({});
	},
	render:function(){
		var me = this;
		return(
			React.createElement("div", null, 
				React.createElement("h1", null, "New Address"), 
				React.createElement("form", {className: "pure-form pure-form-aligned"}, 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "First Name"), 
						React.createElement("input", {type: "text", value: me.state.firstname, onChange: me.updateFirstname})
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Last Name"), 
						React.createElement("input", {type: "text", value: me.state.lastname, onChange: me.updateLastname})
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Mobile"), 
						React.createElement("input", {type: "text", value: me.state.mobile, onChange: me.updateMobile})
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Email"), 
						React.createElement("input", {type: "text", value: me.state.email, onChange: me.updateEmail})
					), 
					React.createElement("div", {className: "right"}, 
						React.createElement("button", {className: "pure-button pure-button-primary", onClick: me.saveAddress}, "save"), 
						React.createElement("button", {className: "pure-button pure-button-active", onClick: me.cancelAddress}, "cancel")
					)
				)
			)
		);
	}
})
var ViewAddress = React.createClass({displayName: 'ViewAddress',
	getInitialState:function(){
		return {address:{}}
	},
	componentDidMount:function(){
		console.log("PROPS ::", this.props);
		var me = this;
		var id = parseInt(me.props.addressID)||0;
		doPost("/api/address/loadByID", {id:id}, function(result){
			console.log("data ",result.data)
			me.setState({address:result.data});
			console.log("Address ", me.address);
		})
	},
	render:function(){
		var me = this;
		return(
			React.createElement("div", null, 
				React.createElement("h2", null, "Address"), 
				React.createElement("form", {className: "pure-form pure-form-aligned"}, 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Firstname"), 
						React.createElement("span", null, me.state.address.firstname)
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Lastname"), 
						React.createElement("span", null, me.state.address.lastname)
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Mobile"), 
						React.createElement("span", null, me.state.address.mobile)
					), 
					React.createElement("div", {className: "pure-control-group"}, 
						React.createElement("label", null, "Email"), 
						React.createElement("span", null, me.state.address.email)
					)
				), 
				React.createElement("a", {href: '#delete/'+me.props.addressID}, "View List")
			)
		);
	}
})
