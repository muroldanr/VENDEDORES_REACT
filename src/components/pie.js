import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Container,Card } from 'react-bootstrap';
import './css/articulos.css';  

class pie extends React.Component {
    render() {

    const data = {
      labels: ['Visitas', 'Oportunidades', 'Cotizaciones', 'Pedidos', 'Facturas'],
      datasets: [
        {
          label: '',
          backgroundColor: 'rgba(255, 194, 123,0.8)',
          borderColor: 'rgba(255, 194, 123,0.3)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 194, 123,0.8)',
          hoverBorderColor: 'rgba(255, 194, 123,0.3)',
          data: [300, 250, 200, 100, 50,30]
        }
      ]
    };

		const legendOpts = {
		  display: true,
		  position: 'botton',
		  fullWidth: true,
		  reverse: true,
      fontSize: 35,
		  labels: {
		    fontColor: 'rgb(0, 0, 0)',
		    fontWeight: 'bold',
   			fontSize: 25
		  }
		};

       return (
          <Container fluid={true} className="pb-5" id="canvas">
              <Card className="p-4">
                <Pie data={data} legend={legendOpts} height={60}/>
              </Card>
          </Container>
       );
    }
}
export default pie;
