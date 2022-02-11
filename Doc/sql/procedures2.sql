SET DATEFIRST 7
SET ANSI_NULLS OFF
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET LOCK_TIMEOUT -1
SET QUOTED_IDENTIFIER OFF
GO

/*** spTecsoGetArtFile ***/
if exists ( select * from sysobjects where id = object_id('dbo.spTecsoGetArtFile') and type = 'P')
    drop procedure dbo.spTecsoGetArtFile
GO
CREATE PROCEDURE spTecsoGetArtFile
  @Articulo varchar(20)
AS BEGIN
  SELECT AnexoCta.Direccion AS FilePath FROM AnexoCta where AnexoCta.Nombre = 'Web' AND AnexoCta.Rama = 'INV' AND LTRIM(RTRIM(AnexoCta.Cuenta)) = @Articulo
END
GO

/*** spWebAvantiEmpresa ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebAvantiEmpresa') and type = 'P')
  DROP procedure dbo.spWebAvantiEmpresa
GO
CREATE PROCEDURE spWebAvantiEmpresa
  @Usuario varchar(20)
AS BEGIN
  SELECT Empresa FROM WebUsuario WHERE UsuarioWeb = @Usuario
RETURN
END
GO

/*** spUsuarioWeb ***/
if exists ( select * from sysobjects where id = object_id('dbo.spUsuarioWeb') and type = 'P')
    drop procedure dbo.spUsuarioWeb
GO
CREATE PROCEDURE spUsuarioWeb
     @UsuarioWeb varchar(20),
     @Empresa    char(5)     OUTPUT, 
     @Agente     varchar(10) OUTPUT, 
     @Usuario    varchar(10) OUTPUT, 
     @Cliente    varchar(10)    = NULL OUTPUT
AS
BEGIN
    SELECT
        @Empresa = WebUsuario.Empresa,
        @Agente = WebUsuario.Agente,
        @Usuario = WebUsuario.Usuario,
        @Cliente = WebUsuario.Cliente
    FROM WebUsuario
    WHERE WebUsuario.UsuarioWeb = @UsuarioWeb
RETURN 
END
GO
/*** spAppAvantiClientes ***/
IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spAppAvantiClientes') AND type = 'P') DROP PROCEDURE spAppAvantiClientes
GO
CREATE PROCEDURE spAppAvantiClientes
    @Nombre VARCHAR(100) = NULL,
    @Apellido VARCHAR(100) = NULL,
    @Telefono VARCHAR(100) = NULL,
    @Email VARCHAR(50) = NULL
AS
BEGIN
    SELECT
        TOP 100
        Cliente,
        Nombre,
        Telefonos,
        eMail1
    FROM
        Cte
    WHERE
        UPPER(ISNULL(Nombre,'')) like '%'+ UPPER(ISNULL(@Nombre,''))+'%'
        AND UPPER(ISNULL(Nombre,'')) like '%'+UPPER(ISNULL(@Apellido,''))+'%'
        AND UPPER(ISNULL(Telefonos,'')) like '%'+UPPER(ISNULL(@Telefono,''))+'%'
        AND UPPER(ISNULL(eMail1,'')) like '%'+UPPER(ISNULL(@Email,''))+'%'
END
GO

/*** spWebArtAPP ***/
if exists ( select * from sysobjects where id = object_id('dbo.spWebArtAPP') and type = 'P')
    drop procedure dbo.spWebArtAPP
GO
CREATE PROCEDURE spWebArtAPP
  @Campo varchar(30)
AS BEGIN
  IF @Campo = 'Categoria'
  BEGIN
    SELECT RTRIM(LTRIM(Categoria)) AS Categoria, count(Articulo) AS Articulos
    FROM Art
    WHERE Categoria IS NOT NULL
      AND Categoria <> ''
      AND Art.wMostrar = 1
      AND Art.Estatus = 'ALTA'
    GROUP BY Categoria
    ORDER BY Categoria ASC
  END
  IF @Campo = 'Grupo'
  BEGIN
    SELECT RTRIM(LTRIM(Grupo)) AS Grupo, count(Articulo) AS Articulos
    FROM Art
    WHERE Grupo IS NOT NULL
      AND Grupo <> ''
      AND Grupo <> '0'
      AND Art.wMostrar = 1
      AND Art.Estatus = 'ALTA'
    GROUP BY Grupo
    ORDER BY Grupo ASC
  END
  IF @Campo = 'Familia'
  BEGIN
    SELECT RTRIM(LTRIM(Familia)) AS Familia, count(Articulo) AS Articulos
    FROM Art
    WHERE Familia IS NOT NULL
      AND Familia <> ''
      AND Art.wMostrar = 1
      AND Art.Estatus = 'ALTA'
    GROUP BY Familia
    ORDER BY Familia ASC
  END
  IF @Campo = 'Linea'
  BEGIN
    SELECT RTRIM(LTRIM(Linea)) as Linea, count(Articulo) as Articulos
    FROM Art
    WHERE
      Art.Linea IS NOT NULL
      AND Art.Linea <> ''
      AND Art.wMostrar = 1
      AND Art.Estatus = 'ALTA'
    GROUP BY Linea
    ORDER BY Linea ASC
  END
  IF @Campo = 'Fabricante'
  BEGIN
    SELECT RTRIM(LTRIM(Fabricante)) as Fabricante, count(Articulo) as Articulos
    FROM Art
    WHERE Fabricante IS NOT NULL
      AND Fabricante <> ''
      AND Art.wMostrar = 1
      AND Art.Estatus = 'ALTA'
    GROUP BY Fabricante
    ORDER BY Fabricante ASC
  END
END
GO

/*** spAppAvantiArticulos ***/
IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spAppAvantiArticulos') AND type = 'P')
    DROP PROCEDURE spAppAvantiArticulos
GO
CREATE PROCEDURE spAppAvantiArticulos
  @Articulo VARCHAR(20) = NULL,
  @Categoria VARCHAR(50) = NULL,
  @Grupo VARCHAR(50) = NULL,
  @Familia VARCHAR(50) = NULL,
  @Linea VARCHAR(50) = NULL,
  @Fabricante VARCHAR(50) = NULL
AS
BEGIN
  SELECT
    TOP 20
    Art.Articulo,
    Art.Descripcion1 AS Descripcion,
    Art.Unidad,
    Art.PrecioLista,
    Art.MonedaPrecio AS Moneda,
    Art.Categoria,
    Art.Grupo,
    Art.Fabricante
  FROM
    Art
  WHERE
    Art.wMostrar = 1
    AND Art.Estatus = 'ALTA'
    AND ISNULL(Art.Categoria,'') LIKE ISNULL(@Categoria, '%')
    AND ISNULL(Art.Grupo,'') LIKE ISNULL(@Grupo, '%')
    AND ISNULL(Art.Familia,'') LIKE ISNULL(@Familia, '%')
    AND ISNULL(Art.Linea,'') LIKE ISNULL(@Linea, '%')
    AND ISNULL(Art.Fabricante,'') LIKE ISNULL(@Fabricante, '%')
    AND (UPPER(Art.Articulo) LIKE '%'+UPPER(ISNULL(@Articulo, ''))+'%' OR UPPER(ISNULL(Art.Descripcion1,'')) LIKE '%'+UPPER(ISNULL(@Articulo,''))+'%')
END
GO

/*** spAppAvantiCarProducts ***/
IF exists ( select * from sysobjects where id = object_id('dbo.spAppAvantiCarProducts') and type = 'P')
    drop procedure dbo.spAppAvantiCarProducts
GO
CREATE PROCEDURE spAppAvantiCarProducts
    @UsuarioWeb VARCHAR(20),
    @Cliente VARCHAR(20)
