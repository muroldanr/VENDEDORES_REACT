
const BD = "LOGISTICA" 
const BASE_URL = "http://b3903.online-server.cloud:8080/"
//const BASE_URL = "https://rtorresapp.com/app_dev.php"
//const BASE_URL = "http://192.168.15.15:8080/app_dev.php"



const endpoints = Object.freeze({
		/*
		login: 			"/api/login_check",
        get_clientes: 	"/sp/execute/emjag/spAppAvantiClientes",
        get_categorias: "/sp/execute/emjag/spWebArtAPP",
        get_articulos: 	"/sp/execute/emjag/spAppAvantiArticulos",
        get_carrito: 	"/sp/execute/emjag/spAppAvantiCarProducts",
        add_carrito: 	"/sp/execute/emjag/spAppAvantiAddProducto",
        reporte_total: 	"/sp/execute/emjag/spAppAvantiTotalVsEjercicio",
        save_carrito: 	"/sp/execute/emjag/spAppTecsoPutOrder"
        */
        login:                          "api/login?database="+BD,
        get_clientes:                   "api/"+BD+"/sp/spAppAvantiClientes",
        get_categorias:                 "api/"+BD+"/sp/spWebArtAPP",
        get_articulos: 	                "api/"+BD+"/sp/spAppArtDisponible",
        get_carrito: 	                "api/"+BD+"/sp/spAppAvantiCarProducts",
        add_carrito: 	                "api/"+BD+"/sp/spAppAvantiAddProducto",
        reporte_total: 	                "api/"+BD+"/sp/spAppAvantiTotalVsEjercicio",
        save_carrito: 	                "api/"+BD+"/sp/spWebVenta",
        get_cotizaciones:               "api/"+BD+"/sp/spWebVentaCotizacion",
        get_ventaFactura:               "api/"+BD+"/sp/spWebVentaFacturado",
        get_embarques:                  "api/"+BD+"/sp/spWebEmbarquePendiente",
        get_cxc_pendientes:             "api/"+BD+"/sp/spWebCxcPendiente",
        get_empresa:                    "api/"+BD+"/sp/spWebAvantiEmpresa",
        get_actividades:                "api/"+BD+"/sp/spWebSoporteActividad",
        get_reporte_anual:              "api/"+BD+"/sp/spReporteVentaAnual",
        get_reporte_semanal:            "api/"+BD+"/sp/spReporteVentaSemanal",
        get_reporte_mensual:            "api/"+BD+"/sp/spReporteVentaMensual",
        get_reporte_semanal_acum:       "api/"+BD+"/sp/spRepVentaSemanal",
        get_reporte_mensual_acum:       "api/"+BD+"/sp/spRepVentaMensual",
        get_reporte_acum:               "api/"+BD+"/sp/spVentaSemanalAcum",
        get_reporte_cohete:             "api/"+BD+"/sp/spVentaCoheteAPP",
        set_cliente_nuevo:              "api/"+BD+"/sp/spWebClienteExpress",
        get_articulos_disponibles:      "api/"+BD+"/sp/spWebArtDisponible",
        delete_producto_carrito:        "api/"+BD+"/sp/spAppAvantiDelProducto",
        delete_carrito:                 "api/"+BD+"/sp/spAppAvantiDelCotizacion",
        get_procedure:                  "api/"+BD+"/sp/spAppAvantiActualizarProducto",     
        get_pedidos:                    "api/"+BD+"/sp/spWebVentaPedido",
        get_pedidos_detalle:            "api/"+BD+"/sp/spWebVentaPedidoD",
        put_actividad:                  "api/"+BD+"/sp/spWebSoporteGenerar",   
        get_list_usuarios:              "api/"+BD+"/sp/spWebUsuarioLista",  
        get_precio_lista:               "api/"+BD+"/sp/spWebPrecios",
        get_precio_politica_lista:      "api/"+BD+"/sp/spWebPrecioPolitica",
        get_actividades_vendedor:       "api/"+BD+"/sp/spWebSoporteAgenteLista",
        pdf_send:                       "/pdf/tecso/",
        set_termometro:                 "api/"+BD+"/sp/spAPPTermometro",
        get_cot_pendientes:             "api/"+BD+"/sp/spWebVentaPendiente",
        set_avanzar_pedido:             "api/"+BD+"/sp/spWebGenerarVentaPedido",
        get_info_cotizacion:            "api/"+BD+"/sp/spAppAvantiInfoCotizacion",
        set_recargar_carrito:           "api/"+BD+"/sp/spWebReCargarCarrito",
        get_info_venta:                 "api/"+BD+"/sp/spAppAvantiInfoVenta",
        eliminar_kit_carrito:           "api/"+BD+"/sp/spWebCarritoEliminarPartida",
        sincronizar_cotizacion:         "api/"+BD+"/sp/spWebVentaModificar",
        get_info_cliente_usuario:       "api/"+BD+"/sp/spAppClienteOmision",
        set_respuesta_reporte:          "api/"+BD+"/sp/spWebSoporteRespuesta",
        get_agenda_dia:                 "api/"+BD+"/sp/spWebSoporteAgenteDia",
        get_historico_activiades:       "api/"+BD+"/sp/spWebSoporteHist",
        save_registro:                  "api/"+BD+"/sp/spWebVisitas",
        lista_agentes:                  "api/"+BD+"/sp/spWebAgenteLista",
        lista_visitas:                  "api/"+BD+"/sp/spWebVisitasLista",
        editar_registro:                "api/"+BD+"/sp/spWebEditarVisitas",
        get_banners:                    "/avanti/tecso/banners",
        reporte_pipeline:               "api/"+BD+"/sp/spVentaPipelineAgente",
        solicitar_descuento:            "api/"+BD+"/sp/spWebVentaDescAutorizar",
        get_lista_autorizar:            "api/"+BD+"/sp/spWebVentaListaAutorizar",
        register_sw:                    "api/"+BD+"/sp/spRegisterSw",
        set_autorizar:                  "api/"+BD+"/sp/spWebVentaDescAutorizar",
        enviar_notificacion:            "/avanti/tecso/push",
        update_user_carrito:            "api/"+BD+"/sp/spWebCambiarCte",
        disponible_almancen:            "api/"+BD+"/sp/spWebArtDisponibleAlmacen",
        update_almacen:                 "api/"+BD+"/sp/spWebActualizarAlmacen",
        get_sucursales:                 "api/"+BD+"/sp/spWebSucursalLista",
        get_gerente:                    "api/"+BD+"/sp/spWebUsuarioNotificacion",
        get_backOrder:                  "api/"+BD+"/sp/spWebArtBackorder",
        post_actualizar_cliente:        "api/"+BD+"/sp/spWebCteActualizar",
        get_codigo_postal:              "api/"+BD+"/sp/spWebCodigoPostal",
        //Reporte       
        spWebCierresGraficos  :         "api/"+BD+"/sp/spWebCierresGraficos",
        spWebOportunidadGraficos:       "api/"+BD+"/sp/spWebOportunidadGraficos",
        spWebVentaGraficos:             "api/"+BD+"/sp/spWebVentaGraficos",
        spWebVisitaGraficos:            "api/"+BD+"/sp/spWebVisitaGraficos",
        spWebIngresosGraficos:          "api/"+BD+"/sp/spWebIngresosGraficos",
        spWebWhatsAppGraficos:          "api/"+BD+"/sp/spWebWhatsAppGraficos",
        spWebLlamadaGraficos:           "api/"+BD+"/sp/spWebLlamadaGraficos",
        spWebCorreoGraficos:            "api/"+BD+"/sp/spWebCorreoGraficos",
        spWebPersonaGraficos:           "api/"+BD+"/sp/spWebPersonaGraficos",
        spWebVentaTotal:                "api/"+BD+"/sp/spWebVentaTotal",
        spWebAgenteRegistro:            "api/"+BD+"/sp/spWebAgenteRegistro",
        spWebAgenteRol:                 "api/"+BD+"/sp/spWebAgenteRol",
        spWebVentaActualizarCampos:     "api/"+BD+"/sp/spWebVentaActualizarCampos",
        spWebVentaListaCampos:          "api/"+BD+"/sp/spWebVentaListaCampos",
        spWebVisitasEditarLista:        "api/"+BD+"/sp/spWebVisitasEditarLista",
        spWebCarritoPrecioActualizar:   "api/"+BD+"/sp/spWebCarritoPrecioActualizar",
        spWebSoporteInsert: 	        "api/"+BD+"/sp/spWebSoporteInsert",
        spWebVentaPendienteSaldoCte: 	        "api/"+BD+"/sp/spWebVentaPendienteSaldoCte",
        
});

