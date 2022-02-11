import React from 'react';
import NewMenu from '../components/NewMenu';
import { Container, Row, Col } from 'react-bootstrap';
import Loading from '../components/Loading';
import '../components/css/detallesreportes.css';
import '../components/css/principales.css';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import GraphMultipleLine from '../components/GraphMultipleLine';
import { Button } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import Table from '../components/Table';
import Titulo from '../components/Titulo';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-date-picker';
import moment from 'moment';

class DetallesReportes extends React.Component {


  
    constructor(props) {
        super(props);

        let user = localStorage.getItem('user');

        this.state = {
            diaInicial:[],
            diaFinal:[],
            modalShow: false,
            headers: [],
            dataTabla: [],
            data: [],
            tipoReporte:"",
            respuesta:[],
            loading: false,
            dataVentas:[],
            tipo:"",
            startDate:"",
            endDate:"",
            user: (user) ? user:"",
            dateAcumulado: new Date(),
            fechaInicialFormateada: "",
            fechaFinalFormateada:"",
            reporte:"Cierres",
            periodo:"Mensual",
        };
    }

    onDateChange(date) {
        let fechaInicial = date
        let fechaInicialFormateada = fechaInicial.format('MM/DD/YY');
        this.setState({ fechaInicialFormateada: fechaInicialFormateada ,date});
    }

    onFocusChange({ focused }) {
        this.setState({ focused });
    }

    handleChange  = e => {
      this.setState({ [e.target.id]: e.target.value });
    };

    handleAno = (ano) => {
        let recibeAno = ano;
        console.log(recibeAno)
        this.getDataGraphAnual(recibeAno)
    }

    handleAcumulado = (fecha) => {
        let recibefecha = fecha;
        console.log(fecha)
        if (this.state.tipo === "acumulado") {
            this.getDataGraphAcumulado(recibefecha);
        }
    }

    onChangeAcumulado = dateAcumulado => {
        this.setState({dateAcumulado: dateAcumulado});
    }


    ponerFechas(fechaI,fechaF){
        this.setState({
            diaInicial:fechaI,
            diaFinal:fechaF,
        });
        console.log(this.state.diaInicial);
        console.log(this.state.diaFinal);
    }

    openModalSemana(tipo){
        this.setState({
            modalShow: true,
            tipo:tipo
        });
    }

    setTipoReporte(tipo){
        this.setState({
        tipo:tipo
         });
    }

    componentDidMount(){
        
    }

    isLoading(active){
        this.setState({loading: active});
    }



    formatFecha(fecha){
        if (fecha){
            let dateObject = new Date(fecha);
            let formatted_date = dateObject.getDate() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getFullYear(); 
            return formatted_date
        } else {
            return "Sin información";
        }
    }


    componentWillMount(){
       // this.getDataGraphSemana()
    }

    setHeaders(arrayVentas) {
        let headers = []
        let  headerItems = [];

        if (Array.isArray(arrayVentas)) {
            headers = arrayVentas
        }

        headerItems = headers.map((title) => 
                <th>{title.Titulo ?  title.Titulo : ""}</th>
        );
        let dia = <th></th>
        headerItems.unshift(dia);
        this.setState({
            headers: headerItems
        });
    }
     


    setData(arrayVentas,prefix) {
        let objArray  = []
        let dataVentas = [];
        if (Array.isArray(arrayVentas)) {
            objArray = arrayVentas
        }

        dataVentas = objArray.map((objV) =>
            <td>
                <NumberFormat value={objV.Real ? objV.Real : "0"} displayType={'text'} thousandSeparator={true} prefix={prefix}  decimalScale={2} className="spamprecio"/>
                <hr/>
                <NumberFormat value={objV.Presupuesto ? objV.Presupuesto : "0"} displayType={'text'} thousandSeparator={true} prefix={prefix}  decimalScale={2} className="spamprecio"/>
                <hr/>
                <NumberFormat value={objV.AnoAnterior ? objV.AnoAnterior : "0"} displayType={'text'} thousandSeparator={true} prefix={prefix}  decimalScale={2} className="spamprecio"/>
            </td>
        );

        let real = <th>Real
                    <hr/> Meta
                    <hr/> Año Anterior
          </th>

        dataVentas.unshift(real);

        this.setState({data:arrayVentas,tipoReporte:'acumulado', dataVentas: dataVentas});
    }

    setHeadersComision(arrayVentas) {
        let headers = ["Fecha","Comisión"];
        let headerItems = [];

        headerItems = headers.map((title, index) =>
            <th key={title + index}>{title}</th>
        );


        this.setState({
            headers: headerItems
        });
    }

    setDataComision(arrayVentas,prefix) {
        let objArray  = []
        let dataVentas = [];
        if (Array.isArray(arrayVentas)) {
            objArray = arrayVentas
        }

        dataVentas = objArray.map((objV) =>
            <td>
                {objV.FechaEmision ? moment(objV.FechaEmision).format('DD/MM/YY')  : "0"}
                <hr/>
                <NumberFormat value={objV.Comision ? objV.Comision: ""} displayType={'text'} thousandSeparator={true} prefix={prefix}  decimalScale={2} className="spamprecio"/>
            </td>
        );

        let real = <th>Fecha 
                    <hr/>Comisión
          </th>

        dataVentas.unshift(real);

        this.setState({data:arrayVentas,tipoReporte:'acumulado', dataVentas: dataVentas});
    }

