var React = require('react');
var _ = require ('lodash');

var Toggle = React.createClass({
	getInitialState: function(){
		return {value:false};
	},
	handleClick: function () {
		// console.log("State",this.state)
		var newState = !this.state.value;
		// console.log("NewState",newState);
		this.setState({value:newState});
		// console.log("State",this.state)
		this.props.onClick(this.props.name, newState)
	},
	componentWillReceiveProps: function(newProps) {
		this.setState({value:newProps.value});

	},
	render: function() {
		// console.log(this);
		var className="btn btn-default"

		if (this.state.value) {
			className = className + " btn-primary" 
		}

		return(
			<button className={className} onClick={this.handleClick} >
			{this.props.label}
			</button>
			);

	}
})

var ControlRow = React.createClass({
	getInitialState: function() {
		var toggles = this.props.getToggleNames(this.props.data);
		var toggleValues = _.zipObject(toggles, toggles.map(function(){return false;}));
		// console.log(toggleValues);
		return ({toggleValues: toggleValues});
	},
	makePick: function(picked, newState){
		console.log("Picked",picked,"newstate",newState)
		var toggleValues = this.state.toggleValues;
		console.log("Before", toggleValues)
		toggleValues = _.mapValues(toggleValues, function(value, key){
			return newState && key==picked;
		});
		console.log("After",toggleValues)
		this.props.updateDataFilter(picked, !newState);
		this.setState({toggleValues: toggleValues})
	},
	render: function() {
		return (
				<div className="row">
					<div className="col-md-12">
						{this.props.getToggleNames(this.props.data).map(function(name){
							var key="toggle-"+name;
							var label=name;
							// console.log("Key", key, "Label", label,"Name", name, "Value", this.state.toggleValues[name] );
							return(
								<Toggle label={label} name={name} key={key} value={this.state.toggleValues[name]} onClick={this.makePick}/>)
						}.bind(this))}
					</div>
				</div>
			)
	}
})

var Controls = React.createClass({
	UpdateYearFilter: function (year, reset) {
		// console.log("Year", year, "Reset",reset);

		var filter = function(d) {
			return d.submit_date.getFullYear() == year;
		};

		if (reset || !year) {
			filter = function() {return true;}
		}

		this.setState({yearFilter:filter});
	},
	getInitialState: function () {
		return {yearFilter: function(){return true}};
	},
	componentDidUpdate: function() {
		this.props.updateDataFilter(
			(function(filters){
				// console.log("Filters",filters)
				return function (d){
					return filters.yearFilter(d)
				};
			})(this.state)
			);
	},
	shouldComponentUpdate: function(nextProps, nextState){
		return !_.isEqual(this.state, nextState);
	},
	render: function() {
		var getYears = function(data) {
			// console.log("GetYears", _.keys(_.groupBy(data, function(d){return d.submit_date.getFullYear()})).map(Number))
			return _.keys(_.groupBy(data, function(d){return d.submit_date.getFullYear()})).map(Number)
		}
		return (
				<div>
					<ControlRow data={this.props.data} getToggleNames={getYears} updateDataFilter={this.UpdateYearFilter} />
				</div>
			)
	}
})

module.exports = Controls