AS BEGIN

    SELECT
      CarritoAPP.ID, 
      CarritoAPP.Articulo,
      CarritoApp.Cantidad,
      CarritoApp.Condicion,
      CarritoApp.Precio,
      CarritoApp.Precio2,
      CarritoApp.Precio3,
      CarritoApp.GenerarVenta,
      CarritoAPP.Almacen,
      Art.Unidad,
      Art.Descripcion1 AS Descripcion,
      Art.Grupo,
      Art.Categoria,
      Art.Fabricante,
      Art.MonedaPrecio,
      Art.Impuesto1
    FROM CarritoAPP
    JOIN Art
      ON Art.Articulo = CarritoApp.Articulo
    WHERE
      CarritoApp.Modulo IS NULL
      AND CarritoApp.ModuloID IS NULL
      AND CarritoApp.Renglon IS NULL
      AND CarritoApp.Cliente = @Cliente
      AND CarritoApp.Usuario = @UsuarioWeb
  RETURN
END
GO

/*** spAppAvantiAddProducto ***/
IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spAppAvantiAddProducto') AND type = 'P') DROP PROCEDURE spAppAvantiAddProducto
GO
CREATE PROCEDURE spAppAvantiAddProducto
  @UsuarioWeb VARCHAR(20),
  @Cliente VARCHAR(20),
  @Articulo VARCHAR(50),
  @Precio FLOAT(8),
  @Precio2 FLOAT(8),
  @Precio3 FLOAT(8),
  @Cantidad INT,
  @Almacen VARCHAR(10),
  @Descripcion VARCHAR(255),
  @Modulo CHAR(5) = NULL,
  @ModuloID INT = NULL
AS
BEGIN
  DECLARE
    @OkRef VARCHAR(255),
    @ID INT,
    @Condicion VARCHAR(50)

  SET @Condicion = 'Contado'

  IF @Cliente IS NULL SET @OkRef = 'Falta configurar el cliente'

  IF @OkRef IS NULL
  BEGIN
    SELECT
      @ID = CarritoAPP.ID
    FROM CarritoAPP
    WHERE
      CarritoAPP.Cliente = @Cliente
      AND CarritoAPP.Usuario = @UsuarioWeb
      AND CarritoAPP.Articulo = @Articulo
      AND CarritoAPP.Almacen = @Almacen
      AND ISNULL(CarritoAPP.Modulo, '') = ISNULL(@Modulo, '')
      AND ISNULL(CarritoAPP.ModuloID, '') = ISNULL(@ModuloID, '')

    BEGIN TRANSACTION trAddProduct

    BEGIN TRY
      IF @ID IS NULL
      BEGIN
        INSERT INTO CarritoAPP (Usuario, Cliente, Condicion, Modulo, ModuloID, Renglon, Articulo, Cantidad, Precio, Precio2, Precio3, DescripcionExtra, Almacen, GenerarVenta)
        VALUES (@UsuarioWeb, @Cliente, @Condicion, @Modulo, @ModuloID, NULL, @Articulo, @Cantidad, @Precio, @Precio2, @Precio3, @Descripcion, @Almacen, 1)
        IF @Modulo IS NOT NULL AND @ModuloID IS NOT NULL
        BEGIN
          EXEC spAppAvantiActualizarRenlonCarrito @Modulo=@Modulo, @ModuloID=@ModuloID
        END
      END
      ELSE
      BEGIN
        UPDATE CarritoAPP SET Cantidad = @Cantidad WHERE ID = @ID
      END

      COMMIT TRANSACTION trAddProduct;
      SET @OkRef = 'Ok'
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trAddProduct
      SET @OkRef = 'Error al agregar el articulo'
    END CATCH
  END

  SELECT @OkRef AS [Message]
END
GO

/*** spAppAvantiActualizarRenlonCarrito ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiActualizarRenlonCarrito') and type = 'P')
  DROP procedure dbo.spAppAvantiActualizarRenlonCarrito
GO
CREATE PROCEDURE spAppAvantiActualizarRenlonCarrito
  @Modulo VARCHAR(5),
  @ModuloID INT
AS
BEGIN
  DECLARE
    @ID INT,
    @Renglon INT,
    @RenglonID INT,
    @BaseRenglon INT,
    @BaseRenglonID INT

  SELECT @BaseRenglon=MAX(ISNULL(Renglon,0)) FROM CarritoApp WHERE @Modulo=Modulo AND @ModuloID=ModuloID
  SELECT @BaseRenglonID=MAX(ISNULL(RenglonID,0)) FROM CarritoApp WHERE @Modulo=Modulo AND @ModuloID=ModuloID

  DECLARE curUpdCarrito CURSOR FOR
  SELECT
    ID, Renglon, RenglonID
  FROM CarritoApp
  WHERE
    Modulo = @Modulo
    AND ModuloID = @ModuloID
  ORDER BY RenglonID DESC
  
  OPEN curUpdCarrito
  FETCH NEXT FROM curUpdCarrito INTO @ID, @Renglon, @RenglonID
  WHILE @@fetch_status = 0
  BEGIN
    IF @RenglonID IS NULL
    BEGIN
      BEGIN
        SET @BaseRenglon = @BaseRenglon + 2048
        SET @BaseRenglonID = @BaseRenglonID + 1
        UPDATE CarritoApp
          SET RenglonID = @BaseRenglonID,
          Renglon = @BaseRenglon
        WHERE ID = @ID
      END
    END
    FETCH NEXT FROM curUpdCarrito INTO @ID, @Renglon, @RenglonID
  END

  CLOSE curUpdCarrito
  DEALLOCATE curUpdCarrito
END
GO

/*** spAppAvantiTotalVsEjercicio ***/
if exists ( select * from sysobjects where id = object_id('dbo.spAppAvantiTotalVsEjercicio') and type = 'P')
    drop procedure dbo.spAppAvantiTotalVsEjercicio
GO
CREATE PROCEDURE spAppAvantiTotalVsEjercicio
AS
BEGIN
  SELECT
    SUM(ImporteTotal) AS ImporteTotal,
    Ejercicio
  FROM VentaTCalc
  WHERE Ejercicio is NOT NULL
  GROUP BY Ejercicio
  ORDER BY Ejercicio DESC
END
GO

