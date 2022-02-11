import React from 'react';
import {Row, Col } from 'react-bootstrap';
import './css/fuenteComponent.css';

class FuenteComponent extends React.Component{


    constructor(props){
       super(props);

       this.state = {
         selected: []
       };
    }

    handleSelected(event, value) {

      let selected = this.state.selected;

      this.pushElement(event, selected, value);

      this.setState({
        selected: selected
      });

      if (this.props.onSelectCheckbox) {
        this.props.onSelectCheckbox(selected);
      }
    }

    pushElement(event, array, value) {
      if (event.target.checked) {
        array.push(value);
      } else {
        let index = array.indexOf(value);
        if ( index !== -1) {
          array.splice(index, 1);
        }
      }
    }

    render(){
        return(
            <React.Fragment>
                <label className="mt-2">Como nos conociste...</label>
                <Row fluid={"true"}>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input
                        id="yaescliente" 
                        className="custom-control-input checkbox-social"
                        name="yaescliente"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'ya es cliente') }}
                      />
                      <label className="custom-control-label" htmlFor="yaescliente">Ya es cliente</label>
                    </div>
                  </Col>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input
                        id="youtube" 
                        className="custom-control-input checkbox-social"
                        name="youtube"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'youtube') }}
                      />
                      <label className="custom-control-label" htmlFor="youtube">Youtube</label>
                    </div>
                  </Col>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input
                        id="recomendacion" 
                        className="custom-control-input checkbox-social"
                        name="recomendacion"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'recomendacion') }}
                      />
                      <label className="custom-control-label" htmlFor="recomendacion">Recomendaciòn</label> 
                    </div>
                  </Col>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input 
                        id="facebook"
                        className="custom-control-input checkbox-social"
                        name="facebook"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'facebook') }}
                      /> 
                      <label className="custom-control-label" htmlFor="facebook">Facebook</label>
                      </div>
                  </Col>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input 
                        id="campana"
                        className="custom-control-input checkbox-social"
                        name="compana"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'campaña') }}
                      />
                      <label className="custom-control-label" htmlFor="campana">Campaña</label> 
                    </div>
                  </Col>
                  <Col className="col-4">
                    <div className="custom-control custom-checkbox">
                      <input 
                        id="ibapasando"
                        className="custom-control-input checkbox-social"
                        name="pasabaporaqui"
                        type="checkbox"
                        onChange={ (e) => { this.handleSelected(e, 'iba pasando') }}
                      />
                      <label className="custom-control-label" htmlFor="ibapasando">Iba pasando</label>
                    </div>
                  </Col>
                </Row>
            </React.Fragment>
            );
    }
}
export default FuenteComponent;