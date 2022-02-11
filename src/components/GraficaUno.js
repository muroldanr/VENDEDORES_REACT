import React from 'react';
import {Pie} from 'react-chartjs-2';

class GraficaUno extends React.Component {
    render() {


		const data = {
			labels: [
				'Visitas',
				'Regresos',
				'Cotizaciones',
				'Pedidos',
				'Facturas'

			],
			datasets: [{
				data: [100, 50, 100,60],
				backgroundColor: [
				'#FF6384',
				'#36A2EB',
				'#FFCE56',
				'#9176FF'
				],
				hoverBackgroundColor: [
				'#FF6384',
				'#36A2EB',
				'#FFCE56',
				'#9176FF'
				]
			}]
		};

		const legendOpts = {
		  display: true,
		  position: 'right',
		  fullWidth: true,
		  reverse: false,
		  labels: {
		    fontColor: 'rgb(0, 0, 0)',
		    fontWeight: 'bold',
   			fontSize: 25
		  }
		};

       return (

			<Pie data={data} legend={legendOpts}  />
       );
    }
}
export default GraficaUno;