/*** spWebVentaCotizacion ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebVentaCotizacion') and type = 'P')
  DROP procedure dbo.spWebVentaCotizacion
GO
CREATE PROCEDURE spWebVentaCotizacion  
      @Empresa  varchar(5),        
      @Cliente  varchar(10)
AS BEGIN 

  SELECT VentaTCalc.ID, 
        VentaTCalc.Renglon, 
        VentaTCalc.Mov, 
        VentaTCalc.MovID, 
        VentaTCalc.Articulo, 
        Art.Descripcion1 AS Descripcion, 
        VentaTCalc.FechaEmision, 
        Sucursal.Nombre, 
        VentaTCalc.Situacion, 
        VentaTCalc.Estatus 
     FROM VentaTCalc
       JOIN MovTipo  ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
       JOIN Art      ON VentaTCalc.Articulo = Art.Articulo
       JOIN Sucursal ON VentaTCalc.Sucursal = Sucursal.Sucursal
  WHERE VentaTCalc.Estatus = 'PENDIENTE'
     AND VentaTCalc.Empresa = @Empresa 
     AND MovTipo.Clave IN ('VTAS.P', 'VTAS.C') 
     AND VentaTCalc.Cliente =  @Cliente
  ORDER BY VentaTCalc.FechaEmision DESC, VentaTCalc.ID, VentaTCalc.Renglon 

  RETURN 
END
GO

/*** spWebVentaFacturado ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebVentaFacturado') and type = 'P')
  DROP procedure dbo.spWebVentaFacturado
GO
CREATE PROCEDURE spWebVentaFacturado
  @Empresa  varchar(5),
  @Cliente  varchar(10)
AS BEGIN
  SELECT
    VentaTCalc.ID,
    VentaTCalc.Renglon,
    VentaTCalc.Mov,
    VentaTCalc.MovID,
    VentaTCalc.Articulo,
    Art.Descripcion1 AS Descripcion,
    VentaTCalc.FechaEmision,
    Sucursal.Nombre,
    VentaTCalc.ImporteTotal,
    CASE
      WHEN Condicion.TipoCondicion = 'Credito'
      THEN 'Credito'
      ELSE 'Contado'
    END AS FormaPago
  FROM VentaTCalc
  JOIN MovTipo
    ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
  JOIN Art
    ON VentaTCalc.Articulo = Art.Articulo
  JOIN Sucursal
    ON VentaTCalc.Sucursal = Sucursal.Sucursal
  LEFT OUTER JOIN Condicion
    ON VentaTCalc.Condicion = Condicion.Condicion
    WHERE VentaTCalc.Estatus = 'CONCLUIDO'
      AND VentaTCalc.Empresa = @Empresa
      AND MovTipo.Clave IN ('VTAS.F')
      AND VentaTCalc.Cliente =  @Cliente
  ORDER BY VentaTCalc.FechaEmision DESC, VentaTCalc.ID, VentaTCalc.Renglon
RETURN
END 
GO

/*** spWebEmbarquePendiente ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebEmbarquePendiente') and type = 'P')
  DROP procedure dbo.spWebEmbarquePendiente
GO
CREATE PROCEDURE spWebEmbarquePendiente
  @Empresa  varchar(5),
  @Cliente  varchar(10)
AS BEGIN
  SELECT
    Embarque.FechaEmision AS EmbarqueFecha,
    Embarque.Mov   AS EmbarqueMov,
    Embarque.MovID AS EmbarqueMovID,
    EmbarqueD.Estado,
    EmbarqueD.FechaHora,
    EmbarqueMov.Modulo,
    EmbarqueMov.ModuloID,
    EmbarqueDArt.Renglon,
    EmbarqueMov.Mov,
    EmbarqueMov.MovID,
    EmbarqueMov.FechaEmision,
    EmbarqueMov.Cliente,
    EmbarqueMov.Nombre,
    VentaD.Articulo,
    VentaD.FechaRequerida,
    Art.Descripcion1,
    EmbarqueDArt.Cantidad
  FROM  EmbarqueD
  JOIN EmbarqueMov
    ON EmbarqueD.EmbarqueMov=EmbarqueMov.ID
  JOIN Embarque
    ON EmbarqueD.ID = Embarque.ID
  JOIN EmbarqueDArt
    ON EmbarqueMov.AsignadoID = EmbarqueDArt.ID AND  EmbarqueMov.ID = EmbarqueDArt.EmbarqueMov
  JOIN VentaD
    ON EmbarqueDArt.ModuloID  = VentaD.ID AND EmbarqueDArt.Renglon  = VentaD.Renglon
  JOIN Art
    ON VentaD.Articulo = Art.Articulo
  LEFT OUTER JOIN Agente
    ON Embarque.Agente = Agente.Agente
  LEFT OUTER JOIN Vehiculo
    ON Embarque.Vehiculo = Vehiculo.Vehiculo
  WHERE
    Embarque.Estatus = 'PENDIENTE'
    AND EmbarqueD.Estado NOT IN ('Entregado')
    AND Embarque.Empresa = @Empresa
    AND EmbarqueMov.Cliente = @Cliente
    AND EmbarqueMov.Modulo = 'VTAS'
  ORDER BY Embarque.FechaEmision DESC, EmbarqueMov.ModuloID, EmbarqueDArt.Renglon
  RETURN
END
GO

/*** spWebCxcPendiente ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebCxcPendiente') and type = 'P')
  DROP procedure dbo.spWebCxcPendiente
GO
CREATE PROCEDURE spWebCxcPendiente
  @Empresa  varchar(5),
  @Cliente  varchar(10)
AS BEGIN
  SELECT
    Cxc.ID,
    Cxc.Cliente,
    RTRIM(LTRIM(Cxc.Mov))+' '+RTRIM(LTRIM(Cxc.MovID)) AS Documento,
    ISNULL(Cxc.Importe,0.00) + ISNULL(Cxc.Impuestos,0.00) - ISNULL(Cxc.Retencion,0.00) - ISNULL(Cxc.Retencion2,0.00) - ISNULL(Cxc.Retencion3,0.00) AS Monto,
    Cxc.Saldo,
    CASE
      WHEN MovTipo.Clave = 'CXC.F'
      THEN dbo.fnMovAnexoVenta('CXC', Cxc.ID)
    ELSE
      NULL
    END AS Direccion  
  FROM Cxc
  JOIN  MovTipo
    ON Cxc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'CXC'
  WHERE Cxc.Estatus = 'PENDIENTE'
    AND Cxc.Empresa = @Empresa
    AND Cxc.Cliente = @Cliente
RETURN
END 
GO

/*** spWebSoporteActividad ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebSoporteActividad') and type = 'P')
  DROP procedure dbo.spWebSoporteActividad
GO
CREATE PROCEDURE spWebSoporteActividad
  @WebUsuario  varchar(20),
  @Cliente  varchar(10)
AS BEGIN
  DECLARE
    @Agente varchar(10),
    @Empresa    char(5),
    @Usuario    varchar(10)

  EXEC spUsuarioWeb @WebUsuario, @Empresa OUTPUT, @Agente OUTPUT, @Usuario OUTPUT

  SELECT
    Soporte.Agente,
    Agente.Nombre,
    Soporte.Medio,
    Soporte.FechaEmision,
    Soporte.Titulo,
    Soporte.Comentarios
  FROM Soporte
  LEFT OUTER JOIN Agente
    ON Soporte.Agente=Agente.Agente
  WHERE Soporte.Mov = 'Mensaje'
    AND  Soporte.Empresa = @Empresa
    AND  Soporte.Cliente = @Cliente
    AND Soporte.Estatus IN ('PENDIENTE', 'CONCLUIDO')
RETURN
END
GO

/*** spReporteVentaAnual ***/
if exists (select * from sysobjects where id = object_id('dbo.spReporteVentaAnual') and type = 'P')
  DROP procedure dbo.spReporteVentaAnual
GO
CREATE PROCEDURE spReporteVentaAnual
  @Empresa char(5),
  @Ejericio int
AS BEGIN
  SELECT
      dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2) AS Mes,
      dbo.fnMesNumeroNombre(VentaTCalc.Periodo)   AS NombreMes,
      SUM(CASE
            WHEN MovTipo.Clave = 'VTAS.F'
            THEN ImporteTotal
            ELSE - ImporteTotal
          END) AS ImporteReal
      FROM VentaTCalc
      JOIN MovTipo
        ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
      WHERE
        VentaTCalc.EMpresa = @Empresa
        AND VentaTCalc.Estatus IN ('CONCLUIDO')
        AND MovTipo.Clave IN ( 'VTAS.F',  'VTAS.D',  'VTAS.B')
        AND VentaTCalc.Ejercicio = @Ejericio
      GROUP BY dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2), dbo.fnMesNumeroNombre(VentaTCalc.Periodo)
      ORDER BY dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2)
RETURN
END
GO

/*** spReporteVentaSemanal ***/
if exists (select * from sysobjects where id = object_id('dbo.spReporteVentaSemanal') and type = 'P')
  DROP procedure dbo.spReporteVentaSemanal
GO
CREATE PROCEDURE spReporteVentaSemanal
  @Empresa char(5),
  @FechaD datetime,
  @FechaA datetime
AS BEGIN
  SELECT
    VentaTCalc.FechaEmision AS Dia,
    SUM(CASE
          WHEN MovTipo.Clave = 'VTAS.F'
          THEN ImporteTotal
          ELSE - ImporteTotal
        END) AS ImporteReal  FROM VentaTCalc
  JOIN MovTipo
    ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
  WHERE VentaTCalc.EMpresa = @Empresa
  AND VentaTCalc.Estatus IN ('CONCLUIDO')
  AND MovTipo.Clave IN ( 'VTAS.F',  'VTAS.D',  'VTAS.B')
  AND FechaEmision BETWEEN @FechaD AND @FechaA
  GROUP BY  VentaTCalc.FechaEmision ORDER BY  VentaTCalc.FechaEmision
