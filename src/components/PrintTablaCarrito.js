import React from 'react';
import Table from 'react-bootstrap/Table';
import './css/principales.css';
import { Container } from 'react-bootstrap';
import BotonesDeNumeros from '../components/BotonesDeNumeros';
import Button from 'react-bootstrap/Button';

class PrintTablaCarrito extends React.Component {
    render() {
        return (

            <div className="tabla_container mt-1" >

                    <div className="col-lg-11" >
                        <h1 className="title">Carrito</h1>
                    </div>

                  <Table striped bordered hover>
                    <thead>
                        <tr className="table_title">
                            <th></th>
                            <th>Descripcion</th>                            
                            <th>Precio Regular</th>
                            <th>Precio Contado</th>
                            <th>cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>                            
                            <td>Articulo 1</td>
                            <td>Aescripcion 2</td>
                            <td>$130</td>
                            <td>$110</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>articulo 2</td>                            
                            <td>descripcion 2</td>
                            <td>$120</td>
                            <td>$144</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>articulo 3</td>                            
                            <td>descripcion 3</td>
                            <td>$10</td>
                            <td>$139</td>
                            <td><BotonesDeNumeros/></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            );
    }
}

export default PrintTablaCarrito;