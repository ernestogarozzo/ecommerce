import React from 'react';
import Chart from './ChartChart';
import { TypeChooser } from "react-stockcharts/lib/helper";

function parseMyData(data) {

	for(var i = 0; i <  data.length; i++){
		data[i].date = new Date(parseInt(data[i]["openTime"]));
		data[i].close = parseFloat(data[i]["close"]);
		data[i].open = parseFloat(data[i]["open"]);
		data[i].low = parseFloat(data[i]["low"]);
		data[i].high = parseFloat(data[i]["high"]);
		data[i].volume = parseFloat(data[i]["volume"]);
		delete data[i].openTime;
	}
	return data
}

class ChartComponent extends React.Component {

	render() {
		return (
			<TypeChooser>
				{type => <Chart type={type} data={parseMyData(this.props.data)} />}
			</TypeChooser>
		)
	}
}

export default ChartComponent

