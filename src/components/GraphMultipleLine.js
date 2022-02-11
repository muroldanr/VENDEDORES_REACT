import React from 'react';
import Chart from 'react-google-charts';
import moment from 'moment';
import esLocale from 'moment/locale/es';
import './css/elements.css';

class GraphMultipleLine extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        loading: false,     
        dataSemana:[],
        datos:[],
        format: '',
        width : 0,
        height : 0,
      }
    }

    isLoading(active){
        this.setState({loading: active});
    }

    componentDidMount(){
      //this.getDataGraphLineOne();  
    }
    componentWillReceiveProps(props){
        switch(props.tipo) {
            case 'semana':
                this.dibujarGraficaSemana(props.datos);
            break;
            case 'cohete':
                this.dibujarGraficaCohete(props.datos);
            break;
            case 'mes':
                this.dibujarGraficaMes(props.datos);
            break;  
            case 'acumulado':
                this.dibujarGraficaAcumulado(props.datos);
            break;      
            case 'ano':
                this.dibujarGraficaAno(props.datos);
            break;
             case 'comparativo':
                this.dibujarGraficaComparativo(props.datos);
            break;
            case 'comisiones':
                this.dibujarGraficaComisiones(props.datos);
            break;
            default:
                this.dibujarGraficaAno(props.datos);
            break;
          
        }

    }

    dibujarGraficaAcumulado(datos){
        let objArray = datos
        if(datos === undefined){
            objArray = []
        }
        let data = [];

        data = objArray.map((objV,index) => { 
            //var event = new Date(objV.Fecha);
            //var options = {  year: 'numeric', month: 'numeric', day: 'numeric' };
            //let dia = event.toLocaleDateString('es-MX', options);
            let x =  [objV.FechaNombre, parseFloat(objV.Importe),new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(objV.Importe)];
                return x ;
            });
        let titulos = ['Fecha','Ventas',{type: 'string', role: 'annotation'}];
        //let init = [0,0];
        //data.unshift(init);
        data.unshift(titulos);
        console.log(data);
        this.setState({datos: data,format: 'dd/MM/yy'});
    }


    dibujarGraficaCohete(datos) {
        let objArray = datos

        if(datos === undefined){
            objArray = []
        }

        let titulos = [
            { label: 'Día', role: 'domain'},
            {serie: 0, label:'Meta', role:'data', type:'number'},
            {type: 'string', role:'annotationText'},
            {serie: 1, label:'Importe', role:'data', type:'number'},
            {type: 'string', role:'annotationText'},
        ];
        let data = [];

        data = objArray.map((objV,index) => { 
            let x = [
                        objV.FechaNombre,
                        parseFloat(objV.Presupuesto),
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(objV.Presupuesto),
                        parseFloat(objV.Importe),
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(objV.Importe),
                    ];
            return x ;
        });

        data.unshift(titulos);

        this.setState({datos: data, format: 'dd/MM/yy'});
    }


    dibujarGraficaComparativo(datos) {
        let objArray = datos

        if(datos === undefined){
            objArray = []
        }

        let titulos = [
            { label: 'Día', role: 'domain'},
            {serie: 0, label:'Meta', role:'data', type:'number'},
            {type: 'string', role:'annotationText'},
            {serie: 1, label:'Año Anterior', role:'data', type:'number'},
            {type: 'string', role:'annotationText'},
            {serie: 2, label:'Real', role:'data', type:'number'},
            {type: 'string', role:'annotationText'},
        ];
        let data = [];

        data = objArray.map((objV,index) => { 
            let presupuesto = parseFloat(objV.Presupuesto) ? parseFloat(objV.Presupuesto) : 0
            let AnoAnterior = parseFloat(objV.AnoAnterior) ? parseFloat(objV.AnoAnterior) : 0
            let Real = parseFloat(objV.Real) ? parseFloat(objV.Real) : 0
            let x = [
                        objV.FechaNombre,
                        presupuesto,
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(objV.Presupuesto),
                        AnoAnterior,
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(objV.AnoAnterior),
                        Real,
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(objV.Real),
                    ];
            return x ;
        });

        data.unshift(titulos);

        this.setState({datos: data, format: 'dd/MM/yy'});
    }



    dibujarGraficaSemana(datos){
        let objArray = datos
        if(datos === undefined){
            objArray = []
        }
        let data = [];

        data = objArray.map((objV,index) => { 
            let x = [
                        objV.Fecha,
                        parseFloat(objV.Ingreso),
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(objV.Ingreso)
                    ];
            return x ;
        });
        let titulos = ['Fecha','Ventas',{type: 'string', role: 'annotation'}];
        data.unshift(titulos);
        this.setState({datos: data,format: 'dd/MM/yy'});
    }


    dibujarGraficaMes(datos){
        let objArray = datos
        if(datos === undefined){
            objArray = []
        }
        let data = [];

        data = objArray.map((objV,index) => { 
            let x =  [objV.ImporteReal,objV.Dia,null,'An all time high!'];
                return x ;
            });
        let titulos = ["ventas","tiempo",{type: 'string', role: 'annotation'}];
        let init = [0,0,0];
        data.unshift(init);
        data.unshift(titulos);        
        this.setState({datos: data, format: 'dd/MM/yy'});
    }

    dibujarGraficaAno(datos){
        let objArray = datos
        if(datos === undefined){
            objArray = []
        }
        let data = [];
        data = objArray.map((objV,index) => { 
            let x = [
                        objV.Mes,
                        parseFloat(objV.ImporteReal),
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(objV.ImporteReal)
                    ];
            return x ;
        });
        let titulos = ["Tiempo","Ventas",{type: 'string', role: 'annotation'}];
        data.unshift(titulos);
        this.setState({datos: data,format: 'dd/MM/yy'});
    }

    dibujarGraficaComisiones(datos){
        let objArray = datos
        if(datos === undefined){
            objArray = []
        }
        let data = [];
        data = objArray.map((objV,index) => { 
            let x = [
                        moment(objV.FechaEmision).format('DD/MM/YY'),
                        parseFloat(objV.Comision),
                        new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD',minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(objV.Comision)
                    ];
            return x ;
        });
        let titulos = ["Tiempo","Comisiones",{type: 'string', role: 'annotation'}];
        data.unshift(titulos);
        this.setState({datos: data,format: 'dd/MM/yy'});
    }

    render(){
         moment.locale('es', esLocale);
        return(
            <React.Fragment >
                {
                    (this.state.datos.length > 1)
                    ?
                    <div className="chart-content" >
                        <Chart
                          width={'1500px'}
                          height={'750px'}
                          chartType="LineChart"
                          loader={<div className="loading-graph">Cargando gráfica....</div>}
                          data= {this.state.datos}
                          options={{
                            chartArea: {
                                width: '90%',
                                height: '90%'
                            },
                            hAxis: {
                              title: '',
                              format: this.state.format
                            },
                            vAxis: {
                              title: 'Ventas',
                              format: 'short',
                            },
                            viewWindow:  { min: 0, max: 15 },
                            series: {
                                0: {
                                    color: '#060300',
                                    pointShape: 'circle'
                                },
                                1: {
                                    color: '#717171',
                                    pointShape: 'circle'
                                },
                                2: {
                                    color: '#FF5757',
                                    pointShape: 'circle'
                                },
                            },
                            legend: "none",
                            focusTarget: 'category'
                          }}
                          rootProps={{ 'data-testid': '2' }}
                        />
                    </div>
                    :
                    null
                }
            </React.Fragment>
        );

    }
}

export default GraphMultipleLine;
