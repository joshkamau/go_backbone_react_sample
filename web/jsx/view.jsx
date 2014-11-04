var ViewAddress = React.createClass({
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
			<div>
				<h2>Address</h2>
				<form className="pure-form pure-form-aligned">
					<div className="pure-control-group">
						<label>Firstname</label>
						<span>{me.state.address.firstname}</span>
					</div>
					<div className="pure-control-group">
						<label>Lastname</label>
						<span>{me.state.address.lastname}</span>
					</div>
					<div className="pure-control-group">
						<label>Mobile</label>
						<span>{me.state.address.mobile}</span>
					</div>
					<div className="pure-control-group">
						<label>Email</label>
						<span>{me.state.address.email}</span>
					</div>
				</form>
				<a href={'#delete/'+me.props.addressID}>View List</a>
			</div>
		);
	}
})