RETURN
END
GO 

/*** spReporteVentaMensual ***/
if exists (select * from sysobjects where id = object_id('dbo.spReporteVentaMensual') and type = 'P')
  DROP procedure dbo.spReporteVentaMensual
GO
CREATE PROCEDURE spReporteVentaMensual
  @Empresa char(5),
  @Ejericio int,
  @Periodo  int
AS BEGIN
  SELECT
    VentaTCalc.FechaEmision   AS Dia,
    SUM(CASE
        WHEN MovTipo.Clave = 'VTAS.F'
        THEN ImporteTotal
        ELSE - ImporteTotal
      END) AS ImporteReal
  FROM VentaTCalc
  JOIN MovTipo
    ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
  WHERE
    VentaTCalc.EMpresa = @Empresa
    AND VentaTCalc.Estatus IN ('CONCLUIDO')
    AND MovTipo.Clave IN ( 'VTAS.F',  'VTAS.D',  'VTAS.B')
    AND VentaTCalc.Ejercicio = @Ejericio
    AND VentaTCalc.Periodo = @Periodo
  GROUP BY  VentaTCalc.FechaEmision
RETURN
END
GO

/*** spWebClienteExpress ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebClienteExpress') and type = 'P')
  DROP procedure dbo.spWebClienteExpress
GO
CREATE PROCEDURE spWebClienteExpress
  @WebUsuario varchar(20),
  @Nombre     varchar(100),
  @Telefono   varchar(50),
  @RFC        varchar(30) = NULL
AS BEGIN
  DECLARE
    @Agente varchar(10),
    @Empresa    char(5),
    @Usuario    varchar(10),
    @Moneda     varchar(10)

    EXEC spUsuarioWeb @WebUsuario, @Empresa OUTPUT, @Agente OUTPUT, @Usuario OUTPUT
    DECLARE
      @CteExpressDef     varchar(20),
      @Prefijo             varchar(5),
      @CteExpressDigitos   int,
      @CteExpressCategoria   varchar(50),
      @CteExpressCondicion  varchar(50),
      @CteExpressPrefijo    varchar(20)
    SELECT
      @CteExpressDef = CteExpressDef,
      @Prefijo = CteExpressPrefijo,
      @CteExpressDigitos = CteExpressDigitos,
      @CteExpressCategoria = CteExpressCategoria,
      @CteExpressCondicion = CteExpressCondicion
    FROM EmpresaGral
    WHERE Empresa = @Empresa
      SELECT @CteExpressPrefijo = @Prefijo+'[0-9]%'
      SELECT @Moneda = EmpresaCfg.ContMoneda
      FROM EmpresaCfg
      WHERE EmpresaCfg.Empresa = @Empresa

    EXEC spAgregarClienteExpress @CteExpressDef, @Nombre, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, @RFC, NULL, NULL, NULL, @CteExpressCategoria, NULL, NULL, NULL, 'Cliente', NULL, @Moneda, @Prefijo,  @CteExpressPrefijo, @CteExpressDigitos, @CteExpressCondicion, NULL, NULL,   @Empresa, NULL, NULL, NULL, NULL, @Sucursal=0, @FueraLinea=0
RETURN
END
GO

/*** spWebArtDisponible ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebArtDisponible') and type = 'P')
  DROP procedure dbo.spWebArtDisponible
GO
CREATE PROCEDURE spWebArtDisponible
  @Empresa    varchar(5),
  @Articulo   varchar(20)
AS BEGIN
  SELECT
    Alm.Sucursal,
    ArtDisponible.Articulo,
    Alm.Nombre, Disponible
  FROM ArtDisponible
  JOIN Alm
    ON ArtDisponible.Almacen = Alm.Almacen
  WHERE
    ArtDisponible.Empresa = @Empresa
    AND ArtDisponible.Articulo = @Articulo
    AND ISNULL(ArtDisponible.Disponible,0.0)  > 0.00
    AND Alm.wMostrar = 1
RETURN
END
GO

/*** spAppAvantiDelProducto ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiDelProducto') and type = 'P')
  DROP procedure dbo.spAppAvantiDelProducto
GO
CREATE PROCEDURE spAppAvantiDelProducto
  @ID int
AS BEGIN
  DECLARE
    @Articulos int,
    @OkRef VARCHAR(255),
    @Modulo CHAR(5),
    @ModuloID INT

  SET @OkRef = 'Ok'

  IF EXISTS(SELECT * FROM CarritoAPP WHERE CarritoAPP.ID = @ID)
  BEGIN
    BEGIN TRANSACTION trDelProduct

        SELECT @Modulo = CarritoAPP.Modulo, @ModuloID = CarritoAPP.ModuloID
        FROM CarritoAPP
        WHERE CarritoAPP.ID = @ID

        BEGIN TRY
          IF @Modulo IS NOT NULL AND  @ModuloID IS NOT NULL
          BEGIN
            UPDATE CarritoAPP SET GenerarVenta = 0 WHERE CarritoAPP.ID = @ID
            COMMIT TRANSACTION trDelProduct
          END
          ELSE
          BEGIN
            DELETE CarritoAPP WHERE CarritoAPP.ID = @ID
            COMMIT TRANSACTION trDelProduct
          END
        END TRY
        BEGIN CATCH
          IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trDelProduct
          SET @OkRef = ERROR_MESSAGE()
        END CATCH

    SELECT @OkRef AS [Message]
  END
END
GO

/*** spAppAvantiDelCotizacion ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiDelCotizacion') and type = 'P')
  DROP procedure dbo.spAppAvantiDelCotizacion
GO
CREATE PROCEDURE spAppAvantiDelCotizacion
  @ID int
AS BEGIN
  DECLARE
    @OkRef VARCHAR(255),
    @Modulo CHAR(5),
    @ModuloID INT,
    @Usuario VARCHAR(20),
    @Cliente VARCHAR(20)

  SET @OkRef = 'Ok'

  IF EXISTS(SELECT * FROM CarritoAPP WHERE CarritoAPP.ID = @ID)
  BEGIN

    SELECT
      @Modulo = CarritoAPP.Modulo,
      @ModuloID = CarritoAPP.ModuloID,
      @Usuario = CarritoAPP.Usuario,
      @Cliente = CarritoAPP.Cliente
    FROM CarritoAPP
    WHERE CarritoAPP.ID = @ID

    BEGIN TRANSACTION trDelCotizacion

    BEGIN TRY

      IF @Modulo IS NOT NULL AND @ModuloID IS NOT NULL
      BEGIN
        UPDATE CarritoAPP SET GenerarVenta = 0 WHERE CarritoAPP.Modulo = @Modulo AND CarritoAPP.ModuloID = @ModuloID
      END
      ELSE
      BEGIN
        DELETE CarritoAPP WHERE CarritoAPP.Usuario = @Usuario AND CarritoAPP.Cliente = @Cliente
          AND CarritoApp.Modulo IS NULL
          AND CarritoApp.ModuloID IS NULL
          AND CarritoApp.Renglon IS NULL
      END

      COMMIT TRANSACTION trDelCotizacion
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trDelCotizacion
      SET @OkRef = ERROR_MESSAGE()
    END CATCH
  END

  SELECT @OkRef AS [Message]
END
GO

/*** spAppAvantiPedidosCliente ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiPedidosCliente') and type = 'P')
  DROP procedure dbo.spAppAvantiPedidosCliente
GO
CREATE PROCEDURE spAppAvantiPedidosCliente
  @Cliente VARCHAR(10)
AS
BEGIN
  SELECT
    v.ID,MovID,
    v.Estatus,
    s.Nombre as Sucursal,
    CONVERT(VARCHAR(10), FechaEmision, 103) AS Fecha,
    SUM(vd.Cantidad) as Productos,
    (v.PrecioTotal + v.Impuestos) AS PrecioTotal,
    RTRIM(v.Moneda) as Moneda
  FROM Venta v
  JOIN Sucursal s
    ON s.Sucursal = v.Sucursal
  JOIN VentaD vd ON vd.ID = v.ID
  WHERE
    v.Mov= 'Venta Pedido'
    AND v.estatus= 'PENDIENTE'
    AND v.cliente=@Cliente
  GROUP BY v.ID, v.MovID ,v.Estatus , s.Nombre, FechaEmision ,v.PrecioTotal, v.Impuestos,v.Moneda
  ORDER BY ID
END
GO

/*** spWebSoporteGenerar ***/
if exists (select * from sysobjects where id = object_id('dbo.spWebSoporteGenerar') and type = 'P')
  DROP procedure dbo.spWebSoporteGenerar
