import React from 'react';
import Home from '../pages/Home';
import Principales from '../pages/Principales';
import Articulos from '../pages/Articulos';
import Clientes from '../pages/Clientes';
import ProductDetail from '../pages/ProductDetail';
import ClientDetail from '../pages/ClientDetail';
import Agenda from '../pages/Agenda';
import Reportes from '../pages/Reportes';
import { BrowserRouter, Route, Switch,Redirect } from "react-router-dom";
import Login from '../pages/Login';
import Carrito from '../pages/Carrito';
import Favoritos from '../pages/Favoritos';
import DetallesReportes from '../pages/DetallesReportes';
import Seguimiento from '../pages/Seguimiento';
import PipelineAutorizar from '../pages/PipelineAutorizar';
import Usuario from '../pages/Usuario';
import CotizacionDetail from '../pages/CotizacionDetail';
import HistoricoVentas from '../pages/HistoricoVentas';
import EditarCotizacion from '../pages/EditarCotizacion';
import RegistroVisitantes from '../pages/RegistroVisitantes';
import Autorizaciones from '../pages/Autorizaciones';
import ReportesGraficas from '../pages/ReportesGraficas';
import ReportesGraficasVendedor from '../pages/ReportesGraficasVendedor';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/principales" component={Principales} />
                <Route exact path="/articulos" component={Articulos} />
                <Route exact path="/clientes" component={Clientes} />
                <Route exact path="/productDetail" component={ProductDetail} />
                <Route exact path="/clientDetail" component={ClientDetail} />
                <Route exact path="/agenda" component={Agenda} />
                <Route exact path="/carrito" component={Carrito} />
                <Route exact path="/favoritos" component={Favoritos} />
                <Route exact path="/reportes" component={Reportes} />
                <Route exact path="/detallesreportes" component={DetallesReportes} />
                <Route exact path="/seguimiento" component={Seguimiento} />
                <Route exact path="/usuario" component={Usuario} />
                <Route exact path="/pipelineAutorizar" component={PipelineAutorizar} />
                <Route exact path="/cotizacionDetail" component={CotizacionDetail} />
                <Route exact path="/historicoVentas" component={HistoricoVentas} />
                <Route exact path="/editarcotizacion/:id" component={EditarCotizacion} />
                <Route exact path="/registroVisitantes" component={RegistroVisitantes} />
                <Route exact path="/autorizaciones" component={Autorizaciones} />
                <Route exact path="/reportesGraficas" component={ReportesGraficas} />
                <Route exact path="/reportesGraficasVendedor" component={ReportesGraficasVendedor} />
                <Redirect to="/login"/>
            </Switch>
        </BrowserRouter>
  );
}

export default App;