    getDataGraph() {
        var prefix = " "
        let dia = moment( this.state.dateAcumulado).format('DD/MM/YY');
        let reporte = this.state.reporte
        let route = routes.GET_REPORTE_COHETE
        switch (reporte) {
            case "Cierres":
                    route = routes.spWebCierresGraficos
                break
            case "Comisiones":
                this.spWebFacturadoComisiones();
            break
            case "Ingresos":
                    route = routes.spWebIngresosGraficos
                    prefix = "$"
                break
            case "Oportunidades":
                    route = routes.spWebOportunidadGraficos
                break
            case "Ventas":
                    route = routes.spWebVentaGraficos
                    prefix = "$"
                break
            case "Visitas":
                    route = routes.spWebVisitaGraficos
                break
            case "WhatsApp":
                    route = routes.spWebWhatsAppGraficos
                break
            case "Llamadas":
                    route = routes.spWebLlamadaGraficos
                break
            case "Emails":
                    route = routes.spWebCorreoGraficos
                break
            case "Entrada Global" :
                    route = routes.spWebPersonaGraficos
                break
            default:
                    route = routes.spWebCierresGraficos
                break
        }

        if(reporte === "Comisiones"){
            return
        }
        

        this.isLoading(true);
        manager.postData(route,{'WebUsuario':localStorage.getItem('user'),'Fecha':dia,'Sucursal':localStorage.getItem("sucursal"),"Periodo":this.state.periodo})
        .then(response => {
            this.setHeaders(response);
            this.setData(response,prefix)
            this.isLoading(false);
        })
        .catch(error =>{
            console.log(error);
            //const {code, message} = error
            let code = 500;
            if(code === 401){
                this.isLoading(false)
            }else {
                this.isLoading(false)
            }
        });
    }

    
    spWebFacturadoComisiones = () => {
        let fechaA = moment( this.state.dateAcumulado).format('DD/MM/YY');
        var d = new Date(this.state.dateAcumulado);
        d.setMonth(d.getMonth() - 1);
        let fechaD = moment( d).format('DD/MM/YY');
        var prefix = "$"
        this.isLoading(true);
        manager.postData(routes.spWebFacturadoComisiones,{'UsuarioWeb':localStorage.getItem('user'),'FechaD':fechaD,'FechaA':fechaA})
        .then(response => {
            this.setHeaders(response);
            this.setDataComision(response,prefix)
            this.isLoading(false);
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

    render() {  
        return (
            <div>
                <Loading active={this.state.loading}/>
                 <div> 
                     <NewMenu/>
                     <Container fluid={true} id="body_DetallesReportes">
                     <Titulo titulo="Reportes"/>
                        <Container>
                              <Row className="pt-3">
                                    <Col xs={3} md={3}  lg={3} xl={3}>
                                        <center className="mt-1">
                                            <DatePicker
                                              onChange={this.onChangeAcumulado}
                                              value={this.state.dateAcumulado}
                                            />
                                        </center>
                                    </Col>
                                    <Col className="mb-3 cuerpoModal" xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <Form.Control as="select" id="reporte" onChange={this.handleChange} value={this.state.reporte}>
                                            <option>Cierres</option>
                                            <option>Comisiones</option>
                                            <option>Emails</option>
                                            <option>Entrada Global</option>
                                            <option>Ingresos</option>
                                            <option>Llamadas</option>
                                            <option>Oportunidades</option>
                                            <option>Ventas</option>
                                            <option>Visitas</option>
                                            <option>WhatsApp</option>
                                        </Form.Control>
                                    </Col>
                                    <Col className="mb-3 cuerpoModal" xs={3} sm={3} md={3} lg={3} xl={3}>
                                        <Form.Control as="select" id="periodo" onChange={this.handleChange} value={this.state.periodo}>
                                            <option>Mensual</option>
                                            <option>Semanal</option>
                                            <option>Diario</option>    
                                        </Form.Control>
                                    </Col>
                                    <Col xs={3} md={3}  lg={3} xl={3}>
                                        <Button className="botonsear"  onClick= {() => this.getDataGraph()}>Buscar</Button>
                                    </Col>
                              </Row>
                        </Container>
                        <Row>
                            <Col md={12}  lg={12} xl={12} className="text-center">
                                { this.state.reporte === "Comisiones" ? 
                                    <GraphMultipleLine tipo={"comisiones"} datos={this.state.data}/> 
                                    : 
                                    <GraphMultipleLine tipo={"comparativo"} datos={this.state.data}/>
                                }
                            </Col>
                        </Row>
                        <Row>
                             <Col md={12}  lg={12} xl={12} className="mt-2">
                               <Table headers={this.state.headers} data={this.state.dataVentas}/>
                             </Col>
                        </Row>
                     </Container>
                </div>
            </div>

            );

    }
}
export default DetallesReportes;