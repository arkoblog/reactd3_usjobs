var React = require('react');
var ReactDOM = require('react-dom');
var _ = require('lodash');
var d3 = require('d3');
var drawers = require('./components/drawers');

var H1BGraph = React.createClass({
	componentWillMount: function(){
		this.loadRawData()
	},
	getInitialState: function(){
		return {
			rawData: []
		}

	},
	loadRawData: function(){
		var dateFormat = d3.time.format("%m/%d/%Y");
		d3.csv(this.props.url)
		  .row(function(d){
		  	if (!d['base salary']) {
		  		return null;
		  	}
		  	return {
		  		employer: d.employer,
		  		submit_date: dateFormat.parse(d['submit date']),
		  		start_date: dateFormat.parse(d['start date']),
		  		case_status: d['case_status'],
		  		job_title: d['job title'],
		  		base_salary: Number(d['base salary']),
		  		salary_to: d['salary to'] ? Number(d['salary to']) : null,
		  		city: d.city,
		  		state: d.state
		  	};
		  }.bind(this))
		  .get(function(error, rows) {
		  	if(error) {
		  		console.error(error);
		  		console.error(error.stack);
		  	} else {
		  		// console.log("Data",rows);
		  		this.setState({rawData:rows});
		  	}
		  }.bind(this))
	},
	render: function() {
		if (!this.state.rawData.length){
			return (
				<h2>Loading data for 81000 h1B Visas in the country!</h2>
				);
		}

		var params = {
			bins: 20,
			width: 200,
			height: 500,
			axisMargin: 83,
			topMargin:10,
			bottomMargin: 5,
			value: function(d) {return d.base_salary;}
		};

		var fullWidth = 700


		return(
				<div className="row">
					<div className="row">
						<h1>Welcome to the d3 app!</h1>
					</div>		
					<div className="col-md-12">
						<svg width={fullWidth} height={params.height}>
							<drawers.Histogram {...params} data={this.state.rawData}/>

						</svg>
					</div>
				</div>
			);
	}
}) 

ReactDOM.render(
	<H1BGraph url="data/h1bs.csv" />,
	document.querySelectorAll('.h1bgraph')[0]
)