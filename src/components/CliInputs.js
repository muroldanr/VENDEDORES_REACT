import React from 'react';
import Form from 'react-bootstrap/Form';
import './css/clientes.css';
import InputGroup from 'react-bootstrap/InputGroup';

import { Button } from 'react-bootstrap';

class CliInputs extends React.Component {

    constructor(props) {
        super(props);

        let hideCreate = false;

        if (props.hideCreate) {
            hideCreate = true;
        }

        this.state = {
            modalShow: false,
            date: new Date(),
            diaSelect:{},
            hideCreate: hideCreate,
            tipo: "Clientes",
        };
    }

    handleCloseClientes() {
        const {handleCloseClientes} = this.props
        handleCloseClientes();
    }


    handleChange  = e => {
        this.setState({ [e.target.id]: e.target.value });
        //this.props.tipo(e);
    };

    openModal = () => {
        const {openModal} = this.props 
        openModal(true)
    }

    render() {        
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-xs-12 col-md-4 col-lg-4 mb-2" id="select" >
                        <Form.Control as="select" name="tipo" id="tipo" onChange={this.handleChange} value={this.state.tipo}>
                              <option >Clientes</option>
                              <option > Prospectos</option>
                        </Form.Control>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-4 mb-2" >
                        <div className="input-field" id="inp">
                            <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            className="form-control"
                            placeholder="Nombre"
                            onChange={this.props.onChange}
                            value={this.state.nombre}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-4 mb-2"  >
                        <div className="input-field" id="inp">
                            <input
                            id="clave"
                            name="clave"
                            type="text"
                            className="form-control"
                            placeholder="Clave"
                            onChange={this.props.onChange}
                            value={this.state.clave}
                            />
                        </div>
                    </div> 
                    <div className="col-xs-12 col-md-4 col-lg-4 mt-1" >
                        <div className="input-field" id="inp">
                         <input
                         id="telefono"
                         name="telefono"
                         type="telphone"
                         className="form-control"
                         placeholder="Teléfono"
                         onChange={this.props.onChange}
                         value={this.state.telefono}
                         />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-4 mt-1" >
                        <div className="input-field" id="inp">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={this.props.onChange}
                            value={this.state.email}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 col-lg-2 mt-1" >
                        <InputGroup.Append>
                            <Button
                            variant="outline-secondary"
                            id="save"
                            className="btnBuscar"
                            onClick={this.props.onButton}
                            >
                            Buscar
                            </Button>
                        </InputGroup.Append>
                    </div>
                    {
                        (this.state.hideCreate) ?
                        null
                        :
                        <div className="col-xs-12 col-md-4 col-lg-2 mt-1" >
                            <InputGroup.Append>
                                <Button
                                variant="outline-secondary"
                                id="save"
                                className="btnBuscar"
                                onClick={this.openModal}
                                >
                                Agregar
                                </Button>
                            </InputGroup.Append>
                        </div>
                    }
                </div>
            </div>

            );
    }
}
export default CliInputs;
