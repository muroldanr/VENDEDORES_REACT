import React from 'react';
import Carrusel from '../components/Carrusel';
import Table from '../components/Table';
import {Row, Col, Container ,Button} from 'react-bootstrap';
import NewMenu from '../components/NewMenu';
import BotonCarrito from '../components/BotonCarrito';
import '../components/css/product_details.css';
import NumberFormat from 'react-number-format';
import Titulo from '../components/Titulo';
import Form from 'react-bootstrap/Form';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import Loading from '../components/Loading';
import Camara from '../components/Camara';
import Modal from 'react-bootstrap/Modal';
import BotonesDeNumeros from '../components/BotonesDeNumeros';
import BotonesSearch from '../components/BotonesSearch';
import '../components/css/elements.css';
import ListaArticulos from '../components/ListaArticulos';
import ToogleSwitch from '../components/ToogleSwitch';
import BotonFlotante from '../components/BotonFlotante';
import ModalClientes from '../components/ModalClientes';

class ProductDetail extends React.Component {

    constructor(props) {
        super(props);

        let empresa = localStorage.getItem('empresa');
        let user = localStorage.getItem('user');

        this.state = {
            headers: [],
            data: [],
            headersTwo:[],
            loading: false,
            dataTwo:[],
            busqueda:"",
            sumatoria:1,
            objetoarticulo:[],
            listaDeObjetos:[],
            show: false,
            showCamera: false,
            showArticulos: false,
            articulo: "",
            empresa: (empresa) ? empresa:'',
            articuloView: [],
            existencia: true,
            user: (user) ? user:'',
            mostrar:false,
            backorder: ""
        }
    }

    componentDidMount() {
        if (this.state.articulo) {
            this.reqCargarPrecios();
        }
    }

    reqBuscarArticulos() {
        this.isLoading(true);

        manager.postData(routes.GET_ARTICULOS,{
            UsuarioWeb: this.state.user,
            Articulo: this.state.busqueda,
            Disponible: this.state.existencia
        })
        .then(response => {
            this.isLoading(false);
            this.setState({
                articulo: undefined,
                articulos: response,
                articuloView: []
            });
            this.condicionalDetalle();
        })
        .catch(error =>{

            this.isLoading(false);

            let {code} = error;

            if(code===undefined){
                code = 500;
            }
            if(code === 401){}
            else {}
        });
    }

    reqCargarAlmacenes() {
        this.isLoading(true);

        manager.postData(routes.GET_ARTICULOS_DISPONIBLES, {
            'Empresa': this.state.empresa,
            'Articulo': this.state.articulo.Articulo
        })
        .then(response => {
            this.setDataTwo(response);
            this.setHeaders();
            this.cargarArticulo();
            this.reqBackOrder();
        })
        .catch(error =>{
            console.log(error);
            //const {code, message} = error
            let code = 500;
            if(code === 401){
                console.log(code);
                this.isLoading(false)
            }else {
                console.log(code);
                this.isLoading(false)
            }
        });
    }

    reqBackOrder() {
        this.isLoading(true);

        manager.postData(routes.GET_BACKORDER, {
            'UsuarioWeb': localStorage.getItem('user'),
            'Articulo': this.state.articulo.Articulo
        })
        .then(response => {
            let backOrder = response[0]["Backorder"]
            let back = ""
            back = response[0]["Backorder"]
            if (back){     
                back = 
                <Button variant="light">
                    <h6>{"BackOrder  "}
                        <NumberFormat value={backOrder} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/>
                    </h6>
                </Button>
                
            }
            this.setState({backorder: back})
            this.isLoading(false)
        })
        .catch(error =>{
            console.log(error);
            //const {code, message} = error
            let code = 500;
            if(code === 401){
                console.log(code);
                this.isLoading(false)
            }else {
                console.log(code);
                this.isLoading(false)
            }
        });
    }

