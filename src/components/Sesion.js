import React from 'react';
import logoImage from '../components/images/logo.png'
import logoImageTorres from '../components/images/logoTorres.png'
import Loading from '../components/Loading';
import manager from '../service-manager/api'
import routes from '../service-manager/routes'
import '../components/css/loading.css';
import Photo from '../components/AgendaPhoto';
import {Carousel } from 'react-bootstrap';
import swal from 'sweetalert';

class Sesion extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false,
      codigo:3,
      CondicionDeCredenciales:false,
      data: [],
      usuarios: []
    }
  }

  componentDidMount() {
    let sucursal = localStorage.getItem('sucursalNombre');
        if(sucursal){
            this.traerUsuario();
        }
  }

  changePassword(event) {
    var value = event.target.value;
    this.setState({
      password: value,
      CondicionDeCredenciales:false
    });
  }

  onSubmit(e) {
    this.peticionALogin();
    //this.peticionALoginNET();
    this.isLoading(true);
  }

  login() {
    this.props.successLogin();
  }

  isLoading(active){
      this.setState({loading: active});
  }

  aviso(condicional){
    if (condicional){
      return(
        <small className="form-text text-muted">
          su contraseña es incorrecta, si no recuerdas tu contraseña ponte en contacto con tu supervisor
        </small>
      )
    }
  }

  traerEmpresa(usuario){
    manager.postData(routes.GET_EMPRESA, {
      'Usuario': localStorage.getItem("user")
    })
    .then(response => {
        localStorage.setItem("empresa", response[0].Empresa);
        this.reqInfoClienteUsuario();
    })
    .catch(error => {

      let {code} = error;
      this.isLoading(false);
      if (code === undefined) {
        code = 500;
      }
      if(code === 401){

      }
    });
  }

  reqInfoClienteUsuario() {
    manager.postData(routes.GET_INFO_CLIENTE_USUARIO, {
      'UsuarioWeb':this.state.username
    }).then(response => {

        if (response.length >= 0) {
          let cliente = response[0];
          localStorage.setItem("clienteNombre", "Cliente Mostrador");
          localStorage.setItem("clienteUsuarioCliente", cliente.Cliente);
          localStorage.setItem("clienteCliente", "");
          localStorage.setItem("clienteeCotizacionID", "");
          localStorage.setItem("clienteeMov", "");
        }
        this.isLoading(false);
        this.login();
    })
    .catch(error => {

        this.isLoading(false);
        let {code} = error;

        if (code === undefined) {
          code = 500;
        }

        if(code === 401){

        }
    });
  }

  selectedUser(index) {
    console.log(this.state.usuarios[index])
    if (this.state.usuarios[index]) {
      let objV = this.state.usuarios[index];
      this.setState({
        username: objV.Usuario,
        nombre: objV.Nombre
      });
    }
  }

  traerUsuario(){
    this.isLoading(true);
    manager.postData(routes.GET_LIST_USUARIOS,{"Sucursal":localStorage.getItem("sucursal","")})
    .then(response => {

      this.creacionDeUsuarios(response)
      this.isLoading(false)
    })
    .catch(error =>{

        let {code} = error;
        this.isLoading(false);

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");

        if (code === undefined) {
          code = 500;
        }
        if(code === 401){
        }
    })
  }

  creacionDeUsuarios(arrayUsuarios) {
      let data = [];

      if (arrayUsuarios.length > 0) {
        this.setState({username: arrayUsuarios[0].Usuario});
      }

      data = arrayUsuarios.map((objV) =>
          <Carousel.Item key={objV.UsuarioWeb} className="mb-5">
             <Photo nombre={objV.Nombre}/>
          </Carousel.Item>
      );

      this.setState({
          data: data,
          usuarios: arrayUsuarios
      });
  }

  peticionALogin() {
    this.isLoading(true);
    
    var data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    manager.postDataForm(routes.LOGIN, data)
    .then(response => {
          var tokenArray = response.token.split('.');
          if (tokenArray.length === 3) {
          var userInfo = JSON.parse(atob(tokenArray[1]));
          localStorage.setItem("token", userInfo.roles.AuthToken);
          localStorage.setItem("role", userInfo.roles.role);
          localStorage.setItem("user", userInfo.username)
          localStorage.setItem("userNombre", this.state.nombre)
          var user = localStorage.getItem('user');
          this.traerEmpresa(user);
          this.updateTokenSW(user);
        }
    })
    .catch(error => {

        let {code} = error
        this.isLoading(false);
        this.setState({CondicionDeCredenciales:true})

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");;

        if (code === undefined) {
          code = 500;
        }

        if(code === 401){
        }
    });
  }

  peticionALoginNET() {
    this.isLoading(true);
    manager.postDataFormUrlencoded(routes.LOGIN, {"username":this.state.username,"password":this.state.password,"grant_type":"password"})
    .then(response => {

      if (response.AuthToken){
        console.log(response.AuthToken);
        localStorage.setItem("token",response.AuthToken);
        localStorage.setItem("role","");
        localStorage.setItem("user", this.state.username);
        localStorage.setItem("userNombre",this.state.username);
        
        var user = localStorage.getItem('user');
        this.traerEmpresa(user);
        this.updateTokenSW(user);
      
      }else{
        swal("Datos incorrectos ","error", "info");
        this.isLoading(false);
      }
    })
    .catch(error => {

        let {code} = error
        this.isLoading(false);
        this.setState({CondicionDeCredenciales:true})

        swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");;

        if (code === undefined) {
          code = 500;
        }

        if(code === 401){
        }
    });
  }



  submitForm(e) {
    e.preventDefault();
    this.onSubmit(e);
  }

  updateTokenSW(user) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        usuario:localStorage.getItem("user"),
        path: routes.REGISTER_SW
      });
    }
  }

  componentWillReceiveProps(props) {
        let sucursal = localStorage.getItem('sucursalNombre');
        if(sucursal){
            this.traerUsuario();
        } 
  }

  render() {
      return (
        <React.Fragment>
          <Loading active={this.state.loading}/> 
          <div className="container-fluid all-screen aling-middle">
            <div className="d-flex justify-content-center align-items-center h-75 my-auto" >
              <div className="container px-32">
                <div className="row justify-content-center" role= "presentation">
                  <div className="col-12 col-sm-8 col-md-8 col-lg-6 mx-auto">
                    <form onSubmit={this.submitForm.bind(this)}>
                        <img  className="rounded mx-auto d-block m-5 p-5" alt="logo" src= {localStorage.getItem("Categoria") === "R TORRES" ? logoImageTorres : logoImage} />
                        <div className="mt-2">
                            <Carousel interval={0} indicators={true} onSelect={this.selectedUser.bind(this)}>
                              {this.state.data}
                            </Carousel> 
                        </div>
                        <div>
                          <label className="mt-2">Contraseña</label>
                          <input type="password" className="form-control" id="pass" value={this.state.password} onChange={this.changePassword.bind(this)} placeholder="Inserta aqui tu contraseña" />
                          {this.aviso(this.state.CondicionDeCredenciales)}
                        </div>
                        <div>
                          <button type="button" onClick= {(e) => this.onSubmit(e)}  className="mx-auto btn-block btn-lg mt-4 botonSeccion"> Ingresar </button>
                        </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
  }
}



export default Sesion;