GO
CREATE PROCEDURE spWebSoporteGenerar
  @WebUsuario  varchar(20),
  @Cliente  varchar(10),
  @Que      varchar(20),
  @Titulo    varchar(50),
  @Reporte  varchar(255)
AS
BEGIN
  DECLARE @Mov    varchar(20),
  @SoporteID  int,
  @Ok         int,
  @FechaEmision datetime,
  @Sucursal    int,
  @Agente varchar(10),
  @Empresa    char(5),
  @Usuario    varchar(10),
  @OkRef       varchar(250)

  EXEC spUsuarioWeb @WebUsuario, @Empresa OUTPUT, @Agente OUTPUT, @Usuario OUTPUT

  SELECT @Mov = 'Mensaje', @FechaEmision  = dbo.fnFechaSinHora(GETDATE())
  IF @Que NOT IN ('WhatsApp', 'Correo', 'llamada')
    SELECT @Ok =  10060, @OkRef = 'Indique un medio Valido'
    ELSE IF NULLIF(RTRIM(@Empresa), '')  IS NULL SELECT @Ok =  10060, @OkRef = 'Falta Configurar La empresa en cfg Web'
    ELSE IF NULLIF(RTRIM(@Agente), '')   IS NULL SELECT @Ok =  10060, @OkRef = 'Falta Configurar EL Agente en cfg Web'
    ELSE IF NULLIF(RTRIM(@Usuario), '')  IS NULL SELECT @Ok =  10060, @OkRef = 'Falta Configurar EL Usuario en cfg Web'

  BEGIN TRANSACTION

  IF @Ok IS NULL
  BEGIN
    INSERT INTO Soporte
      (Empresa, FechaEmision, Sucursal, Mov, Usuario, UsuarioResponsable, Estatus, Cliente, Agente, Estado, Titulo, Comentarios, Medio)
    VALUES (@Empresa, @FechaEmision, 0, @Mov, @UsUario,  @UsUario, 'SINAFECTAR', @Cliente, @Agente, 'Completado', @Titulo, @Reporte, @Que)

    SELECT @SoporteID = SCOPE_IDENTITY()
      EXEC spAfectar 'ST', @SoporteID, @Usuario = @Usuario, @EnSilencio = 1, @Ok = @Ok OUTPUT, @OkRef = @OkRef OUTPUT, @Conexion = 0
  END

  IF @Ok IS NULL
  BEGIN
    COMMIT TRANSACTION

    SELECT @OkRef = 'Ok'
  END
  ELSE
  BEGIN
    ROLLBACK TRANSACTION
    SELECT @OkRef = RTRIM(Descripcion)+' '+@OkRef FROM MensajeLista WHERE Mensaje = @Ok
  END

  SELECT @OkRef AS OkRef
RETURN
END
GO

/*** spAppAvantiActualizarProducto ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiActualizarProducto') and type = 'P')
  DROP procedure dbo.spAppAvantiActualizarProducto
GO
CREATE PROCEDURE spAppAvantiActualizarProducto
  @ID INT,
  @Cantidad INT = NULL,
  @Descripcion VARCHAR(255) = NULL,
  @Condicion VARCHAR(50) = NULL,
  @GenerarVenta bit = NULL
AS
BEGIN
  DECLARE
    @Ok INT,
    @OkRef VARCHAR(255),
    @Modulo CHAR(5),
    @ModuloID INT, 
    @Renglon INT

  SET @OkRef = 'Producto no encontrado'
  IF EXISTS(SELECT * FROM CarritoAPP WHERE ID = @ID)
  BEGIN

    SELECT
      @Modulo = CarritoAPP.Modulo,
      @ModuloID = CarritoAPP.ModuloID,
      @Renglon = CarritoAPP.Renglon
    FROM CarritoAPP
    WHERE ID = @ID

    BEGIN TRANSACTION trUpdateProducto

    BEGIN TRY

      IF @Cantidad IS NOT NULL
      BEGIN
        UPDATE CarritoAPP SET Cantidad = @Cantidad WHERE ID = @ID
      END

      IF @Descripcion IS NOT NULL
      BEGIN
        UPDATE CarritoAPP SET DescripcionExtra = @Descripcion WHERE ID = @ID
      END

      IF @Condicion IS NOT NULL
      BEGIN
        UPDATE CarritoAPP SET Condicion = @Condicion WHERE ID = @ID
      END

      IF @GenerarVenta IS NOT NULL
      BEGIN
        UPDATE CarritoAPP SET GenerarVenta = @GenerarVenta WHERE ID = @ID
      END

      COMMIT TRANSACTION trUpdateProducto
      SET @OkRef = 'Ok'
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trUpdateProducto
      SET @OkRef = ERROR_MESSAGE()
    END CATCH

  END

  SELECT @OkRef AS [Message]
END
GO

/****** spWebVentaPedido ******/
if exists (select * from sysobjects where id = object_id('dbo.spWebVentaPedido') and type = 'P') drop procedure dbo.spWebVentaPedido
GO
CREATE PROCEDURE spWebVentaPedido  
      @Empresa  varchar(5),        
      @Cliente  varchar(10)
AS BEGIN 

     SELECT VentaTCalc.ID, 
        VentaTCalc.Mov, 
        VentaTCalc.MovID, 
        VentaTCalc.FechaEmision, 
        Sucursal.Nombre, 
        VentaTCalc.Situacion, 
        VentaTCalc.Estatus 
     FROM VentaTCalc
       JOIN MovTipo  ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
       JOIN Sucursal ON VentaTCalc.Sucursal = Sucursal.Sucursal
  WHERE VentaTCalc.Estatus = 'PENDIENTE'
     AND VentaTCalc.Empresa = @Empresa 
     AND MovTipo.Clave IN ('VTAS.P') 
     AND VentaTCalc.Cliente =  @Cliente
    GROUP BY  VentaTCalc.ID,
        VentaTCalc.Mov, 
        VentaTCalc.MovID, 
        VentaTCalc.FechaEmision, 
        Sucursal.Nombre, 
        VentaTCalc.Situacion, 
        VentaTCalc.Estatus 
  ORDER BY VentaTCalc.FechaEmision DESC, VentaTCalc.ID

  RETURN 
END 
GO 

/****** spWebVentaPedidoD ******/
if exists (select * from sysobjects where id = object_id('dbo.spWebVentaPedidoD') and type = 'P') drop procedure dbo.spWebVentaPedidoD
GO
CREATE PROCEDURE spWebVentaPedidoD  
      @ID       int
AS BEGIN 

     SELECT VentaTCalc.ID, 
        VentaTCalc.Renglon, 
        VentaTCalc.Articulo,  
        Art.Descripcion1,
        VentaTCalc.CantidadNeta AS Cantidad,  
        ISNULL(VentaTCalc.CantidadPendiente,0.00)  + ISNULL(VentaTCalc.CantidadReservada,0.00)  + ISNULL(VentaTCalc.CantidadOrdenada, 0.00) AS CantidadPendiente,  
        VentaTCalc.Precio, 
        VentaTCalc.SubTotal
     FROM VentaTCalc
       JOIN Art  ON VentaTCalc.Articulo = Art.Articulo
  WHERE  
            VentaTCalc.ID  =  @ID
  ORDER BY VentaTCalc.Renglon 

  RETURN 
