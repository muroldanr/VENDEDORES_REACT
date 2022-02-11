import React from 'react';
import PrinHeader from '../components/PrinHeader';
import PrinBotones from '../components/PrinBotones';
import Table from '../components/Table';
import NewMenu from '../components/NewMenu';
import '../components/css/principales.css';
import '../components/css/clientDetail.css';
import '../components/css/carrito.css';
import Titulo from '../components/Titulo';
import BotonFlotante from '../components/BotonFlotante';
import { Button } from 'react-bootstrap';
import ModalClientes from '../components/ModalClientes';
import Loading from '../components/Loading';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import swal from 'sweetalert';



class Principales extends React.Component {

    constructor(props) {
        super(props);
        let user = localStorage.getItem('user');
        this.state = {
            headers: [],
            data: [],
            mostrar: false,
            loading:false,
            user: (user) ? user:"",
            pipelineData: []
        };
    }

    getResponsable(){
       this.isLoading(true);
        manager.postData(routes.GET_GERENTE,{WebUsuario:localStorage.getItem('user')})
        .then(response => {
            if(response[0].Usuario !== "")
            localStorage.setItem('responsable', response[0].Usuario ? response[0].Usuario : "")   
            this.isLoading(false);
        })
        .catch(error =>{
            let code = error
             this.isLoading(false)
            if (code === undefined) {
              code=500;
            }
            if(code === 401){
                console.log(code);
            }
            
        });
    }

    componentDidMount() {
        let responsable = localStorage.getItem('responsable');
        if(!responsable){
            this.getResponsable();
        }
        this.setHeaders();
        

    }

    isLoading(active){
        this.setState({loading: active});
    }

    reqPipelineGraph() {
        this.isLoading(true);
        manager.postData(routes.REPORTE_PIPELINE,{
            UsuarioWeb: this.state.user, Ejecutar: true,
        })
        .then(response => {
            if (typeof response === "object" && response.length > 0) {
                this.setState({
                    pipelineData: response
                });
            }
            this.getData();
        }).catch(error =>{
            this.isLoading(false);
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        });
    }

    setHeaders() {
        let headers = ["Cliente", "Actividad","Fecha","Titulo","Movimiento"];

        let headerItems = [];

        headerItems = headers.map((title, index) =>
                <th key={title + index}>{title}</th>
        );

        this.setState({
            headers: headerItems
        });
    }

    getData(){  
        this.isLoading(true);
        manager.postData(routes.GET_AGENDA_DIA,{WebUsuario:localStorage.getItem('user')})
        .then(response => {
            this.setData(response);
            this.isLoading(false);
        })
        .catch(error =>{
            let code = error
             this.isLoading(false)
            if (code === undefined) {
              code=500;
            }
            if(code === 401){
                console.log(code);
            }
            
        });
    }  

    setData(response) {
        let objArray = []
        
        if(response){
            objArray = response
        }

        let data = [];
        data = objArray.map((objV, index) =>
            <tr onClick= {(e) => this.registrarActividad()} key={index + objV.Nombre} >
                <td> {objV.Nombre}</td>
                <td>{objV.Medio}</td>
                <td>{this.formatFecha(objV.FechaInicio)}</td>
                <td>{objV.Titulo}</td>
                <td>{objV.Origen +" "+objV.OrigenID}</td>
            </tr>
        );

        this.setState({
            data: data
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

    registrarActividad(){
      this.props.history.push({
         pathname:'/agenda'
      });
    }
    

    handleClickClientes(active) {
        this.setState({mostrar: active});
    }

    render() {

        return (              
            <React.Fragment>
                <NewMenu/> 
                <Loading active={this.state.loading}/>                            
                <div className="container-fluid" id="body_principales">
                    <Titulo titulo="Hoy"/>
                    {
                        
                        (this.state.pipelineData.length) ?
                        <PrinHeader data={this.state.pipelineData} />
                        :
                        <div style={{'marginBottom': '17%'}}>
                            <center >  
                                <Button className="botonpipeline" onClick={()=> this.reqPipelineGraph()} >
                                    PIPELINE
                                </Button>
                            </center>
                        </div> 
                    

                    }
                   
                     
                  
                    <PrinBotones history={this.props.history}/>
                    <Table headers={this.state.headers} data={this.state.data}/>
                </div>
                <ModalClientes mostrar={this.state.mostrar} isCarrito={false} loading={this.isLoading.bind(this)} isShow={this.handleClickClientes.bind(this)}/>
                <BotonFlotante onClickClientes={this.handleClickClientes.bind(this)}/>
            </React.Fragment>
        );

    }
}
export default Principales;