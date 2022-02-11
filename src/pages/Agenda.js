import React from 'react';
import NewMenu from '../components/NewMenu';
import BotonFlotante from '../components/BotonFlotante';
import BigCalendario from '../components/BigCalendar';
import routes from '../service-manager/routes';
import Loading from '../components/Loading';
import manager from '../service-manager/api'
import '../components/css/agenda.css';
import ModalClientes from '../components/ModalClientes';

  

class Agenda extends React.Component {

    constructor(props){
      super(props);

      let cliente = localStorage.getItem('clienteCliente');

      this.state = { 
        form:{},
        cliente: cliente,
        calendarEvents: [],
        loading:false,
        mostrarClientes:false
      };
    }

    componentDidMount(){
        this.datosActividad();
    }

    isLoading(active){
        this.setState({loading: active});
    }

    datosActividad(){
        this.isLoading(true);
        manager.postData(routes.GET_ACTIVIDADES_VENDEDOR,{'WebUsuario':localStorage.getItem('user')})
        .then(response => {
           this.setData(response);
           this.isLoading(false);
        })
        .catch(error =>{
            let {code} = error;
            if (code === undefined) {
                code = 500;
            }
            if(code === 401){
                console.log(code);
                this.isLoading(false)
            }else {
                console.log(code);
                this.isLoading(false)
            }
        })

    }

    setData(response){
        let objData = []
        if(response)
            objData = response;
        
        this.setState({calendarEvents:objData});
    }

    handleClickClientes(active) {
        this.setState({mostrarClientes: active});
    }

    isRecargar(active){
        this.datosActividad()
    }

    handelIsShow(){
          this.setState({mostrarClientes: false});
    }


    autoclick() {
        let autoclick = false;

        if (this.props.history.location && this.props.history.location.state) {
            if (this.props.history.location.state.origen) {
              if (this.props.history.location.state.origen === "seguimiento") {
                  autoclick = true;
              }
            }
        }

        return autoclick;
    }
    
    render() {        
        return (
            <div> 
                <Loading active={this.state.loading}/>
                <NewMenu/>
                <div className="container-fluid" id="body_agenda" fondo="mifondo">                   
                    <BigCalendario autoclick={this.autoclick()} loading={this.isLoading.bind(this)} calendarEvents={this.state.calendarEvents} recargar={this.isRecargar.bind(this)} history={this.props.history}/>
                    <ModalClientes mostrar={this.state.mostrarClientes} sloading={this.isLoading.bind(this)} isShow={this.handleClickClientes.bind(this)}/>
                    <BotonFlotante onClickClientes={this.handleClickClientes.bind(this)}/>
                </div>
            </div>
        );
    }
}
export default Agenda;
