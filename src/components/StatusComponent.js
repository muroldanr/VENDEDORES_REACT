import React from 'react';
import './css/clientDetail.css';


class StatusComponent extends React.Component {

    constructor(props) {
        super(props);

        let clase = "";
        let temperatura = ""

        this.state = {
            nuevaClase: clase,
            temperatura: temperatura
        }
    }


    componentDidMount() {
        this.setTemperatura(this.props)
    }

    setTemperatura(props){
        let clase = "";
        let temperatura = ""

        if (props.value) {
            if (props.value === "1" || props.value === "Venta En Frio") {
                clase = "icon-termometro-cool";
                temperatura = " Frio";
            }

            if (props.value === "2" || props.value === "Venta En Tibio") {
                clase = "icon-termometro-warm";
                temperatura = " Tibio";
            }

            if (props.value === "3" || props.value === "Venta En Caliente") {
                clase = "icon-termometro-hot";
                temperatura = " Caliente";
            }
            if (props.value === "DESCUENTO POR AUTORIZAR") {
                clase = "";
                temperatura = "DESCUENTO POR AUTORIZA";
            }
            if (props.value === "DESCUENTO AUTORIZADO") {
                clase = "";
                temperatura = "DESCUENTO AUTORIZADO";
            }

            
        }
        this.setState({
            nuevaClase: clase,
            temperatura: temperatura
        });
    }

    componentWillReceiveProps(props) {
        this.setTemperatura(props);
    }

	render(){
		return(
           <h6>
               <div className={"icon-termometro " + this.state.nuevaClase} ></div>
               <div>{" " + this.state.temperatura}</div>
           </h6>
        );
	}
}

export default StatusComponent;