END 
GO

/**************** spLlenarTiempo ****************/
if exists (select * from sysobjects where id = object_id('dbo.spLlenarTiempo') and type = 'P') drop procedure dbo.spLlenarTiempo
GO
CREATE PROCEDURE spLlenarTiempo 

AS BEGIN 

DECLARE @fecha  SMALLDATETIME
DECLARE @fechaAux   SMALLDATETIME
DECLARE @i    INT
DECLARE @Dia    TINYINT   
DECLARE @Mes    TINYINT
DECLARE @Anio   SMALLINT
DECLARE @AnioAux  SMALLINT
DECLARE @NoSemana SMALLINT
DECLARE @NoDia  SMALLINT
DECLARE @DiaNombre  VARCHAR(30)
DECLARE @MesNombre  VARCHAR(30)
DECLARE @Semana VARCHAR(50)
DECLARE @Trimestre  VARCHAR(30)
DECLARE @CuaTrimestre VARCHAR(30)
DECLARE @Quincena VARCHAR(30)
DECLARE @Bimestre VARCHAR(30)
DECLARE @Semestre VARCHAR(30)
DECLARE @PrimerDia  INT

SELECT @i   = 0
SELECT @fecha   = '2000/01/01'
SELECT @fechaAux = '2000/01/01'
SELECT @AnioAux = 2000
SELECT @NoDia = 0

SELECT @PrimerDia = 4 
SET DATEFIRST 1


DELETE Tiempo 

WHILE @i < 25000 ---15 años 1990 - 2006
  BEGIN
    SET @Dia  = DATEPART(DD,@fecha)
    SET @Mes  = DATEPART(M,@fecha)
    SET @Anio = DATEPART(YY,@fecha)   
  
--- Se cambio Nodia del AÑo por dia de la semana 8/10/2003
    SET @NoDia    = DATEPART(DW,@fecha)
    SET @DiaNombre = CASE DATEPART(DW,@fecha)
      WHEN 1 THEN '1 Lunes ' 
      WHEN 2 THEN '2 Martes ' 
      WHEN 3 THEN '3 Miercoles ' 
      WHEN 4 THEN '4 Jueves '
      WHEN 5 THEN '5 Viernes ' 
      WHEN 6 THEN '6 Sabado ' 
      WHEN 7 THEN '7 Domingo' 
          END
    SET @MesNombre = CASE MONTH(@fecha)
      WHEN  1 THEN '01Enero' 
      WHEN  2 THEN '02Febrero'
      WHEN  3 THEN '03Marzo' 
      WHEN  4 THEN '04Abril' 
      WHEN  5 THEN '05Mayo' 
      WHEN  6 THEN '06Junio' 
      WHEN  7 THEN '07Julio' 
      WHEN  8 THEN '08Agosto' 
      WHEN  9 THEN '09Septiembre' 
      WHEN 10 THEN '10Octubre' 
      WHEN 11 THEN '11Noviembre' 
      WHEN 12 THEN '12Diciembre' 
          END

  SET @Nosemana =  DATEPART(WK,@fecha) 

  IF  DATEPART(DW,@fecha) = 1
    SET @fechaAux = @fecha

  SET @Semana = 'Semana ' + CASE WHEN DATEPART(WK,@fecha) < 10 THEN '0' ELSE '' END 
             + CONVERT(CHAR(2),DATEPART(WK,@fecha)) + ' ('
           + CONVERT(VARCHAR,DAY(@fechaAux))  
           + CONVERT(VARCHAR,CASE MONTH(@fechaAux)
              WHEN  1 THEN 'ENE' 
              WHEN  2 THEN 'FEB'
              WHEN  3 THEN 'MAR' 
              WHEN  4 THEN 'ABR' 
              WHEN  5 THEN 'MAY' 
              WHEN  6 THEN 'JUN' 
              WHEN  7 THEN 'JUL' 
              WHEN  8 THEN 'AGO' 
              WHEN  9 THEN 'SEP' 
              WHEN 10 THEN 'OCT' 
              WHEN 11 THEN 'NOV' 
              WHEN 12 THEN 'DIC' END) + '-'
           + CONVERT(VARCHAR,DAY(dateadd(d,6,@fechaAux))) 
           + CONVERT(VARCHAR,CASE MONTH(dateadd(d,6,@fechaAux))
              WHEN  1 THEN 'ENE' 
              WHEN  2 THEN 'FEB'
              WHEN  3 THEN 'MAR' 
              WHEN  4 THEN 'ABR' 
              WHEN  5 THEN 'MAY' 
              WHEN  6 THEN 'JUN' 
              WHEN  7 THEN 'JUL' 
              WHEN  8 THEN 'AGO' 
              WHEN  9 THEN 'SEP' 
              WHEN 10 THEN 'OCT' 
              WHEN 11 THEN 'NOV' 
              WHEN 12 THEN 'DIC' END) + ')'

     SET @Quincena = CASE 
      WHEN DAY(@FECHA) <16 THEN 'Quincena 1 '
                    ELSE 'Quincena 2 '          
          END


     SET @Bimestre = CASE 
      WHEN MONTH(@FECHA) in(1,2)  THEN 'Bimestre 1 '
      WHEN MONTH(@FECHA) in(3,4)  THEN 'Bimestre 2 ' 
      WHEN MONTH(@FECHA) in(5,6)  THEN 'Bimestre 3 ' 
      WHEN MONTH(@FECHA) in(7,8)  THEN 'Bimestre 4 ' 
      WHEN MONTH(@FECHA) in(9,10)   THEN 'Bimestre 5 ' 
      WHEN MONTH(@FECHA) in(11,12)  THEN 'Bimestre 6 ' 
          END

     SET @Trimestre =  CASE 
      WHEN MONTH(@FECHA) in(1,2,3)  THEN 'Trimestre 1 ' 
      WHEN MONTH(@FECHA) in(4,5,6)  THEN 'Trimestre 2 ' 
      WHEN MONTH(@FECHA) in(7,8,9)  THEN 'Trimestre 3 ' 
      WHEN MONTH(@FECHA) in(10,11,12) THEN 'Trimestre 4 ' 
          END

     SET @semestre = CASE 
      WHEN MONTH(@FECHA) in(1,2,3,4,5,6)  THEN 'Semestre 1 ' 
      WHEN MONTH(@FECHA)in(7,8,9,10,11,12)  THEN 'Semestre 2 ' 
          END

     SET @cuaTrimestre = CASE 
      WHEN MONTH(@FECHA) in(1,2,3,4 )   THEN 'Cuatrimestre 1 ' 
      WHEN MONTH(@FECHA) in(5,6,7,8 )   THEN 'Cuatrimestre 2 ' 
      WHEN MONTH(@FECHA) in(9,10,11,12  ) THEN 'Cuatrimestre 3 ' 
          END

    INSERT INTO Tiempo (Fecha,NoDia,Dia,Mes,Anio,DiaNombre,MesNombre,NoSemana,Semana,Trimestre,CuaTrimestre,Quincena,Bimestre,Semestre)
  VALUES( @fecha, @NoDia, @Dia,@Mes,@Anio,@DiaNombre,@MesNombre,@NoSemana,@Semana,@Trimestre,@CuaTrimestre,@Quincena,@Bimestre,@Semestre)
    SELECT @fecha = dateadd(d,1,@fecha )
    SELECT @i     = @i +1
  END

RETURN 
END 
GO

/**************** fnVentaAcumApp ****************/
IF EXISTS (SELECT name FROM sysobjects WHERE name = 'fnVentaAcumApp') DROP FUNCTION fnVentaAcumApp
 GO  
