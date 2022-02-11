import React from 'react';
import {Bar} from 'react-chartjs-2';
import '../components/css/reportes.css';

class Graph extends React.Component{
    constructor(props){
        super(props);
        this.state={
          labels: [],
          datasets: []
        }
        this.options = {
            scales: {
                 yAxes: [{
                    ticks: {
                        callback(value, index) {
                           return value.toLocaleString(undefined, { minimumFractionDigits: 2 });
                        }
                    }
                 }]
            }
        }
    }

    componentWillReceiveProps(props){
        let labels = props.arre.map((objE) => objE.Ejercicio);
        let data = props.arre.map((objE) => objE.ImporteTotal);
        this.setState({
            labels: labels,
            datasets: [ {
                    label:'Ventas totales por ejercicio',
                    backgroundColor: 'rgba(164,201,135,0.9)',
                    borderColor: 'rgba(164,201,135,0.9)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(164,201,135,0.9)',
                    hoverBorderColor: 'rgba(164,201,135,0.9)',
                    data: data
                }
            ]
        });
    }

    componentDidMount(){
        
    }

    render() {
        return (
            <Bar id="graphContainer" data={this.state} options={this.options}  />
        );
    }
}
    
export default Graph;