const routes = {

    GET_COTIZACIONES_PENDIENTES:    BASE_URL + endpoints.get_cot_pendientes,
    SET_AVANZAR_PEDIDO:             BASE_URL + endpoints.set_avanzar_pedido,
	LOGIN: 			                BASE_URL + endpoints.login, 
    GET_CLIENTES: 	                BASE_URL + endpoints.get_clientes, 
    GET_CATEGORIAS:                 BASE_URL + endpoints.get_categorias,
	GET_ARTICULOS: 	                BASE_URL + endpoints.get_articulos,
	GET_CARRITO: 	                BASE_URL + endpoints.get_carrito,
	ADD_CARRITO: 	                BASE_URL + endpoints.add_carrito,
	REPORTE_TOTAL: 	                BASE_URL + endpoints.reporte_total,
	SAVE_CARRITO: 	                BASE_URL + endpoints.save_carrito,
    GET_COTIZACIONES:               BASE_URL + endpoints.get_cotizaciones,
    GET_COMPRAS:                    BASE_URL + endpoints.get_ventaFactura,
    GET_EMBARQUES:                  BASE_URL + endpoints.get_embarques,
    GET_CXC_PENDIENTES:             BASE_URL + endpoints.get_cxc_pendientes,
    GET_EMPRESA:                    BASE_URL + endpoints.get_empresa,
    GET_ACTIVIDADES:                BASE_URL + endpoints.get_actividades,    
    GET_REPORTE_SEMANAL:            BASE_URL + endpoints.get_reporte_semanal,
    GET_REPORTE_MENSUAL:            BASE_URL + endpoints.get_reporte_mensual,
    GET_REPORTE_SEMANAL_ACUM:       BASE_URL + endpoints.get_reporte_semanal_acum,
    GET_REPORTE_MENSUAL_ACUM:       BASE_URL + endpoints.get_reporte_mensual_acum,
    GET_REPORTE_ANUAL:              BASE_URL + endpoints.get_reporte_anual,
    GET_REPORTE_COHETE:             BASE_URL + endpoints.get_reporte_cohete,
    SET_CLIENTE_NUEVO:              BASE_URL + endpoints.set_cliente_nuevo,
    GET_ARTICULOS_DISPONIBLES:      BASE_URL + endpoints.get_articulos_disponibles,
    DELETE_PRODUCTO_CARRITO:        BASE_URL + endpoints.delete_producto_carrito,
    DELETE_CARRITO:                 BASE_URL + endpoints.delete_carrito,
    GET_PEDIDOS:                    BASE_URL + endpoints.get_pedidos,
    GET_PEDIDOS_DETALLE:            BASE_URL + endpoints.get_pedidos_detalle,
    PUT_ACTIVIDAD:                  BASE_URL + endpoints.put_actividad,
    CREATE_PROCEDURE:               BASE_URL + endpoints.get_procedure,
    FILES:                          BASE_URL + endpoints.files,
    GET_LIST_USUARIOS:              BASE_URL + endpoints.get_list_usuarios,
    GET_PRECIO_LISTA:               BASE_URL + endpoints.get_precio_lista,
    GET_PRECIO_POLITICA_LISTA:      BASE_URL + endpoints.get_precio_politica_lista,
    GET_REPORTE_ACUM:               BASE_URL + endpoints.get_reporte_acum,
    GET_ACTIVIDADES_VENDEDOR:       BASE_URL + endpoints.get_actividades_vendedor,
    PDF_SEND:                       BASE_URL + endpoints.pdf_send,
    SET_TERMOMETRO:                 BASE_URL + endpoints.set_termometro,
    GET_INFO_COTIZACION:            BASE_URL + endpoints.get_info_cotizacion,
    SET_RECARGAR_CARRITO:           BASE_URL + endpoints.set_recargar_carrito,
    GET_INFO_VENTA:                 BASE_URL + endpoints.get_info_venta,
    DELETE_KIT_CARRITO:             BASE_URL + endpoints.eliminar_kit_carrito,
    SINCRONIZAR_COTIZACION:         BASE_URL + endpoints.sincronizar_cotizacion,
    GET_INFO_CLIENTE_USUARIO:       BASE_URL + endpoints.get_info_cliente_usuario,
    SET_RESPUESTA_REPORTE:          BASE_URL + endpoints.set_respuesta_reporte,
    GET_AGENDA_DIA:                 BASE_URL + endpoints.get_agenda_dia,
    GET_HISTORICO_ACTIVIDADES:      BASE_URL + endpoints.get_historico_activiades,
    SAVE_REGISTRO:                  BASE_URL + endpoints.save_registro,
    LISTA_AGENTES:                  BASE_URL + endpoints.lista_agentes,
    LISTA_VISITAS:                  BASE_URL + endpoints.lista_visitas,
    EDITAR_REGISTRO:                BASE_URL + endpoints.editar_registro,
    GET_BANNERS:                    BASE_URL + endpoints.get_banners,
    REPORTE_PIPELINE:               BASE_URL + endpoints.reporte_pipeline,
    SOLICITAR_DESCUENTO:            BASE_URL + endpoints.solicitar_descuento,
    GET_LISTA_AUTORIZAR:            BASE_URL + endpoints.get_lista_autorizar,
    REGISTER_SW:                    BASE_URL + endpoints.register_sw,
    SET_AUTORIZAR:                  BASE_URL + endpoints.set_autorizar,
    ENVIAR_NOTIFICACION:            BASE_URL + endpoints.enviar_notificacion,
    UPDATE_USER_CARRITO:            BASE_URL + endpoints.update_user_carrito,
    DISPONIBLE_ALMACEN:             BASE_URL + endpoints.disponible_almancen,
    UPDATE_ALMACEN:                 BASE_URL + endpoints.update_almacen, 
    GET_SUCURSALES:                 BASE_URL + endpoints.get_sucursales, 
    GET_GERENTE:                    BASE_URL + endpoints.get_gerente,
    GET_BACKORDER:                  BASE_URL + endpoints.get_backOrder,
    POST_ACTUALIZAR_CLIENTE:        BASE_URL + endpoints.post_actualizar_cliente,
    spWebCierresGraficos  :         BASE_URL + endpoints.spWebCierresGraficos,
    spWebOportunidadGraficos:       BASE_URL + endpoints.spWebOportunidadGraficos,
    spWebVentaGraficos:             BASE_URL + endpoints.spWebVentaGraficos,
    spWebVisitaGraficos:            BASE_URL + endpoints.spWebVisitaGraficos,
    spWebIngresosGraficos:          BASE_URL + endpoints.spWebIngresosGraficos,
    spWebWhatsAppGraficos:          BASE_URL + endpoints.spWebWhatsAppGraficos,
    spWebLlamadaGraficos:           BASE_URL + endpoints.spWebLlamadaGraficos,
    spWebCorreoGraficos:            BASE_URL + endpoints.spWebCorreoGraficos,
    spWebPersonaGraficos:           BASE_URL + endpoints.spWebPersonaGraficos,
    spWebVentaTotal:                BASE_URL + endpoints.spWebVentaTotal,
    spWebAgenteRegistro:            BASE_URL + endpoints.spWebAgenteRegistro,
    spWebAgenteRol:                 BASE_URL + endpoints.spWebAgenteRol,
    spWebVentaActualizarCampos:     BASE_URL + endpoints.spWebVentaActualizarCampos,
    spWebVentaListaCampos:          BASE_URL + endpoints.spWebVentaListaCampos,
    spWebVisitasEditarLista:        BASE_URL + endpoints.spWebVisitasEditarLista,
    GET_CODIGO_POSTAL:              BASE_URL + endpoints.get_codigo_postal,
    spWebCarritoPrecioActualizar:   BASE_URL + endpoints.spWebCarritoPrecioActualizar,
    spWebSoporteInsert:   BASE_URL + endpoints.spWebSoporteInsert, 
    spWebVentaPendienteSaldoCte:   BASE_URL + endpoints.spWebVentaPendienteSaldoCte, 
}

