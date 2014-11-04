
var Home = React.createClass({
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
				return <tr key={address.id}>
					<td>{address.id}</td>
					<td>{address.firstname}</td>
					<td>{address.lastname}</td>
					<td>{address.mobile}</td>
					<td>{address.email}</td>
					<td>
						<a href={"#/view/"+address.id}>select</a>|
						<a href="" onClick={me.deleteAddress.bind(null, address)}>delete</a>
					</td>
				</tr>
			});
		};
	
		return(
			<div>
				<h1>Addresses</h1>
				<a href="#/new" className="pure-button pure-button-primary">New Address</a>
				<hr/>
				<table className="pure-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Mobile</th>
							<th>Email</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		);
	}
})