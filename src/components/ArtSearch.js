import React from 'react';
import Form from 'react-bootstrap/Form';
import './css/articulos.css';
import {Row, Col,Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import ToogleSwitch from '../components/ToogleSwitch';

class ArtSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            categoria: '',
            grupo:'',
            familia: '',
            linea: '',
            fabricante:'',
            categorias: (props.categorias) ? props.categorias:[],
            grupos: (props.grupos) ? props.grupos:[],
            familias: (props.familias) ? props.familias:[],
            lineas: (props.lineas) ? props.lineas:[],
            fabricantes: (props.fabricantes) ? props.fabricantes:[],
            categoriasdata:[],
            gruposdata:[],
            familiasdata:[],
            lineasdata:[],
            fabricantesdata:[],
            busqueda: '',
            existencia: (this.props.existencia)
        };
    }

    componentWillReceiveProps(props){
        this.setState({
            categorias: (props.categorias) ? props.categorias:[],
            grupos: (props.grupos) ? props.grupos:[],
            familias: (props.familias) ? props.familias:[],
            lineas: (props.lineas) ? props.lineas:[],
            fabricantes: (props.fabricantes) ? props.fabricantes:[]
        });
        this.llenarCategorias();
        this.llenarGrupos();
        this.llenarFamilias();
        this.llenarLineas();
        this.llenarFabricantes();
    }

    searchBar(evento){
        let busqueda = evento.target.value;
        this.setState({
            busqueda: busqueda
        });
    }

    onClickSearchFilter(){
        if (this.props.onsearch) {
            this.props.onsearch(this.state.busqueda, this.state.existencia);
        }
    }

    onSelectCategoria = e => {
        this.setState({
            categoria:e.target.value
        })
    }

    onSelectGrupo = e => {
        this.setState({
            grupo: e.target.value
        })
    }

    onSelectFamilia = e => {
        this.setState({
            familia: e.target.value
        })
    }

    onSelectLinea = e => {
        this.setState({
            linea: e.target.value
        })
    }

    onSelectFabricante = e => {
        this.setState({
            fabricante:e.target.value
        })
    }

    onChangeSwitch = existencia => {
        this.setState({
            existencia: existencia
        });
    }

    llenarCategorias() {
        let categorias = this.state.categorias;
        let data=[];
        data = categorias.map((objV, index) => 
            <option key={objV.Categoria + index} name={objV.Categoria} value={objV.Categoria}>{objV.Categoria}</option>
        );
        this.setState({categoriasdata:data});
    }

    llenarGrupos(){
        let grupos = this.state.grupos;
        let data= [];
        data = grupos.map((objV, index) => 
            <option key={objV.Grupo + index} name={objV.Grupo} value={objV.Grupo}>{objV.Grupo}</option>
        );
        this.setState({gruposdata:data});
    }

    llenarFamilias(){
        let familias=this.state.familias;
        let data=[];
        data = familias.map((objV, index) => 
            <option key={objV.Familia + index} name={objV.Familia} value={objV.Familia}>{objV.Familia}</option>
        );
        this.setState({familiasdata:data});
    }

    llenarLineas() {
        let lineas = this.state.lineas;
        let data=[];
        data = lineas.map((objV, index) => 
            <option key={objV.Linea + index} name={objV.Linea} value={objV.Linea}>{objV.Linea}</option>
        );
        this.setState({lineasdata:data});
    }

    llenarFabricantes() {
        let fabricantes = this.state.fabricantes;
        let data=[];
        data = fabricantes.map((objV, index) => 
            <option key={objV.Fabricante + index} name={objV.Fabricante} value={objV.Fabricante}>{objV.Fabricante}</option>
        );
        this.setState({fabricantesdata:data});
    }

    pintarFiltros() {
        return (
            <Row className="filtros-agrupadores">
                <Col>
                    <Form.Control className="m-1" as="select" onChange={this.onSelectCategoria.bind(this)}>  
                        <option >Selecciona una opción</option>
                        {this.state.categoriasdata}
                    </Form.Control>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                    <Form.Control className="m-1" as="select" onChange={this.onSelectGrupo.bind(this)}>  
                        <option >Selecciona una opción</option>
                        {this.state.gruposdata}
                    </Form.Control>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                    <Form.Control className="m-1" as="select" onChange={this.onSelectFamilia.bind(this)}>  
                        <option >Selecciona una opción</option>
                        {this.state.familiasdata}
                    </Form.Control>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                    <Form.Control className="m-1" as="select" onChange={this.onSelectLinea.bind(this)}>  
                        <option >Selecciona una opción</option>
                        {this.state.lineasdata}
                    </Form.Control>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                    <Form.Control className="m-1" as="select" onChange={this.onSelectFabricante.bind(this)}>  
                        <option >Selecciona una opción</option>
                        {this.state.fabricantesdata}             
                    </Form.Control>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <Container fluid={false}>
                <Row className="mb-3">
                    <Col xs={6} md={6} lg={6} xl={6} className="ajusteinpud mb-2">    
                        <Form.Control type="text" value={this.state.busqueda} placeholder="Buscar" onChange={(e)=>this.searchBar(e)}/>
                    </Col>
                    <Col xs={3} md={3} lg={3} xl={3} className="text-center" >
                        <ToogleSwitch title="Existencias" value={this.state.existencia} onChange={this.onChangeSwitch.bind(this)} />
                    </Col>
                    <Col xs={3} md={3} lg={3} xl={3} >
                        <Button onClick={this.onClickSearchFilter.bind(this)} className="botonsearch">Buscar</Button>
                    </Col>
                </Row>
            </Container>                
        );

    }
}
export default ArtSearch;