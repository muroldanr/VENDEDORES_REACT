import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Table from '../components/Table';
import Titulo from '../components/Titulo';
import Photo from '../components/AgendaPhoto';
import { Button } from 'react-bootstrap';

class Pruebas extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            headers: [],
            data: []
        };
    }
    componentDidMount() {
        this.setHeaders();
        this.setData();
    }

    setHeaders() {
        let headers = ["Cotizacion","Prospectos","Articulo","Monto","Situacion","Autorizacion"];

        let headerItems = [];

        headerItems = headers.map((title) => 
                <th>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    setData() {
        let objArray = [
            {
                actNombre: "Marco Roldán",
                aliNombre: "Daniel Michael",
                embarque: "Juan Carlos",
                
            },
            {
                actNombre: "Marco Roldán",
                aliNombre: "Daniel Michael",
                embarque: "Juan Carlos",
                
            },
            {
                actNombre: "Marco Roldán",
                aliNombre: "Daniel Michael",
                embarque: "Juan Carlos",
               
            }
        ]
        let data = [];

        data = objArray.map((objV) => 
                <tr>
                    <td> {objV.actNombre}</td>
                    <td>{objV.aliNombre}</td>
                    <td>{objV.embarque}</td>
                </tr>
        );

        this.setState({
            data: data
        });
    }

    render() {

        return (
       	<div>
          <Container fluid={true}>
            <Titulo titulo="Pipeline por Autorizar"/>
          </Container>
          <Container fluid={true}>
	          <Row>
                  <Col md={12} xs={12} sm={12} xl={12} lg={12}>
                     <Photo nom="Marco Roldán"/>
                  </Col>
		          <Col md={12} xs={12} sm={12} xl={12} lg={12} className="mt-4">
			        <Table headers={this.state.headers} data={this.state.data}/>  
				  </Col>
                  <Col md={12} xs={12} sm={12} xl={12} lg={12} className="text-center mt-5" >
                    <Button className="botonuno">Actividades</Button>
                    <Button className="botonuno">Autorizacion</Button>
                  </Col>
			  </Row>
          </Container>
		</div>
        );

    }
}

  export default Pruebas;