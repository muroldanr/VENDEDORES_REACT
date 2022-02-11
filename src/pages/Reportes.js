import React from 'react';
import NewMenu from '../components/NewMenu';
import { Container, Row, Col } from 'react-bootstrap';
import Graph from '../components/CrazyGraph';
import manager from '../service-manager/api';
import routes from '../service-manager/routes';
import Loading from '../components/Loading';
import '../components/css/reportes.css';
import GaugeChart from '../components/GaugeChart';
import GraphMultipleLine from '../components/GraphMultipleLine';
import Titulo from '../components/Titulo';

class Reportes extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      data:[],      
    }
  }

  graph(){
    this.props.history.push("/DetallesReportes",{
      grafica: 'grapah'      
    })
  }
  graphLineal(){
      this.props.history.push("/DetallesReportes",{
      graficaLineal:'graphLineal'
    })
  }

  graficauno(){
    this.props.history.push("/DetallesReportes",{
      grafica:'graficaUno'
    })

  }
  /*PETICION*/
  componentDidMount(){
    this.getData();    
  }

  
  getData(){
        this.isLoading(true);
        manager.postData(routes.REPORTE_TOTAL,{})
        .then(response => {
            this.setState({data:response});
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

     isLoading(active){
        this.setState({loading: active});
    }  

    render() {        
        return (
            <div>
              <Loading active={this.state.loading}/>
              <div> 
                  <NewMenu/>
                  <div className="container-fluid" id="body_reportes">  
                  <Titulo titulo="Reportes"></Titulo>                  
                    <Container fluid={true}>                             
                          <Row className="d-flex">                              
                              <Col md={6} onClick={this.graphLineal.bind(this)} >                                
                                  <GraphMultipleLine info={this.state.dataSemana}/>                                
                              </Col>                                                                                                                                   
                              <Col md={6} className="pt-3" align="center" onClick={this.graficauno.bind(this)}>
                                  <GaugeChart/>                                  
                              </Col>
                              <Col md={6} className="pt-3" align="center" onClick={this.graph.bind(this)} >
                                  <Graph arre={this.state.data}/>
                              </Col>     
                          </Row>                     
                    </Container>
                  </div>
              </div>
            </div>
                        
            );

    }
}
export default Reportes;