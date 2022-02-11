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
import ModalRangeCalenda from '../components/ModalRangeCalenda';
import Table from '../components/Table';
import Titulo from '../components/Titulo';


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
            user: (user) ? user:""
        };
    }

    handleChange = (startDateValue) => {
        let fechaInicial = startDateValue[0];
        let fechaFinal = startDateValue[1];
        if (this.state.tipo === "semana") {
            this.getDataGraphSemana(fechaInicial,fechaFinal);
        }
        if (this.state.tipo === "cohete") {
            this.getDataGraphCohete(fechaInicial, fechaFinal);
        }
    }

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

    setHeaders(arrayVentas) {
        let headers = arrayVentas

        let headerItems = [];

        headerItems = headers.map((title) => 
                <th>{title.Fecha ?  title.Fecha : ""}</th>
        );
        let dia = <th>Dia</th>
        headerItems.unshift(dia);
        this.setState({
            headers: headerItems
        });
    }

    setHeadersAnual(arrayVentas) {
        let headers = arrayVentas

        let headerItems = [];

        headerItems = headers.map((title) => 
                <th>{title.NombreMes ?  title.NombreMes : ""}</th>
        );
        let dia = <th>Dia</th>
        headerItems.unshift(dia);
        this.setState({
            headers: headerItems
        });
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
     


    setData(arrayVentas,tipo) {
       let objArray = arrayVentas
        if(arrayVentas === undefined){
            objArray = []
        }
        let dataVentas = [];

        if(tipo==='ano')
        {
            dataVentas = objArray.map((objV) =>
                    <td><NumberFormat value={objV.ImporteReal ? objV.ImporteReal : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$'}  decimalScale={2} className="spamprecio"/></td>
            );
        } else if (tipo === "cohete") {
            dataVentas = objArray.map((objV) =>
                <td>
                    <NumberFormat value={objV.Importe ? objV.Importe : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$'}  decimalScale={2} className="spamprecio"/>
                    <hr/>
                    <NumberFormat value={objV.Presupuesto ? objV.Presupuesto : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$'}  decimalScale={2} className="spamprecio"/>
                </td>
            );
        }
        else {
            dataVentas = objArray.map((objV) =>
                <td><NumberFormat value={objV.Ingreso ? objV.Ingreso : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$'}  decimalScale={2} className="spamprecio"/></td>
            );
        }

        let real = <th>Real</th>

        if (tipo === "cohete") {
            real = <th>Real vs Meta</th>
        }

        dataVentas.unshift(real);

        this.setState({data:arrayVentas,tipoReporte:tipo, dataVentas: dataVentas});
    }

    getDataGraphCohete(ano, mes) {
        this.isLoading(true);
        manager.postData(routes.GET_REPORTE_COHETE,{'WebUsuario':this.state.user,'Ejericio':ano,'Periodo':mes})
        .then(response => {
            this.setHeadersCohete(response);
            this.setData(response,"cohete")
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
    
    getDataGraphSemana(fechaI,fechaF){
        this.isLoading(true);
        manager.postData(routes.GET_REPORTE_SEMANAL_ACUM,{'WebUsuario':localStorage.getItem('user'), 'Empresa':localStorage.getItem('empresa'),'Ejericio':fechaI,'Periodo':fechaF + 1})
        .then(response => {            
            this.setHeaders(response);
            this.setData(response,"semana")
            console.log(this.state.data)
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
        })
    }

    getDataGraphMes(){
       this.isLoading(true);
        manager.postData(routes.GET_REPORTE_MENSUAL_ACUM,{'WebUsuario':localStorage.getItem('user'),'Empresa':localStorage.getItem('empresa'),'Ejericio ': 2017,'Periodo': 12 })
        .then(response => {
            this.setHeaders(response);
            this.setData(response,"mes")
            console.log(this.state.data)
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
        })
    }


     getDataGraphAnual(ano){
       this.isLoading(true);
        manager.postData(routes.GET_REPORTE_MENSUAL_ACUM,{'WebUsuario':localStorage.getItem('user'),'Empresa':localStorage.getItem('empresa'),'Ejericio': ano })
        .then(response => {
           this.setHeadersAnual(response);
           this.setData(response,"ano")
           console.log(this.state.data)
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
        })
    }

    getDataGraphAcumulado(fecha){
       this.isLoading(true);
        manager.postData(routes.GET_REPORTE_ACUM,{'WebUsuario': localStorage.getItem('user'),'Fecha':fecha})
        .then(response => {
            this.setHeadersAcumulado(response);
            this.setDataAcumulado(response,"acumulado")
            console.log(this.state.data)
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
        })
    }

    setHeadersAcumulado(arrayVentas) {
        let headers = arrayVentas

        let headerItems = [];

        headerItems = headers.map((title) => 
                <th>{title.FechaNombre ?  title.FechaNombre : ""}</th>
        );
        let dia = <th>Dia</th>
        headerItems.unshift(dia);
        this.setState({
            headers: headerItems
        });
    }


    setHeadersCohete(arrayCohete) {
        let headers = arrayCohete;

        let headerItems = [];

        headerItems = headers.map((title) => 
            <th>{ title.FechaNombre }</th>
        );
        let dia = <th>Día</th>
        headerItems.unshift(dia);
        this.setState({
            headers: headerItems
        });
    }


    setDataAcumulado(arrayVentas,tipo) {
       let objArray = arrayVentas
        if(arrayVentas === undefined){
            objArray = []
        }
        let dataVentas = [];
            dataVentas = objArray.map((objV) =>
                    <td><NumberFormat value={objV.Importe ? objV.Importe : "Sin información"} displayType={'text'} thousandSeparator={true} prefix={'$'}  decimalScale={2} className="spamprecio"/></td>
            );
        let real = <th>Real</th>
        dataVentas.unshift(real);

        this.setState({data:arrayVentas,tipoReporte:tipo,dataVentas: dataVentas});
    }



    decidirGraph(){
      return <GraphMultipleLine tipo={this.state.tipoReporte} datos={this.state.data}/>
    }

    render() {  
        let modalClose = () => this.setState({ modalShow: false });
        return (
            <div>
                <Loading active={this.state.loading}/>
                 <div> 
                     <NewMenu/>
                     <Container fluid={true} id="body_DetallesReportes">
                     <Titulo titulo="Reporte Ventas"/>
                        <Container>
                              <Row className="pt-3">
                                   <Col xs={3} md={3}  lg={3} xl={3}>
                                       <Button className="botonsear"  onClick= {() => this.openModalSemana("acumulado")}>Acumulado</Button>
                                   </Col>
                                  <Col xs={3} md={3}  lg={3} xl={3}>
                                       <Button className="botonsear"  onClick= {() => this.getDataGraphSemana("2019","08")}>Semanal</Button>
                                   </Col>
                                   <Col xs={3} md={3}  lg={3} xl={3}>
                                       <Button className="botonsear"   onClick={() => this.openModalSemana("mes")}>Mensual</Button>
                                   </Col>
                                   <Col xs={3} md={3}  lg={3} xl={3}>
                                       <Button className="botonsear"   onClick={() => this.openModalSemana("cohete")}>Cohete</Button>
                                   </Col>
                              </Row>
                        </Container>
                        <Row>
                            <Col md={12}  lg={12} xl={12} className="text-center">
                               {this.decidirGraph()}
                            </Col>
                        </Row>
                         <ModalRangeCalenda
                             show={this.state.modalShow}
                             type={this.state.tipo}
                             onHide={modalClose}
                             diaSeleccionado={this.handleChange}
                             anoSeleccionado={this.handleAno}
                             diaAcumulado={this.handleAcumulado}
                             />
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