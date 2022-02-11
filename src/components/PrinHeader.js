import React from 'react';
import './css/principales.css';
import {Chart} from 'react-google-charts';
import { Container,Card,Col } from 'react-bootstrap';

class PrinHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            title: ""
        }
        this.currentMonth()
    }

    componentWillReceiveProps(props) {
        this.setState({
            data: props.data
        });
    }

    currentMonth(){
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const d = new Date();
        const month = monthNames[d.getMonth()]

        return(
                "Pipeline  " + month
            )
    }

    render() {

        let values = [];
        let keys = [];

        keys.push([{type: 'string', role:'domain'}, {label:'Ventas', role:'data', type:'number'}, {type: 'string', role:'annotationText'}]);

        values = this.state.data.map((dato) => {
            for (var key in dato) {
               let formatNumber = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(dato[key]));
               keys.push([key + ' - ' + formatNumber, Number(dato[key]), formatNumber]);
            }
            return keys;
        });

        let options = {
            showAllTooltips: true
        }

        return (
            <Container fluid={true} className="pb-5" id="canvas">
                {
                    (this.state.data.length > 0)
                    ?
                    <Card className="p-4">
                    <Col xs={12} >
                      <center>
                        <hr className="style2"/>
                          <h4>{this.currentMonth()}</h4>
                        <hr className="style2"/>
                      </center>
                    </Col>
                        <Chart
                            chartType="PieChart"
                            loader={<div>Cargando gráfica...</div>}
                            data={
                                values[0]
                            }
                            width={'100%'}
                            height={'400px'}
                            options={options}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </Card>
                    :
                    null
                }
            </Container>
        );
    }
}

export default PrinHeader;