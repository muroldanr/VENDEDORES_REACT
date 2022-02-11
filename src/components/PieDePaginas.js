import React from 'react';

class PieDePaginas extends React.Component {
  
  constructor(props){
    super(props)
    this.state={
      posicion:0
    }

  }

  LogicaDeAnterior(){
    if (this.state.posicion>1){  
      let posicion:number= this.state.posicion -1;
      this.setState({
        posicion: posicion
      })
      this.props.onclicked(posicion);
    }
  }

  LogicaDeSiguiente(){
    if (this.state.posicion<5){   
      let posicion:number= this.state.posicion +1;
      this.setState({
        posicion: posicion
      })
      this.props.onclicked(posicion);
    }
  }


  PosicionPaginador(valor){
    this.setState({posicion:valor});
    this.props.onclicked(valor);
  }

    render() {

       const numeros = [1, 2, 3, 4, 5];

       const doubled = numeros.map((numero) =>
          <li key={numero.toString()} className={"page-item ml-0 " + (this.state.posicion===numero ? 'active':'')}><a className="page-link" href="#" onClick={() => this.PosicionPaginador(numero)}>{numero}</a></li>
       );

        return (
            <nav aria-label="Page navigation example" >
              <ul className="pagination pieDePagina">
                <li className="page-item ml-0"><a className="page-link" href="#" onClick={this.LogicaDeAnterior.bind(this)}>Anterior</a></li>
                {doubled}
                <li className="page-item mr-0"><a className="page-link" href="#" onClick={this.LogicaDeSiguiente.bind(this)}>Siguiente</a></li>
              </ul>
            </nav>  
        );

    }
}
export default PieDePaginas;
