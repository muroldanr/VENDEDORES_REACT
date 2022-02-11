const BASE_URL = "https://rtorresapp.com/avanti-back/web/app_dev.php"
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

        login: 			                "/api/login_check",
        files:                          "/files/web?articulo=",
        get_clientes: 	                "/sp/execute/tecso/spAppAvantiClientes",
        get_categorias:                 "/sp/execute/tecso/spWebArtAPP",
        get_articulos: 	                "/sp/execute/tecso/spAppArtDisponible",
        get_carrito: 	                "/sp/execute/tecso/spAppAvantiCarProducts",
        add_carrito: 	                "/sp/execute/tecso/spAppAvantiAddProducto",
        reporte_total: 	                "/sp/execute/tecso/spAppAvantiTotalVsEjercicio",
        save_carrito: 	                "/sp/execute/tecso/spWebVenta",
        get_cotizaciones:               "/sp/execute/tecso/spWebVentaCotizacion",
        get_ventaFactura:               "/sp/execute/tecso/spWebVentaFacturado",
        get_embarques:                  "/sp/execute/tecso/spWebEmbarquePendiente",
        get_cxc_pendientes:             "/sp/execute/tecso/spWebCxcPendiente",
        get_empresa:                    "/sp/execute/tecso/spWebAvantiEmpresa",
        get_actividades:                "/sp/execute/tecso/spWebSoporteActividad",
        get_reporte_anual:              "/sp/execute/tecso/spReporteVentaAnual",
        get_reporte_semanal:            "/sp/execute/tecso/spReporteVentaSemanal",
        get_reporte_mensual:            "/sp/execute/tecso/spReporteVentaMensual",
        get_reporte_semanal_acum:       "/sp/execute/tecso/spRepVentaSemanal",
        get_reporte_mensual_acum:       "/sp/execute/tecso/spRepVentaMensual",
        get_reporte_acum:               "/sp/execute/tecso/spVentaSemanalAcum",
        get_reporte_cohete:             "/sp/execute/tecso/spVentaCoheteAPP",
        set_cliente_nuevo:              "/sp/execute/tecso/spWebClienteExpress",
        get_articulos_disponibles:      "/sp/execute/tecso/spWebArtDisponible",
        delete_producto_carrito:        "/sp/execute/tecso/spAppAvantiDelProducto",
        delete_carrito:                 "/sp/execute/tecso/spAppAvantiDelCotizacion",
        get_procedure:                  "/sp/execute/tecso/spAppAvantiActualizarProducto",     
        get_pedidos:                    "/sp/execute/tecso/spWebVentaPedido",
        get_pedidos_detalle:            "/sp/execute/tecso/spWebVentaPedidoD",
        put_actividad:                  "/sp/execute/tecso/spWebSoporteGenerar",   
        get_list_usuarios:              "/sp/execute/tecso/spWebUsuarioLista",  
        get_precio_lista:               "/sp/execute/tecso/spWebPrecios",
        get_precio_politica_lista:      "/sp/execute/tecso/spWebPrecioPolitica",
        get_actividades_vendedor:       "/sp/execute/tecso/spWebSoporteAgenteLista",
        pdf_send:                       "/pdf/tecso/",
        set_termometro:                 "/sp/execute/tecso/spAPPTermometro",
        get_cot_pendientes:             "/sp/execute/tecso/spWebVentaPendiente",
        set_avanzar_pedido:             "/sp/execute/tecso/spWebGenerarVentaPedido",
        get_info_cotizacion:            "/sp/execute/tecso/spAppAvantiInfoCotizacion",
        set_recargar_carrito:           "/sp/execute/tecso/spWebReCargarCarrito",
        get_info_venta:                 "/sp/execute/tecso/spAppAvantiInfoVenta",
        eliminar_kit_carrito:           "/sp/execute/tecso/spWebCarritoEliminarPartida",
        sincronizar_cotizacion:         "/sp/execute/tecso/spWebVentaModificar",
        get_info_cliente_usuario:       "/sp/execute/tecso/spAppClienteOmision",
        set_respuesta_reporte:          "/sp/execute/tecso/spWebSoporteRespuesta",
        get_agenda_dia:                 "/sp/execute/tecso/spWebSoporteAgenteDia",
        get_historico_activiades:       "/sp/execute/tecso/spWebSoporteHist",
        save_registro:                  "/sp/execute/tecso/spWebVisitas",
        lista_agentes:                  "/sp/execute/tecso/spWebAgenteLista",
        lista_visitas:                  "/sp/execute/tecso/spWebVisitasLista",
        editar_registro:                "/sp/execute/tecso/spWebEditarVisitas",
        get_banners:                    "/avanti/tecso/banners",
        reporte_pipeline:               "/sp/execute/tecso/spVentaPipelineAgente",
        solicitar_descuento:            "/sp/execute/tecso/spWebVentaDescAutorizar",
        get_lista_autorizar:            "/sp/execute/tecso/spWebVentaListaAutorizar",
        register_sw:                    "/sp/execute/tecso/spRegisterSw",
        set_autorizar:                  "/sp/execute/tecso/spWebVentaDescAutorizar",
        enviar_notificacion:            "/avanti/tecso/push",
        update_user_carrito:            "/sp/execute/tecso/spWebCambiarCte",
        disponible_almancen:            "/sp/execute/tecso/spWebArtDisponibleAlmacen",
        update_almacen:                 "/sp/execute/tecso/spWebActualizarAlmacen",
        get_sucursales:                 "/sp/execute/tecso/spWebSucursalLista",
        get_gerente:                    "/sp/execute/tecso/spWebUsuarioNotificacion",
        get_backOrder:                  "/sp/execute/tecso/spWebArtBackorder",
        post_actualizar_cliente:        "/sp/execute/tecso/spWebCteActualizar",
        get_codigo_postal:              "/sp/execute/tecso/spWebCodigoPostal",
        //Reporte       
        spWebCierresGraficos  :         "/sp/execute/tecso/spWebCierresGraficos",
        spWebOportunidadGraficos:       "/sp/execute/tecso/spWebOportunidadGraficos",
        spWebVentaGraficos:             "/sp/execute/tecso/spWebVentaGraficos",
        spWebVisitaGraficos:            "/sp/execute/tecso/spWebVisitaGraficos",
        spWebIngresosGraficos:          "/sp/execute/tecso/spWebIngresosGraficos",
        spWebWhatsAppGraficos:          "/sp/execute/tecso/spWebWhatsAppGraficos",
        spWebLlamadaGraficos:           "/sp/execute/tecso/spWebLlamadaGraficos",
        spWebCorreoGraficos:            "/sp/execute/tecso/spWebCorreoGraficos",
        spWebPersonaGraficos:           "/sp/execute/tecso/spWebPersonaGraficos",
        spWebVentaTotal:                "/sp/execute/tecso/spWebVentaTotal",
        spWebAgenteRegistro:            "/sp/execute/tecso/spWebAgenteRegistro",
        spWebAgenteRol:                 "/sp/execute/tecso/spWebAgenteRol",
        spWebVentaActualizarCampos:     "/sp/execute/tecso/spWebVentaActualizarCampos",
        spWebVentaListaCampos:          "/sp/execute/tecso/spWebVentaListaCampos",
        spWebVisitasEditarLista:        "/sp/execute/tecso/spWebVisitasEditarLista",
        spWebCarritoPrecioActualizar:   "/sp/execute/tecso/spWebCarritoPrecioActualizar",
        spWebFacturadoComisiones:       "/sp/execute/tecso/spWebFacturadoComisiones",
        spWebSoporteInsert: 	        "/sp/execute/tecso/spWebSoporteInsert",    
        spWebVentaPendienteSaldoCte: 	"/sp/execute/tecso/spWebVentaPendienteSaldoCte",    
        
        

        
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
    spWebFacturadoComisiones:       BASE_URL + endpoints.spWebFacturadoComisiones, 
    spWebSoporteInsert:             BASE_URL + endpoints.spWebSoporteInsert, 
    spWebVentaPendienteSaldoCte:    BASE_URL + endpoints.spWebVentaPendienteSaldoCte, 
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