CREATE FUNCTION fnVentaAcumApp (@Empresa char(5),  @FechaD datetime, @FechaA datetime)    
RETURNS money  
AS BEGIN     
DECLARE 
@Importe  money 

SELECT @Importe = SUM(CASE WHEN MovTipo.Clave = 'VTAS.F' THEN ImporteTotal ELSE - ImporteTotal END) 
  FROM VentaTCalc  
JOIN MovTipo ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
WHERE 
   VentaTCalc.Empresa = @Empresa
 AND VentaTCalc.Estatus IN ('CONCLUIDO') AND MovTipo.Clave IN ( 'VTAS.F',  'VTAS.D',  'VTAS.B') 
 AND VentaTCalc.FechaEmision BETWEEN @FechaD AND @FechaA 

 RETURN(@Importe)      
END 
GO

/**************** spRepVentaSemanal ****************/
if exists (select * from sysobjects where id = object_id('dbo.spRepVentaSemanal') and type = 'P') drop procedure dbo.spRepVentaSemanal
GO
CREATE PROCEDURE spRepVentaSemanal   
    @Empresa char(5),
    @Ejericio int, 
    @Periodo  int

AS BEGIN 
    SELECT Tiempo.Fecha AS Fecha, 
         dbo.fnVentaAcumApp(@Empresa, DATEADD(day, -6, Tiempo.Fecha), Tiempo.Fecha) Ingreso
 FROM Tiempo WHERE Tiempo.Anio = @Ejericio AND Tiempo.Mes = @Periodo AND Tiempo.DiaNombre = '4 Jueves'

RETURN 
END
GO

/**************** spRepVentaMensual ****************/
if exists (select * from sysobjects where id = object_id('dbo.spRepVentaMensual') and type = 'P') drop procedure dbo.spRepVentaMensual
GO
CREATE PROCEDURE spRepVentaMensual  
                      @Empresa char(5), 
                      @Ejericio int 

AS BEGIN 

SELECT  dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2) AS Mes,
        dbo.fnMesNumeroNombre(VentaTCalc.Periodo)      AS NombreMes,  
        SUM(CASE WHEN MovTipo.Clave = 'VTAS.F' THEN ImporteTotal ELSE - ImporteTotal END) AS ImporteReal
  FROM VentaTCalc  
JOIN MovTipo ON VentaTCalc.Mov = MovTipo.Mov AND MovTipo.Modulo = 'VTAS'
WHERE 
   VentaTCalc.EMpresa = @Empresa
 AND VentaTCalc.Estatus IN ('CONCLUIDO') AND MovTipo.Clave IN ( 'VTAS.F',  'VTAS.D',  'VTAS.B') 
 AND VentaTCalc.Ejercicio = @Ejericio 
GROUP BY  
    dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2),
    dbo.fnMesNumeroNombre(VentaTCalc.Periodo)
 ORDER BY dbo.fnRellenarCerosIzquierda(VentaTCalc.Periodo,2)

RETURN
END 
GO

/*** spAppAvantiInfoCliente ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiInfoCliente') and type = 'P') drop procedure dbo.spAppAvantiInfoCliente
GO
CREATE PROCEDURE spAppAvantiInfoCliente
  @Cliente VARCHAR(10)
AS
BEGIN
  SELECT
    Cliente,
    Nombre,
    NombreCorto,
    Direccion AS Calle,
    DireccionNumero,
    Colonia,
    Delegacion,
    Poblacion,
    Estado,
    Pais,
    CodigoPostal,
    Telefonos,
    eMail1,
    Observaciones,
    RFC
  FROM Cte
  WHERE Cliente = @Cliente
END
GO

/*** spAppAvantiInfoCliente ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiInfoClienteUsuario') and type = 'P')
  drop procedure dbo.spAppAvantiInfoClienteUsuario
GO
CREATE PROCEDURE spAppAvantiInfoClienteUsuario
  @UsuarioWeb VARCHAR(20)
AS
BEGIN
  SELECT
    Cte.Cliente,
    Cte.Nombre,
    Cte.Telefonos,
    Cte.eMail1
  FROM WebUsuario
  JOIN Cte
    ON Cte.Cliente = WebUsuario.Cliente
  WHERE UsuarioWeb = @UsuarioWeb
END
GO

/*** spAppAvantiInfoCotizacion ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiInfoCotizacion') and type = 'P') drop procedure dbo.spAppAvantiInfoCotizacion
GO
CREATE PROCEDURE spAppAvantiInfoCotizacion
  @Modulo CHAR(5) = NULL,
  @ModuloID INT = NULL,
  @Cliente VARCHAR(10) = NULL,
  @UsuarioWeb VARCHAR(20)
AS
BEGIN
  SELECT
    CarritoAPP.ID,
    CarritoAPP.Usuario,
    CarritoAPP.Cliente,
    CarritoAPP.Condicion,
    CarritoAPP.Modulo,
    CarritoAPP.ModuloID,
    CarritoAPP.Renglon,
    CarritoAPP.Articulo,
    Art.Descripcion1 AS Descripcion,
    Art.Unidad,
    Art.PrecioLista,
    CarritoAPP.Cantidad,
    CarritoAPP.Precio,
    CarritoAPP.Precio2,
    CarritoAPP.Precio3,
    CarritoAPP.DescripcionExtra,
    CarritoAPP.GenerarVenta,
    CarritoAPP.RenglonTipo,
    CarritoAPP.Almacen
  FROM CarritoAPP
  JOIN Art
    ON Art.Articulo = CarritoApp.Articulo
  WHERE
    CarritoAPP.Usuario = @UsuarioWeb
   AND ISNULL(CarritoAPP.Cliente, '') LIKE ISNULL(@Cliente,'%%')
   AND ISNULL(CarritoAPP.Modulo,'') LIKE ISNULL(@Modulo,'%%')
   AND ISNULL(CarritoAPP.ModuloID,'') = ISNULL(@ModuloID,'')
END
GO

/*** spAppAvantiInfoEmpresa ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiInfoEmpresa') and type = 'P') drop procedure dbo.spAppAvantiInfoEmpresa
GO
CREATE PROCEDURE spAppAvantiInfoEmpresa
  @UsuarioWeb VARCHAR(20)
AS
BEGIN
  DECLARE @Empresa VARCHAR(5)

  SELECT @Empresa=Empresa FROM WebUsuario WHERE UsuarioWeb = @UsuarioWeb
  
  SELECT
    Nombre,
    Direccion,
    DireccionNumero,
    DireccionNumeroInt,
    Colonia,
    Poblacion,
    Estado,
    Pais,
    CodigoPostal,
    Telefonos,
    RFC
  FROM Empresa
  WHERE Empresa = @Empresa
END
GO

/*** spAppAvantiInfoAgente ***/
if exists ( select * from sysobjects where id = object_id('dbo.spAppAvantiInfoAgente') and type = 'P')
    drop procedure dbo.spAppAvantiInfoAgente
GO
CREATE PROCEDURE spAppAvantiInfoAgente
  @UsuarioWeb VARCHAR(20)
AS BEGIN
  DECLARE
    @Agente VARCHAR(10)
  
  SELECT @Agente=Agente FROM WebUsuario WHERE UsuarioWeb = @UsuarioWeb
  
  SELECT
    Agente,
    Nombre,
    eMail,
    Telefonos
  FROM Agente
  WHERE Agente = @Agente
END
GO