    reqCargarPrecios(clickArticulo) {

        let articulo = this.state.articulo;
        console.log("soy articulo:" + clickArticulo)

        if (articulo === undefined) {

            this.setState({
                articulo: clickArticulo
            });

            articulo = clickArticulo;
        }

        this.isLoading(true);
        manager.postData(routes.GET_PRECIO_POLITICA_LISTA, {'WebUsuario': localStorage.getItem('user'), 'Articulo': articulo.Articulo, 'Almacen': articulo.Almacen })
        .then(response => {
            this.setData(response);
            this.reqCargarAlmacenes();
        })
        .catch(error =>{
            this.isLoading(false);

            let {code} = error;

            if(code===undefined){
               code = 500;
            }
            if(code === 401){

            }else {

            }
        });
    }

    condicionalDetalle() {
        if (this.state.articulos.length > 0) {
            if (this.state.articulos.length === 1) {
                this.setState({
                    articulo: this.state.articulos[0],
                    articulos: []
                });
                this.reqCargarPrecios();
                return;
            }

            this.handleShowArticulos();
        }
    }

    handleShowArticulos() {
        this.setState({
            showArticulos: true
        });
    }

    changeSearchString(event){
        this.setState({
            busqueda: event.target.value
        });
    }

    onChangeSwitch(existencia) {
        this.setState({
            existencia: existencia
        });
    }

    handleSearch(event) {
        if (this.state.busqueda) {
            this.reqBuscarArticulos();
        }
    }

    handleSelectArticulo(articulo) {

        this.handleClose();

        this.setState({
            articulo: articulo,
            articulos: []
        });

        this.reqCargarPrecios(articulo);
    }

    sum(sum) {
        let articulo = this.state.articulo;
        articulo.Cantidad = sum;
        this.setState({
            sumatoria: sum,
            articulo: articulo
        });
    }

    setHeaders() {
        this.setHeadersOne();
        this.setHeadersTwo();
    }

    setHeadersOne() {
        let headers = ["Precio", 'MXN'];

        let headerItems = [];

        headerItems = headers.map((title) =>
            <th key={title} >{title}</th>
        );
        this.setState({
            headers: headerItems
        });
    }

    setHeadersTwo() {
        let headers = ["Almacén", "Existencias"];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );

