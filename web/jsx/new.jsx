var New = React.createClass({
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
			<div>
				<h1>New Address</h1>
				<form className="pure-form pure-form-aligned">
					<div className="pure-control-group">
						<label>First Name</label>
						<input type="text" value={me.state.firstname} onChange={me.updateFirstname}/>
					</div>
					<div className="pure-control-group">
						<label>Last Name</label>
						<input type="text" value={me.state.lastname} onChange={me.updateLastname}/>
					</div>
					<div className="pure-control-group">
						<label>Mobile</label>
						<input type="text" value={me.state.mobile} onChange={me.updateMobile}/>
					</div>
					<div className="pure-control-group">
						<label>Email</label>
						<input type="text" value={me.state.email} onChange={me.updateEmail}/>
					</div>
					<div className="right">
						<button className="pure-button pure-button-primary" onClick={me.saveAddress}>save</button>
						<button className="pure-button pure-button-active" onClick={me.cancelAddress}>cancel</button>
					</div>
				</form>
			</div>
		);
	}
})