/*** spAppAvantiSucursales ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiSucursales') and type = 'P')
  DROP procedure dbo.spAppAvantiSucursales
GO
CREATE PROCEDURE spAppAvantiSucursales
  @UsuarioWeb VARCHAR(20)
AS
BEGIN
  DECLARE
    @Empresa VARCHAR(5),
    @Grupo VARCHAR(50)
  
  SELECT @Empresa=Empresa FROM WebUsuario WHERE UsuarioWeb = @UsuarioWeb
  
  IF @Empresa = 'RTM' SET @Grupo = 'R TORRES'
  ELSE IF @Empresa = 'CMB' SET @Grupo = 'AVANTI'
  ELSE SET @Grupo = 'R TORRES'
  
  SELECT
    Sucursal,
    Nombre,
    Direccion,
    DireccionNumero,
    Delegacion,
    Colonia,
    Estado,
    CodigoPostal,
    Telefonos
  FROM Sucursal
  WHERE Grupo = @Grupo
END
GO

/**************** spListaUsuariosWeb ****************/
if exists (select * from sysobjects where id = object_id('dbo.spListaUsuariosWeb') and type = 'P') drop procedure dbo.spListaUsuariosWeb
GO
CREATE PROCEDURE spListaUsuariosWeb  

AS BEGIN 

SELECT UsuarioWeb,Nombre 
    FROM WebUsuario 
    WHERE Rol = 'Vendedor' 
    AND Estatus = 'Alta'

RETURN
END 
GO 

/*** spAppAvantiSucursales ***/
if exists (select * from sysobjects where id = object_id('dbo.spVentaCoheteAPP') and type = 'P')
  DROP procedure dbo.spVentaCoheteAPP
GO
CREATE PROCEDURE spVentaCoheteAPP  
  @WebUsuario varchar(20),   
  @Ejericio   int,
  @Periodo    int
AS
BEGIN   
  DECLARE   
  @FechaD   datetime,  
  @FechaA   datetime,    
  @Empresa  char(5),  
  @Agente   varchar(10),   
  @Usuario  varchar(10),   
  @Presupuesto  money,   
  @PresupuestoDiario money,   
  @Dias         int    
    
     
    
  EXEC spUsuarioWeb @WebUsuario, @Empresa OUTPUT, @Agente OUTPUT, @Usuario OUTPUT, NULL   
    
   SELECT @FechaD = MIN(Fecha),    
       @FechaA = MAX(Fecha)   
    FROM  dbo.fnCalendarioMensual (@Ejericio, @Periodo)   
    
  SELECT @Dias = DATEDIFF(day, @FechaD, @FechaA) + 1   
    
  SELECT @Presupuesto = ISNULL(Presupuesto,0.00)    
    FROM AgenteCohete   
   WHERE Ejercicio = @Ejericio AND Periodo = @Periodo AND Agente = @Agente  
    
    
  IF @Presupuesto > 0.00 SELECT @PresupuestoDiario = @Presupuesto / @Dias
    
  SELECT  Fecha,   
          dbo.fnRellenarCerosIzquierda(DAY(Fecha),2) AS FechaNombre,   
          ISNULL(dbo.fnVentaAcumApp(@Empresa, @FechaD, Fecha, @Agente, NULL),0) AS Importe,     
          @PresupuestoDiario * DAY(Fecha) AS Presupuesto  
  FROM  dbo.fnCalendarioMensual (@Ejericio, @Periodo)   
  WHERE Fecha < = dbo.fnFechaSinHora(GETDATE())  
       ORDER BY Fecha ASC  
    
  RETURN
END
GO

/*** spAppAvantiSucursales ***/
if exists (select * from sysobjects where id = object_id('dbo.spAPPTermometro') and type = 'P')
  DROP procedure dbo.spAPPTermometro
GO
CREATE PROCEDURE spAPPTermometro
  @UsuarioWeb varchar(20),
  @ID         int,
  @Termometro int = NULL,
  @Observaciones varchar(100) = NULL,
  @Atencion      varchar(50) = NULL
AS BEGIN
DECLARE
 @Empresa    char(5),
 @Agente     varchar(10),
 @Usuario    varchar(10),
 @Ok         int,
 @OkRef      varchar(255)

EXEC spUsuarioWeb  @UsuarioWeb, @Empresa OUTPUT, @Agente OUTPUT, @Usuario OUTPUT, NULL, NULL, NULL

  BEGIN TRY
  
  SELECT
    @Termometro= ISNULL(@Termometro,Situacion),
    @Observaciones= ISNULL(@Observaciones,Observaciones),
    @Atencion= ISNULL(@Atencion,Atencion)
    FROM Venta WHERE ID = @ID
    
    UPDATE Venta SET Situacion = CASE @Termometro
      WHEN  1 THEN 'Venta En Frio'
      WHEN  2 THEN 'Venta En Tibio'
      WHEN  3 THEN 'Venta En Caliente'
      ELSE
        NULL
      END,
      SituacionFecha = GETDATE(),
      Venta.Observaciones = @Observaciones,
      Venta.Atencion = @Atencion,
      SituacionUsuario =  @Usuario
      WHERE Venta.ID = @ID

  END TRY  
  BEGIN CATCH
    SELECT @Ok = 1, @OkRef = dbo.fnOkRefSQL(ERROR_NUMBER(), ERROR_MESSAGE())
    RETURN
  END CATCH

  SELECT @Ok    AS Ok,
       @OkRef AS OkRef

RETURN
END
GO

/*** spAppAvantiInfoVenta ***/
if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiInfoVenta') and type = 'P')
  DROP procedure dbo.spAppAvantiInfoVenta
GO
CREATE PROCEDURE spAppAvantiInfoVenta
  @ID INT
AS
BEGIN
  SELECT
    Venta.ID,
    ISNULL(Empresa.Nombre, 'SIN EMPRESA') AS Empresa,
    Venta.Mov,
    Venta.MovID,
    Venta.Usuario,
    ISNULL(Usuario.Nombre, 'AGENTE GENERICO') AS NombreUsuario,
    Venta.Estatus,
    Venta.Cliente,
    Venta.Almacen,
    ISNULL(Alm.Nombre, 'SIN ALMACEN') AS NombreAlmacen,
    Venta.Agente,
    ISNULL(Agente.Nombre, '') AS NombreAgente,
    Venta.Condicion,
    Venta.Ejercicio,
    Venta.Periodo,
    Venta.Sucursal,
    Venta.Observaciones,
    Venta.Atencion,
    ISNULL(Sucursal.Nombre,'SIN SUCURSAL') AS NombreSucursal
  FROM Venta
  LEFT JOIN Empresa
    ON Empresa.Empresa = Venta.Empresa
  LEFT JOIN Usuario
    ON Usuario.Usuario = Venta.Usuario
  LEFT JOIN Alm
    ON Alm.Almacen = Venta.Almacen
  LEFT JOIN Agente
    ON Agente.Agente = Venta.Agente
  LEFT JOIN Sucursal
    ON Sucursal.Sucursal = Venta.Sucursal
  WHERE
    ID = @ID
END
GO

/*** spListaUsuariosWeb ***/
if exists (select * from sysobjects where id = object_id('dbo.spListaUsuariosWeb') and type = 'P')
  DROP procedure dbo.spListaUsuariosWeb
GO
CREATE PROCEDURE spListaUsuariosWeb
AS
BEGIN
  SELECT
    UsuarioWeb,Nombre
  FROM WebUsuario
  WHERE 
  (Rol = 'Vendedor' OR Rol = 'Recepcion' OR Rol = 'Gerente')
  AND Estatus = 'Alta'
RETURN
END
GO

/*** spRegisterSw ***/
IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spRegisterSw') AND type = 'P')
  DROP PROCEDURE spRegisterSw
GO
CREATE PROCEDURE spRegisterSw
  @UsuarioWeb VARCHAR(20),
  @Token VARCHAR(255)
AS
BEGIN
  IF EXISTS(SELECT * FROM NotificacionApp WHERE Usuario = @UsuarioWeb)
  BEGIN
     UPDATE NotificacionApp SET Token = @Token WHERE Usuario = @UsuarioWeb
  END
  ELSE
  BEGIN
    INSERT INTO NotificacionApp(Usuario, Token, Enviado) VALUES (@UsuarioWeb, @Token, 0);
  END
  SELECT 'Ok' AS OkRef
END
GO