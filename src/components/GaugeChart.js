import React from 'react';
import {Chart} from 'react-google-charts';
import { Container } from 'react-bootstrap';

class GaugeChart extends React.Component{
      
  constructor(props) {
    super(props)
  
    this.state = {
        Ventas: 80,
        intervalID: null,
        memory: 0,
    }
  }

      componentDidMount(){
        const intervalID = setInterval(() => {
          this.setState({
            memory: this.state.memory + 10,
            intervalID,
          })
        }, 1000)
      }


      render() {
       return (
        <Container id="graphContainer" fluid={true}>
        	<Chart           
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
              ['Label', 'Value'],
              ['Ventas', this.state.memory],
            ]}
            options={{ 
              width: 300,
              height: 300,
              redFrom: 900,
              redTo: 1000,
              yellowFrom: 750,
              yellowTo: 900,
              minorTicks: 0,
              max:1000,
            }}
            rootProps={{ 'data-testid': '1' }}
          />
          </Container>
            );
    }
}
export default GaugeChart;