        this.setState({
            headersTwo: headerItems
        });
    }

    makeUrl(articulo) {
      return routes.FILES + encodeURI(articulo);
    }

    setData(precios) {

        let data = [];
        let articulo = undefined;

        if (this.state.articulo) {
            articulo = this.state.articulo;
        }

        data = precios.map((objV) => {

             articulo.Precio = objV.PrecioLista;
             articulo.Precio2 = (objV.Contado) ? objV.Contado:objV.PrecioLista;
             articulo.Precio3 = (objV.MSI) ? objV.MSI:objV.PrecioLista;
             articulo.Cantidad = 1;

             return (<React.Fragment key={objV.PrecioLista}>
                    <tr>
                        <td><h6>Regular </h6></td>
                        <td> <NumberFormat value={objV.PrecioLista} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/></td>
                    </tr>
                    <tr>
                        <td><h6>12 Meses <div className={ objV.DescMSI ? 'badge-custom' : 'badge-custom-none'}>{ objV.DescMSI+"%"}</div></h6></td>
                        <td> <NumberFormat value={articulo.Precio3} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/></td>
                    </tr>
                    <tr>
                        <td><h6>Contado <div className={ objV.DescContado ? 'badge-custom' : 'badge-custom-none'}>{objV.DescContado+"%"}</div></h6></td>
                        <td> <NumberFormat value={articulo.Precio2} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} className="spamprecio"/></td>
                    </tr>
                </React.Fragment>)
            });

        data.push(
            <tr key="cantidad-fixed">
              <td className="md">Cantidad</td>
              <td className="md"><BotonesDeNumeros cantidad={1} suma={this.sum.bind(this)} /></td>
            </tr>
        );

        this.setState({
            data: data,
            articulo: articulo
        });
    }

    setDataTwo(almacenes) {

        let data = [];

        data = almacenes.map((objV, index) =>
            <tr key={ objV.Nombre + index}>
                <td> {objV.Nombre}</td>
                <td> <NumberFormat value={objV.Disponible} displayType={'text'} thousandSeparator={true} decimalScale={0} className="spamprecio"/></td>
            </tr>
        );

        this.setState({
            dataTwo: data
        });
    }

    cargarArticulo() {
        let viewArticulo = [];

        if (this.state.articulo) {
            viewArticulo.push(
                <Row key="content-carrusel">
                    <Col xs={12} >
                      <center>
                        <hr className="style2"/>
                          <h4>{this.state.articulo.Descripcion}</h4>
                        <hr className="style2"/>
                      </center>
                    </Col>
                    <Col>
                        <Container className="content-carrusel-detalle">
                            <Carrusel producto={this.state.articulo}/>
                        </Container>
                        <Container>
                            <div className="detalle-carrito-button">
                                <BotonCarrito cant={this.state.sumatoria} producto={this.state.articulo}  history={this.props.history}/>
                            </div>
                        </Container>
                    </Col>
                    <Col>
                        <Table headers={this.state.headers} data={this.state.data}/>
                        <Table headers={this.state.headersTwo} data={this.state.dataTwo} />
                    </Col>
                </Row>
            );
        }

        this.setState({
            articuloView: viewArticulo
        });
    }

    handleShowCamera(){
        this.setState({
            showCamera: true
        });
    }

    handleClose() {
        this.setState({
            show: false,
            showCamera: false,
            showArticulos: false
        });
    }

    handleScanCamara(busqueda){
        this.setState({
            show: false,
            showCamera: false,
            showArticulos: false,
            busqueda: busqueda
        }, function() {
            this.reqBuscarArticulos();
        });
    }

    isLoading(active){
      this.setState({loading: active});
    }

    handleClickClientes(active) {
        this.setState({mostrar: active});
    }

    render() {
        return (
            <React.Fragment>
              <Loading active={this.state.loading}/>
              <NewMenu/>
              <Container id="body_productDetail" fluid={true}>
                <Titulo titulo="Cotizar"></Titulo>
                <Container fluid={true} className="mb-0">
                  <Row className="mt-3 mb-0">
                    <Col  xs={4} md={4} lg={4} xl={4} className="mb-0">
                        <Form.Control value={this.state.busqueda} type="text" placeholder="Buscar" text="Escribe el artículo aquí..." onChange={ this.changeSearchString.bind(this) } />
                    </Col>
                    <Col xs={4} md={4} lg={4} xl={4} className="mb-0">
                         <Row >
                            <Col xs={8} md={8} lg={8} xl={8} className="mb-0">
                                <ToogleSwitch title="Existencias" value={this.state.existencia} onChange={this.onChangeSwitch.bind(this)} />
                            </Col>
                            <Col xs={4} md={4} lg={4} xl={4} className="mb-0">
                                {this.state.backorder}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={4} md={4} lg={4} xl={4} className="mb-0">
                        <BotonesSearch clickSearch={this.handleSearch.bind(this)} clickCamera={this.handleShowCamera.bind(this)} />
                    </Col>
                  </Row>
                </Container>
                <Container fluid={true}>
                    {this.state.articuloView}
                </Container>
                <Container className="modal-camara mb-0">
                    <Modal 
                        dialogClassName="modal-90w"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered show={this.state.showCamera}
                        onHide={this.handleClose.bind(this)}>
                      <Modal.Header closeButton>
                          <Modal.Title>Captura QR</Modal.Title>
                      </Modal.Header>
                      <Modal.Body fluid={true}>
                           <Camara onScan={this.handleScanCamara.bind(this)} value={"Camara"}/>
                      </Modal.Body>
                      <Modal.Footer>
                      </Modal.Footer>
                    </Modal>
                </Container>
                <Container className="modal-articulos mb-0">
                    <Modal 
                      dialogClassName="modal-90w"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered show={ this.state.showArticulos }
                      onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Selecciona un articulo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Container fluid={true}>
                          <Row>
                            <ListaArticulos articulos={this.state.articulos} clickArticulo={this.handleSelectArticulo.bind(this)} disponible={this.state.existencia} />
                          </Row>
                      </Container>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                    </Modal>
                </Container>
                <ModalClientes mostrar={this.state.mostrar}  isCarrito={false} loading={this.isLoading.bind(this)} isShow={this.handleClickClientes.bind(this)}/>
                <BotonFlotante onClickClientes={this.handleClickClientes.bind(this)}/>
              </Container>
            </React.Fragment>
        );
    }
}

export default ProductDetail;