export default routes

/*
	spAppAvantiClientes	   Nombre,Apellido,Telefono,Email
	spWebArtAPP            Campo (Fabricante,Grupo,Categoria)
	spAppAvantiArticulos   Articulo,Grupo,Categoria,Fabricante
	spAppAvantiCarProducts UsuarioWeb
	spAppAvantiAddProducto UsuarioWeb,Articulo,Precio,Cantidad,Opciones
    spWebVentaCotizacion   Empresa,Cliente
    spWebVentaFacturado    Empresa,Cliente
    spWebEmbarquePendiente Empresa,Cliente
    spWebCxcPendiente      Empresa,Cliente
    spWebAvantiEmpresa     UsuarioWeb
    spWebSoporteActividad  WebUsuario,Cliente
    spReporteVentaAnual   Empresa, 2018
    spReporteVentaSemanal Empresa, FechaD, FechaA
    spReporteVentaMensual Empresa , Ejericio, Periodo
    spWebClienteExpress  WebUsuario, Nombre, Telefono, RFC, Email
    spAppAvantiDelProducto idCotizacion, idProducto
    spWebSoporteGenerar  WebUsuario,Cliente,Que,Titulo,Reporte
    spAppAvantiDelCotizacion idCotizacion
    spAppAvantiActualizarProducto  IDProducto, Cantidad
    spListaUsuariosWeb     SIN PARAMETROS 
    spVentaSemanalAcum     WebUsuario
    spAPPTermometro UsuarioWeb, ID, Termometro
    EXEC spWebSoporteHist  WebUsuario, 'VTAS', 'Cotizacion', 'SP5239'
    EXEC spWebSoporteRespuesta  WebUsuario,  ID, Solucion
    spWebCteActualizar WebUsuario,Cliente,Nombre,Telefono,Email,ModuloID
*/
