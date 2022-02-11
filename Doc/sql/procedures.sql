SET DATEFIRST 7
SET ANSI_NULLS OFF
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET LOCK_TIMEOUT -1
SET QUOTED_IDENTIFIER OFF
GO
EXEC spALTER_TABLE 'WebVenta', 'Opciones', 'varchar(50)  NULL'
GO 

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

IF exists ( select * from sysobjects where id = object_id('dbo.spAppAvantiCarProducts') and type = 'P')
    drop procedure dbo.spAppAvantiCarProducts
GO
CREATE PROCEDURE spAppAvantiCarProducts
    @Cliente VARCHAR(20)
AS BEGIN
    SELECT
    cotizacion.idCotizacion,
    producto.idProducto,
    Art.Articulo,
    producto.Cantidad,
    Art.Unidad,
    Descripcion1 AS Descripcion,
    Art.Grupo,
    Art.Categoria,
    Art.Fabricante,
    Art.PrecioLista,
    Art.MonedaPrecio,
    Art.Impuesto1,
    producto.Opciones
    FROM cotizacion
    LEFT JOIN cotizacionproducto
    ON cotizacionproducto.idCotizacion = cotizacion.idCotizacion
    LEFT JOIN producto
    ON producto.idProducto = cotizacionproducto.idProducto
    LEFT JOIN Art
      ON Art.Articulo = producto.SKU
    where
    cotizacion.Actual = 1
    AND cotizacion.Cliente  =  @Cliente
  RETURN
END
GO

IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spAppAvantiCarrito') AND type = 'P') DROP PROCEDURE spAppAvantiCarrito
GO
CREATE PROCEDURE spAppAvantiCarrito
  @Cliente VARCHAR(10),
  @ID INT OUTPUT
AS
BEGIN
  SELECT @ID = idCotizacion FROM cotizacion WHERE Cliente = @Cliente AND Actual = 1
  IF @ID IS NULL
  BEGIN
    BEGIN TRANSACTION trCotizacion

    BEGIN TRY
      INSERT INTO cotizacion (Cliente, Fecha, Actual) VALUES (@Cliente, GETDATE(), 1);
      COMMIT TRANSACTION trCotizacion;
      SET @ID = @@IDENTITY
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trCotizacion
    END CATCH
  END
END
GO

IF EXISTS(SELECT * FROM sysobjects WHERE id = object_id('dbo.spAppAvantiAddProducto') AND type = 'P') DROP PROCEDURE spAppAvantiAddProducto
GO
CREATE PROCEDURE spAppAvantiAddProducto
  @Cliente VARCHAR(20),
  @Articulo VARCHAR(50),
  @Precio FLOAT(8),
  @Cantidad INT,
  @Opciones VARCHAR(100) = NULL
AS
BEGIN
  DECLARE
    @IDCotizacion INT,
    @IDProducto INT,
    @OkRef VARCHAR(255)

  EXEC spAppAvantiCarrito @Cliente, @IDCotizacion OUTPUT

  IF @Cliente IS NULL SET @OkRef = 'Falta configurar el cliente'
  ELSE IF @IDCotizacion IS NULL SET @OkRef = 'Error al crear la cotización'

  IF @OkRef IS NULL
  BEGIN
    SELECT @IDProducto = producto.idProducto
    FROM cotizacion
    JOIN cotizacionproducto
      ON cotizacionproducto.idCotizacion = cotizacion.idCotizacion
    JOIN producto
      ON producto.idProducto = cotizacionproducto.idProducto
    WHERE
      cotizacion.idCotizacion = @IDCotizacion
      AND producto.SKU = @Articulo
      AND producto.Precio = @Precio
       AND ISNULL(producto.Opciones,'') LIKE ISNULL(@Opciones, '%')

    BEGIN TRANSACTION trAddProduct

    BEGIN TRY
      IF @IDProducto IS NULL
      BEGIN
        INSERT INTO producto (SKU, Precio, Cantidad, Opciones) VALUES (@Articulo, @Precio, @Cantidad, @Opciones)
        SET @IDProducto = @@IDENTITY
        INSERT INTO cotizacionproducto (idCotizacion, idProducto) VALUES (@IDCotizacion, @IDProducto)
      END
      ELSE
      BEGIN
        UPDATE producto SET Cantidad = @Cantidad WHERE idProducto = @IDProducto
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

--/****** WebVenta ******/
--if not exists(select * from SysTabla where SysTabla = 'WebVenta')
--INSERT INTO SysTabla (SysTabla,Tipo) VALUES ('WebVenta','Movimiento')
--if exists (select * from sysobjects where id = object_id('dbo.WebVenta') and type = 'U')  DROP TABLE dbo.WebVenta
--CREATE TABLE dbo.WebVenta (
--  WebUsuario     varchar(20)        NOT NULL, 
--  ID             int  IDENTITY(1,1) NOT NULL,
--  Articulo   varchar(30)  NULL,
--  Precio     money        NULL, 
--  Cantidad   float        NULL, 
--  Nombre     varchar(100) NULL, 
--  Telefono   varchar(50)  NULL,
--  EMail      varchar(50)  NULL,
--CONSTRAINT priWebVenta PRIMARY KEY CLUSTERED (WebUsuario, ID)
--)
--GO

if exists ( select * from sysobjects where id = object_id('dbo.spWebVentaD') and type = 'P')
    drop procedure dbo.spWebVentaD
GO
CREATE PROCEDURE spWebVentaD
  @UsuarioWeb  varchar(20), 
  @ID      int,
  @Empresa     char(5),
  @Sucursal    int, 
  @Almacen     varchar(10), 
  @Cliente     varchar(10), 
  @ListaPrecios  varchar(50), 
  @Moneda      varchar(10), 
  @TipoCambio  float, 
  @Nombre      varchar(100), 
  @Telefono    varchar(50), 
  @Email       varchar(50), 
  @Ok          int OUTPUT, 
  @OkRef       varchar(255) OUTPUT
AS BEGIN
  DECLARE
    @Renglon    float,
    @MovTipo    varchar(20),
    @Cantidad   float, 
    @Costo      money,     
    @RenglonID    int, 
    @Articulo     varchar(20), 
    @RenglonTipo  char(1),
    @ArtTipo    varchar(20), 
    @Unidad       varchar(50), 
    @Precio          money,
    @Impuesto1                  float,
    @Impuesto2                  float,
    @Impuesto3                  money,
    @ZonaImpuesto   varchar(30),
    @Opciones varchar(50)
    
  
   SELECT @ZonaImpuesto = ZonaImpuesto FROM Cte WHERE Cliente = @Cliente   
    
  SELECT @Renglon = 0.0, @RenglonID = 0.00

  DECLARE crVentaD CURSOR FOR  
    SELECT WebVenta.Articulo, SUM(ISNULL(WebVenta.Cantidad,0.00)), Art.Tipo, Art.Unidad, Art.Impuesto1, Art.Impuesto2, Art.Impuesto3, WebVenta.Opciones
     FROM WebVenta
     LEFT OUTER JOIN Art ON  WebVenta.Articulo = Art.Articulo
    WHERE WebVenta.WebUsuario = @UsuarioWeb 
    --AND WebVenta.Agente = @Agente 
    --AND WebVenta.Nombre = @Nombre
    --AND WebVenta.Telefono =  @Telefono
    --AND WebVenta.EMail =  @Email
   GROUP BY WebVenta.Articulo, Art.Tipo, Art.Unidad, Art.Impuesto1, Art.Impuesto2, Art.Impuesto3, WebVenta.Opciones
  OPEN crVentaD
  FETCH NEXT FROM crVentaD INTO @Articulo, @Cantidad, @ArtTipo, @Unidad, @Impuesto1 , @Impuesto2, @Impuesto3, @Opciones
  WHILE @@FETCH_STATUS <> -1
  BEGIN
    IF @@FETCH_STATUS <> -2 
    BEGIN

      SELECT @Renglon = @Renglon + 2048.0, @RenglonID = @RenglonID + 1 
      
          EXEC spRenglonTipo @ArtTipo, NULL, @RenglonTipo OUTPUT             
          EXEC spZonaImp @ZonaImpuesto, @Impuesto1 OUTPUT
          EXEC spZonaImp @ZonaImpuesto, @Impuesto2 OUTPUT
          EXEC spZonaImp @ZonaImpuesto, @Impuesto3 OUTPUT            
           
          SELECT @Renglon = @Renglon + 2048.0, @RenglonID = @RenglonID + 1
          EXEC spPrecioEsp @ListaPrecios, @Moneda, @Articulo, NULL, @Precio OUTPUT

      EXEC spPCGet @Sucursal, @Empresa, @Articulo, NULL, @Unidad, @Moneda, @TipoCambio, @ListaPrecios, @Precio OUTPUT
                
    INSERT VentaD  ( ID,  Renglon,  RenglonSub,  RenglonID,  RenglonTipo,  Impuesto1,  Impuesto2,  Impuesto3,  Almacen,  Articulo,  SubCuenta,  Cantidad,  Unidad,  CantidadInventario,  FechaRequerida,  Precio)
            VALUES (@ID, @Renglon,           0, @RenglonID, @RenglonTipo, @Impuesto1, @Impuesto2, @Impuesto3, @Almacen, @Articulo, @Opciones, @Cantidad, @Unidad,           @Cantidad,       GETDATE(), @Precio) 
    END
    FETCH NEXT FROM crVentaD INTO @Articulo, @Cantidad, @ArtTipo, @Unidad, @Impuesto1 , @Impuesto2, @Impuesto3, @Opciones
  END  
  CLOSE crVentaD
  DEALLOCATE crVentaD  
  RETURN
END
GO

if exists ( select * from sysobjects where id = object_id('dbo.spWebUsuario') and type = 'P')
    drop procedure dbo.spWebUsuario
GO
CREATE PROCEDURE spWebUsuario
    @UsuarioWeb     varchar(20), 
    @Empresa    char(5)     OUTPUT,
    @Sucursal   int         OUTPUT, 
    @Usuario    varchar(10) OUTPUT,  
    @Cliente    varchar(10) OUTPUT,
    @Proyecto   varchar(50) OUTPUT, 
    @Proveedor  varchar(10) OUTPUT,  
    @Ubicacion  varchar(50) OUTPUT, 
    @Personal   varchar(10) OUTPUT 
    --@Agente     varchar(10) OUTPUT
AS BEGIN
   SELECT 
    @Empresa   = LTRIM(RTRIM(Empresa)),    
    @Sucursal  = Sucursal,                 
    @Usuario   = LTRIM(RTRIM(Usuario)),  
    @Cliente   = LTRIM(RTRIM(Cliente)), 
    @Proyecto  = LTRIM(RTRIM(Proyecto)),  
    @Proveedor = LTRIM(RTRIM(Proveedor)), 
    --@Ubicacion = LTRIM(RTRIM(Ubicacion)), 
    @Personal  = LTRIM(RTRIM(Personal))
    --@Agente    = LTRIM(RTRIM(Agente))      
     FROM WebUsuario
    WHERE UsuarioWeb =  @UsuarioWeb
END 
RETURN
GO

if exists (select * from sysobjects where id = object_id('dbo.spWebVenta') and type = 'P') drop procedure dbo.spWebVenta
GO
CREATE PROCEDURE spWebVenta
  @UsuarioWeb     varchar(20),  
  @Movimiento     varchar(50)  OUTPUT, 
  @OkRef          varchar(255) OUTPUT 
AS BEGIN
DECLARE 
  @Empresa    char(5),
  @Sucursal   int,  
  @Usuario    varchar(10), 
  @Ok         int ,
  @Tab      char(2), 
  @ID         int, 
  @Modulo     char(5), 
  @Mov        varchar(20), 
  @Concepto   varchar(50), 
  @Cliente    varchar(10), 
  @Proyecto   varchar(50), 
  @Proveedor  varchar(10), 
  @Ubicacion  varchar(50), 
  @Personal   varchar(10),
 
  ---@Agente     varchar(10), 
  @Almacen    varchar(10),
  @Moneda      varchar(10),  
  @TipoCambio  float, 
  @Renglon      int,
  @RenglonID    int, 
  @Articulo     varchar(20), 
  @Precio       money, 
  @ListaPreciosEsp varchar(50), 
  @Nombre   varchar(100), 
  @Telefono        varchar(50), 
  @Email           varchar(50), 
  @FechaTrabajo    datetime
  SELECT @Tab = CHAR(13), @Modulo = 'VTAS', @Movimiento = NULL, @FechaTrabajo = dbo.fnFechaSinHora(GETDATE())
  EXEC spWebUsuario @UsuarioWeb, @Empresa OUTPUT, @Sucursal OUTPUT,  @Usuario OUTPUT,  @Cliente OUTPUT, @Proyecto OUTPUT,  @Proveedor OUTPUT,  @Ubicacion OUTPUT, @Personal OUTPUT
  SELECT  @Mov = RTRIM(LTRIM(VentaCotizacion))   FROM EmpresaCfgMovWeb  WHERE Empresa = @Empresa
  SELECT @Almacen = AlmacenPrincipal             FROM Sucursal WHERE Sucursal = @Sucursal      
  SELECT @Articulo = MIN(WebVenta.Articulo) FROM WebVenta LEFT OUTER JOIN Art ON  WebVenta.Articulo = Art.Articulo WHERE WebVenta.WebUsuario = @UsuarioWeb AND Art.Articulo IS NULL
 
  SAVE TRANSACTION trWebVenta
   IF NOT EXISTS (SELECT * FROM WebVenta WHERE WebVenta.WebUsuario = @UsuarioWeb)  SELECT @Ok = 60010       ELSE
   IF NULLIF(RTRIM(@Empresa), '')   IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar la Empresa'      ELSE
   IF NULLIF(RTRIM(@Sucursal), '')  IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar la Sucursal'     ELSE  
   IF NULLIF(RTRIM(@Usuario), '')   IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar El Usuario'      ELSE
   IF NULLIF(RTRIM(@Cliente), '')   IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar El Cliente'      ELSE 
   IF NULLIF(RTRIM(@Mov), '')       IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar El Movimiento'   ELSE 
   IF NULLIF(RTRIM(@Almacen), '')   IS NULL SELECT @Ok = 10060, @OkRef = 'Falta Configurar El Almacen'      ELSE 
   IF NULLIF(RTRIM(@Articulo), '')  IS NOT NULL SELECT @Ok = 72040, @OkRef = 'Articulo: '+@Articulo
  SELECT @Moneda = EmpresaCfg.ContMoneda, @TipoCambio = Mon.TipoCambio FROM EmpresaCfg JOIN Mon ON  EmpresaCfg. ContMoneda = Mon.Moneda  WHERE EmpresaCfg.Empresa = @Empresa 
  SELECT @Concepto = EmpresaConcepto.Concepto FROM EmpresaConcepto  WHERE EmpresaConcepto.Modulo = @Modulo AND EmpresaConcepto.Mov = @Mov
  IF @Ok IS NULL 
  BEGIN

     DECLARE crWebVenta CURSOR FOR     
     SELECT RTRIM(LTRIM(WebVenta.Nombre)), RTRIM(LTRIM(WebVenta.Telefono)), RTRIM(LTRIM(WebVenta.Email))
     FROM WebVenta
      WHERE WebVenta.WebUsuario = @UsuarioWeb   
      GROUP BY RTRIM(LTRIM(WebVenta.Nombre)), RTRIM(LTRIM(WebVenta.Telefono)), RTRIM(LTRIM(WebVenta.Email))
      OPEN crWebVenta    
      FETCH NEXT FROM crWebVenta INTO @Nombre, @Telefono, @Email
      WHILE @@FETCH_STATUS <> -1    
      BEGIN    
        IF @@FETCH_STATUS <> -2     
       
 BEGIN  
     INSERT INTO Venta (Empresa,  Mov,  Concepto,  Moneda,  TipoCambio,  FechaEmision,      Estatus,  Cliente,  Sucursal, Proyecto,  Usuario,  Almacen, Condicion,   Vencimiento,  ListaPreciosEsp, Atencion, AtencionTelefono) VALUES
               
         (@Empresa, @Mov, @Concepto, @Moneda, @TipoCambio, @FechaTrabajo, 'SINAFECTAR', @Cliente, @Sucursal,     NULL, @Usuario, @Almacen, '(Fecha)', @FechaTrabajo, '(Precio Lista)', @Nombre, @Telefono)
  --        (@Empresa, @Mov, @Concepto, @Moneda, @TipoCambio, @FechaTrabajo, 'SINAFECTAR', @Cliente,     2,     NULL,      @Usuario, 'RFLORES',     'INS', '(Fecha)', @FechaTrabajo, '(Precio Lista)', @Nombre, @Telefono)
 SELECT @ID = SCOPE_IDENTITY()    
      
         EXEC spWebVentaD  @UsuarioWeb, @ID, @Empresa, @Sucursal, @Almacen, @Cliente, '(Precio Lista)', @Moneda, @TipoCambio, @Nombre, @Telefono, @Email, @Ok OUTPUT, @OkRef OUTPUT
        IF @ID IS NOT NULL
        BEGIN 
          EXEC spAfectar @Modulo, @ID, 'AFECTAR', 'Todo', NULL, @Usuario, @EnSilencio = 1, @Ok = @Ok OUTPUT, @OkRef = @OkRef OUTPUT
   
          SELECT  @Movimiento = @Mov+' '+ISNULL(MovID, '')
          FROM Venta
           WHERE ID = @ID
          END               
        END    
        FETCH NEXT FROM crWebVenta INTO @Nombre, @Telefono, @Email 
      END    
      CLOSE crWebVenta
      DEALLOCATE crWebVenta 
  END
  IF @Ok IS NULL DELETE WebVenta WHERE WebVenta.WebUsuario = @UsuarioWeb  
  IF @Ok IS NULL
  BEGIN 
    SELECT @OkRef = 'Ok'
  IF @@TRANCOUNT > 0
    COMMIT TRANSACTION trWebVenta
  
  END 
  ELSE
  BEGIN
  IF @@TRANCOUNT > 0
  ROLLBACK TRANSACTION trWebVenta
  END
  
  SELECT @OkRef = RTRIM(Descripcion)+@Tab+ ISNULL(RTRIM(@OkRef), '') FROM MensajeLista WHERE Mensaje = @Ok
END
GO

if exists (select * from sysobjects where id = object_id('dbo.spAppTecsoPutOrder') and type = 'P')
  DROP procedure dbo.spAppTecsoPutOrder
GO
CREATE PROCEDURE spAppTecsoPutOrder
  @UsuarioWeb varchar(20),
  @ID int
AS
BEGIN
  DECLARE
    @Message varchar(200),
    @Telefono varchar(100),
    @Email varchar(50),
    @Nombre varchar(100),
    @sql nvarchar(4000),
    @listaC varchar(20),
    @Movimiento  varchar(50),
    @Cliente varchar(10),
    @OkRef       varchar(255)

  DECLARE @products TABLE (idProducto int)

  SET @OkRef = NULL;

  BEGIN TRANSACTION trPedido

  BEGIN TRY
      SELECT @Cliente = Cliente FROM WebUsuario WHERE UsuarioWeb = @UsuarioWeb
      SELECT @Telefono = Cte.Telefonos, @Email = Cte.eMail1, @Nombre = Cte.Nombre FROM Cte WHERE Cte.Cliente =  @Cliente

      set @sql = 'INSERT INTO WebVenta (WebUsuario, Articulo, Precio, Cantidad, Nombre, Telefono, Email, Opciones)
      SELECT @UsuarioWeb AS UsuarioWeb, Art.Articulo, Art.PrecioLista AS Precio, producto.Cantidad, @Nombre AS Nombre, @Telefono AS Telefono, @Email AS Email, producto.Opciones
      FROM cotizacionproducto
      JOIN producto
      ON producto.idProducto = cotizacionproducto.idProducto
      JOIN Art
      ON art.Articulo = producto.SKU
      WHERE
      cotizacionproducto.idCotizacion = @ID'

      EXECUTE sp_executesql @sql, N'@UsuarioWeb varchar(20), @Nombre varchar(100), @Telefono varchar(100), @Email varchar(50), @ID int', @UsuarioWeb = @UsuarioWeb, @Nombre = @Nombre, @Telefono = @Telefono, @Email = @Email, @ID = @ID
      EXEC spWebVenta @UsuarioWeb, @Movimiento OUTPUT,  @OkRef OUTPUT
      INSERT INTO @products (idProducto) SELECT idProducto from cotizacionproducto WHERE cotizacionproducto.idCotizacion = @ID
      DELETE cotizacionproducto WHERE cotizacionproducto.idCotizacion = @ID
      DELETE po FROM producto po
      JOIN @products pold
        ON pold.idProducto = po.idProducto
      DELETE cotizacion WHERE cotizacion.idCotizacion = @ID

    IF @@TRANCOUNT > 0
    COMMIT TRAN trPedido

      SELECT @OkRef AS Message
  END TRY
  BEGIN CATCH
    SET @OkRef = ERROR_MESSAGE()
    IF @@TRANCOUNT > 0
     ROLLBACK TRAN trPedido

    SELECT @OkRef AS Message
  END CATCH
END
GO

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

if exists (select * from sysobjects where id = object_id('dbo.spWebAvantiEmpresa') and type = 'P')
  DROP procedure dbo.spWebAvantiEmpresa
GO
CREATE PROCEDURE spWebAvantiEmpresa
  @Usuario varchar(10)
AS BEGIN
  SELECT Empresa
  FROM WebUsuario
  WHERE UsuarioWeb = @Usuario
RETURN
END
GO

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

if exists (select * from sysobjects where id = object_id('dbo.spWebClienteExpress') and type = 'P')
  DROP procedure dbo.spWebClienteExpress
GO
CREATE PROCEDURE spWebClienteExpress
  @WebUsuario varchar(20),
  @Nombre     varchar(100),
  @Telefono   varchar(50),
  @RFC        varchar(30) NULL
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

if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiDelProducto') and type = 'P')
  DROP procedure dbo.spAppAvantiDelProducto
GO
CREATE PROCEDURE spAppAvantiDelProducto
  @IDCotizacion int,
  @IDproducto int
AS BEGIN
  DECLARE
    @Articulos int,
    @OkRef VARCHAR(255)
  
  SET @OkRef = 'Ok'
  IF EXISTS(SELECT * FROM cotizacion WHERE cotizacion.idCotizacion = @IDCotizacion)
  BEGIN
    SELECT @Articulos = COUNT(cotizacionproducto.idProducto)
    FROM cotizacionproducto
    WHERE idCotizacion = @IDCotizacion
    IF @Articulos > 0
    BEGIN
      BEGIN TRANSACTION trDelProduct
        BEGIN TRY
          IF @Articulos = 1
          BEGIN
            DELETE cotizacionproducto
            WHERE
              cotizacionproducto.idCotizacion = @IDCotizacion
              AND cotizacionproducto.idProducto = @IDproducto

            DELETE producto WHERE idProducto = @IDproducto
            DELETE cotizacion WHERE idCotizacion = @IDCotizacion
          END
          ELSE
          BEGIN
            DELETE cotizacionproducto
            WHERE cotizacionproducto.idCotizacion = @IDCotizacion
              AND cotizacionproducto.idProducto = @IDproducto

            DELETE producto
            WHERE idProducto = @IDproducto
          END

          COMMIT TRANSACTION trDelProduct
        END TRY
        BEGIN CATCH
          IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION trDelProduct
          SET @OkRef = ERROR_MESSAGE()
        END CATCH
      END
    END
  SELECT @OkRef AS [Message]
END
GO

if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiDelCotizacion') and type = 'P')
  DROP procedure dbo.spAppAvantiDelCotizacion
GO
CREATE PROCEDURE spAppAvantiDelCotizacion
  @IDCotizacion int
AS BEGIN
  DECLARE @Productos TABLE(idProducto int)
  DECLARE @OkRef VARCHAR(255)

  SET @OkRef = 'Ok'
  IF EXISTS(SELECT * FROM cotizacion WHERE cotizacion.idCotizacion = @IDCotizacion)
  BEGIN
    BEGIN TRANSACTION trDelCotizacion

    BEGIN TRY
      INSERT INTO @Productos (idProducto)
      SELECT cotizacionproducto.idProducto
      FROM cotizacionproducto
      WHERE cotizacionproducto.idCotizacion = @IDCotizacion

      DELETE cotizacionproducto WHERE cotizacionproducto.idCotizacion = @IDCotizacion
      DELETE cotizacion WHERE idCotizacion = @IDCotizacion
      DELETE p FROM producto p JOIN @Productos ptmp ON ptmp.idProducto = p.idProducto

      COMMIT TRANSACTION trDelCotizacion
    END TRY
    BEGIN CATCH
      IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION trDelCotizacion SET @OkRef = ERROR_MESSAGE()
    END CATCH
  END
  SELECT @OkRef AS [Message]
END
GO

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

if exists (select * from sysobjects where id = object_id('dbo.spAppAvantiActualizarProducto') and type = 'P')
  DROP procedure dbo.spAppAvantiActualizarProducto
GO
CREATE PROCEDURE spAppAvantiActualizarProducto
  @IDProducto INT,
  @Cantidad INT
AS
BEGIN
  DECLARE
    @Ok INT,
    @OkRef VARCHAR(255)

  SET @OkRef = 'Producto no encontrado'
  IF EXISTS(SELECT * FROM producto WHERE idProducto = @IDProducto)
  BEGIN
    BEGIN TRANSACTION trUpdateProducto
    BEGIN TRY
      UPDATE producto SET Cantidad = @Cantidad WHERE idProducto = @IDProducto
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




/**************** spWebPoliticaPreciosCalc ****************/
IF EXISTS (SELECT * FROM SysObjects WHERE id = object_id('dbo.spWebPoliticaPreciosCalc') AND type = 'P') DROP PROCEDURE dbo.spWebPoliticaPreciosCalc
GO             
CREATE PROCEDURE spWebPoliticaPreciosCalc
         @FechaEmision  DateTime, 
         @Articulo    varchar(20),
       @vCondicion     varchar(50), 
         @Precio    float   OUTPUT,
         @Descuento   float   OUTPUT,
         @Politica    varchar(MAX)  = NULL  OUTPUT,
         @DescuentoMonto  float   = NULL OUTPUT
AS BEGIN
  DECLARE @ArtCat   varchar(50),
    @ArtGrupo   varchar(50),
    @ArtFam   varchar(50),
    @ArtModelo    varchar(50),
    @Fabricante   varchar(50),
    @ArtLinea   varchar(50),
    @ArtRama    varchar(20),
    
    @CteGrupo   varchar(50),
    @CteCat   varchar(50),
    @CteFam   varchar(50),
    @CteZona    varchar(30),
    
    @Tipo     varchar(50),
    @Nivel    varchar(50),
    @NivelPolitica  varchar(50),
    @Costo    money,
    @TipoCosteo   varchar(20),
    @PrecioLista    money, 
    @Precio2    money,
    @Precio3    money,
    @Precio4    money,
    @Precio5    money,
    @Precio6    money,
    @Precio7    money,
    @Precio8    money,
    @Precio9    money,
    @Precio10   money,
    
      @DescuentoAcum        float,
      @Ponderado          float,
      @CalcDescuento        float,
      
      @PrecioAcum         float,
      @PrecioTemp         float,
      @Descripcion          varchar(50),
      @ConVigencia          bit,
      @FechaD           datetime,
      @FechaA           datetime,
      @PromocionExclusiva     bit,    --PROMOCIONEXCLUSIVA      
      @CalcDescuentoExclusivo   float,  --PROMOCIONEXCLUSIVA      
      @DescuentoExclusivo     float,  --PROMOCIONEXCLUSIVA      
      @PonderadoExclusivo     float,  --PROMOCIONEXCLUSIVA      
      @PromocionPromocion     bit,    --PROMOCIONPROMOCION      
      @CalcDescuentoPromocion   float,  --PROMOCIONPROMOCION      
      @DescuentoPromocion     float,  --PROMOCIONPROMOCION      
      @PonderadoPromocion     float,  --PROMOCIONPROMOCION      
      @PromocionParticular      bit,    --PROMOCIONPARTICULAR      
      @CalcDescuentoParticular    float,  --PROMOCIONPARTICULAR      
      @DescuentoParticular      float,  --PROMOCIONPARTICULAR      
      @PonderadoParticular      float,   --PROMOCIONPARTICULAR      
      @PromocionExclusivaAplicada bit,    --APLICARSOLOUNAPROMOCION
      @PromocionPromocionAplicada bit,    --APLICARSOLOUNAPROMOCION
      @PromocionParticularAplicada  bit,    --APLICARSOLOUNAPROMOCION

             @Cliente   varchar(10),
                 @UnidadVenta varchar(50),  
         @Cantidad    float,
           @Agente    varchar(10),
               @Moneda    varchar(10), 
               @TipoCambio  float,
               @Condicion   varchar(50),
         @Almacen   varchar(10),
         @Proyecto    varchar(50),
         @FormaEnvio  varchar(50),
         @Mov   varchar(20),
         @ServicioTipo  varchar(50),
         @ContratoTipo  varchar(50),
         @Empresa   varchar(50),
         @Region    varchar(50),
         @Sucursal    int,
         @ListaPreciosEsp varchar(20),
               @Subcuenta   varchar(50)
      

  SET @PromocionExclusiva  = 0  --PROMOCIONEXCLUSIVA      
  SET @PromocionPromocion  = 0  --PROMOCIONPROMOCION
  SET @PromocionParticular = 0  --PROMOCIONPARTICULAR

  SET @PromocionExclusivaAplicada = 0   --APLICARSOLOUNAPROMOCION
  SET @PromocionPromocionAplicada = 0   --APLICARSOLOUNAPROMOCION
  SET @PromocionParticularAplicada = 0  --APLICARSOLOUNAPROMOCION
       
  --Obtiene la información del articulo         
  SELECT @ArtCat  = a.Categoria,
   @ArtGrupo = a.Grupo,
   @ArtFam = a.Familia,
   @ArtModelo = a.Modelo,
   @Fabricante = a.Fabricante,
   @ArtLinea = a.Linea,
   @ArtRama = a.Rama,
   @PrecioLista = a.PrecioLista,
   @Precio2 = a.Precio2,
   @Precio3 = a.Precio3,
   @Precio4 = a.Precio4,
   @Precio5 = a.Precio5,
   @Precio6 = a.Precio6,
   @Precio7 = a.Precio7,
   @Precio8 = a.Precio8,
   @Precio9 = a.Precio9,
   @Precio10 = a.Precio10
    FROM Art a 
   WHERE a.Articulo = @Articulo



   SELECT @Cantidad = 1
   
   --Obtiene los agrupadores del cliente
   SELECT @CteGrupo = c.Grupo,
    @CteCat   = c.Categoria,
    @CteFam   = c.Familia,
    @CteZona  = c.Zona
     FROM Cte c
    WHERE c.Cliente = @Cliente
    
   --Obtiene el tipo de costeo
   SELECT @TipoCosteo = TipoCosteo 
     FROM EmpresaCfg ec 
    WHERE ec.Empresa = @Empresa
   
  --Obtiene el precio del articulo utilizando el PCGET
  EXEC spPCGet @Sucursal, @Empresa, @Articulo, @SubCuenta, @UnidadVenta, @Moneda, @TipoCambio, @ListaPreciosEsp, @PrecioTemp OUTPUT
  
   -- Calcular Descuento en Monto
    SELECT @DescuentoMonto =  SUM(pd.Monto)
      FROM Precio p
     INNER JOIN PrecioD pd ON p.ID = pd.ID AND @Cantidad >= pd.Cantidad                                                    
     WHERE ((ISNULL(p.ConVigencia,0) = 0) OR (@FechaEmision BETWEEN p.FechaD AND p.FechaA)) --Verifica la vigencia
       --Condiciones de Propiedades de Articulo 
       AND ((ISNULL(p.NivelArticulo,0) = 0) OR (p.Articulo = @Articulo)) --Verifica que la politica sea para el articulo
       AND ((ISNULL(p.NivelSubCuenta,0) = 0) OR (p.SubCuenta = @Subcuenta)) --Verifica que la politica sea para la opcion determinada
       AND ((ISNULL(p.NivelUnidadVenta,0) = 0) OR (p.UnidadVenta = @UnidadVenta)) --Verifica que la politica sea para la unidad de venta especifica 
       AND ((ISNULL(p.NivelArtCat,0) = 0) OR (p.ArtCat = @ArtCat)) --Verifica que la politica sea para la categoria de articulo especifica
       AND ((ISNULL(p.NivelArtGrupo,0) = 0) OR (p.ArtGrupo = @ArtGrupo)) --Verifica que la politica sea para el grupo de articulo especifico
       AND ((ISNULL(p.NivelArtFam,0) = 0) OR (p.ArtFam = @ArtFam)) --Verifica que la politica sea para la familia de articulo especifica
       AND ((ISNULL(p.NivelArtModelo,0) = 0) OR (p.Modelo = @ArtModelo)) --Verifica que la politica sea para el nivel de ABC de articulo especifico
       AND ((ISNULL(p.NivelFabricante,0) = 0) OR (p.Fabricante = @Fabricante)) --Verifica que la politica sea para el fabricante especifico
       AND ((ISNULL(p.NivelArtLinea,0) = 0) OR (p.ArtLinea = @ArtLinea)) --Verifica que la politica sea para la linea de articulo especifica 
       AND ((ISNULL(p.NivelArtRama,0) = 0) OR (p.ArtRama = @ArtRama)) --Verifica que la politica sea para la rama especifica
       --Condiciones de Propiedades de Clientes
       AND ((ISNULL(p.NivelCliente,0) = 0) OR (p.Cliente = @Cliente)) --Verifica el cliente   
       AND ((ISNULL(p.NivelCteGrupo,0) = 0) OR (p.CteGrupo = @CteGrupo))  --Verifica el grupo del cliente   
       AND ((ISNULL(p.NivelCteCat,0) = 0) OR (p.CteCat = @CteCat)) --Verifica la categoria del cliente   
       AND ((ISNULL(p.NivelCteFam,0) = 0) OR (p.CteFam = @CteFam)) --Verifica la familia del cliente   
       AND ((ISNULL(p.NivelCteZona,0) = 0) OR (p.CteZona = @CteZona)) --Verifica la zona del cliente   
        --Condiciones de Propiedades de la Factura
       AND ((ISNULL(p.NivelAgente,0) = 0) OR (p.Agente = @Agente)) --Verifica el agente   
       AND ((ISNULL(p.NivelMoneda,0) = 0) OR (p.Moneda = @Moneda)) --Verifica la moneda
       AND ((ISNULL(p.NivelCondicion,0) = 0) OR (p.Condicion = @Condicion)) --Verifica la condicion de pago
       AND ((ISNULL(p.NivelAlmacen,0) = 0) OR (p.Almacen = @Almacen)) --Verifica el almacen
       AND ((ISNULL(p.NivelProyecto,0) = 0) OR (p.Proyecto = @Proyecto)) --Verifica el proyecto
       AND ((ISNULL(p.NivelFormaEnvio,0) = 0) OR (p.FormaEnvio = @FormaEnvio)) --Verifica la forma de envio
       AND ((ISNULL(p.NivelMov,0) = 0) OR (p.Mov = @Mov)) --Verifica el movimiento
       AND ((ISNULL(p.NivelServicioTipo,0) = 0) OR (p.ServicioTipo = @ServicioTipo)) --Verifica el servicio
       AND ((ISNULL(p.NivelContratoTipo,0) = 0) OR (p.ContratoTipo = @ContratoTipo)) --Verifica el contrato
       AND ((ISNULL(p.NivelEmpresa,0) = 0) OR (p.Empresa = @Empresa)) --Verifica la empresa
       AND ((ISNULL(p.NivelRegion,0) = 0) OR (p.Region = @Region)) --Verifica el renglon
       AND ((ISNULL(p.NivelSucursal,0) = 0) OR (p.Sucursal = @Sucursal)) --Verifica la sucursal          
       AND ((ISNULL(p.ListaPrecios,'Todas') = 'Todas') OR (p.ListaPrecios = @ListaPreciosEsp)) --Verifica las listas de precios
       AND p.Tipo LIKE '$ Descuento%' --Valida que las politicas se expresen en monto
       AND p.Estatus = 'ACTIVA' --Valida que la politica este activa
       AND pd.Cantidad = (SELECT MAX(Cantidad) 
                            FROM PrecioD pd2 
                           WHERE p.ID = pd2.ID
                             AND @Cantidad >= pd2.Cantidad) --Solo obtiene las partidas de la politica donde la cantidad sea menor o igual a la cantidad vendida

   -- Calcular Descuento en Porcentaje
   DECLARE crDescto CURSOR LOCAL FOR 
   
    SELECT dbo.fnWebPoliticaDescuento(pd.ID, pd.Cantidad, @vCondicion, pd.Monto), 
     p.Nivel,
     p.Descripcion,
     p.FechaD,
     p.FechaA,
     p.ConVigencia
      FROM Precio p
     INNER JOIN PrecioD pd ON p.ID = pd.ID
                          AND @Cantidad >= pd.Cantidad                          
     WHERE ((ISNULL(p.ConVigencia,0) = 0) OR (@FechaEmision BETWEEN p.FechaD AND p.FechaA))
       --Condiciones de Propiedades de Articulo 
       AND ((ISNULL(p.NivelArticulo,0) = 0) OR (p.Articulo = @Articulo)) 
       AND ((ISNULL(p.NivelSubCuenta,0) = 0) OR (p.SubCuenta = @Subcuenta)) 
       AND ((ISNULL(p.NivelUnidadVenta,0) = 0) OR (p.UnidadVenta = @UnidadVenta)) 
       AND ((ISNULL(p.NivelArtCat,0) = 0) OR (p.ArtCat = @ArtCat))
       AND ((ISNULL(p.NivelArtGrupo,0) = 0) OR (p.ArtGrupo = @ArtGrupo)) 
       AND ((ISNULL(p.NivelArtFam,0) = 0) OR (p.ArtFam = @ArtFam))
       AND ((ISNULL(p.NivelArtModelo,0) = 0) OR (p.Modelo = @ArtModelo))  
       AND ((ISNULL(p.NivelFabricante,0) = 0) OR (p.Fabricante = @Fabricante))
       AND ((ISNULL(p.NivelArtLinea,0) = 0) OR (p.ArtLinea = @ArtLinea)) 
       AND ((ISNULL(p.NivelArtRama,0) = 0) OR (p.ArtRama = @ArtRama))
       --Condiciones de Propiedades de Clientes
       AND ((ISNULL(p.NivelCliente,0) = 0) OR (p.Cliente = @Cliente))
       AND ((ISNULL(p.NivelCteGrupo,0) = 0) OR (p.CteGrupo = @CteGrupo))
       AND ((ISNULL(p.NivelCteCat,0) = 0) OR (p.CteCat = @CteCat))
       AND ((ISNULL(p.NivelCteFam,0) = 0) OR (p.CteFam = @CteFam))
       AND ((ISNULL(p.NivelCteZona,0) = 0) OR (p.CteZona = @CteZona))
        --Condiciones de Propiedades de la Factura
       AND ((ISNULL(p.NivelAgente,0) = 0) OR (p.Agente = @Agente))
       AND ((ISNULL(p.NivelMoneda,0) = 0) OR (p.Moneda = @Moneda))
       AND ((ISNULL(p.NivelCondicion,0) = 0) OR (p.Condicion = @Condicion))
       AND ((ISNULL(p.NivelAlmacen,0) = 0) OR (p.Almacen = @Almacen))
       AND ((ISNULL(p.NivelProyecto,0) = 0) OR (p.Proyecto = @Proyecto))
       AND ((ISNULL(p.NivelFormaEnvio,0) = 0) OR (p.FormaEnvio = @FormaEnvio))
       AND ((ISNULL(p.NivelMov,0) = 0) OR (p.Mov = @Mov))
       AND ((ISNULL(p.NivelServicioTipo,0) = 0) OR (p.ServicioTipo = @ServicioTipo))
       AND ((ISNULL(p.NivelContratoTipo,0) = 0) OR (p.ContratoTipo = @ContratoTipo))
       AND ((ISNULL(p.NivelEmpresa,0) = 0) OR (p.Empresa = @Empresa)) 
       AND ((ISNULL(p.NivelRegion,0) = 0) OR (p.Region = @Region))
       AND ((ISNULL(p.NivelSucursal,0) = 0) OR (p.Sucursal = @Sucursal))          
       AND ((ISNULL(p.ListaPrecios,'Todas') = 'Todas') OR (p.ListaPrecios = @ListaPreciosEsp))
       AND p.Tipo = '% Descuento'
       AND p.Estatus = 'ACTIVA'
       AND pd.Cantidad = (SELECT MAX(Cantidad) 
                            FROM PrecioD pd2 
                           WHERE p.ID = pd2.ID
                             AND @Cantidad >= pd2.Cantidad)
  OPEN crDescto
  FETCH NEXT FROM CrDescto INTO @DescuentoAcum, @Nivel, @Descripcion, @FechaD, @FechaA, @ConVigencia        
  
    
    --Si es promocion, particulo o Exclusiva regresa el primer descuento pero segun yo debería de estar ordenado de alguna forma
    --SET @PromocionExclusiva = 0 --PROMOCIONEXCLUSIVA
    IF @Nivel IN ('Exclusiva') --PROMOCION Se quito la tipo promoción de aqui.
    BEGIN
      SET @PromocionExclusivaAplicada = 1
      SET @PromocionExclusiva = 1 --PROMOCIONEXCLUSIVA
    END ELSE
    IF @Nivel IN ('Promocion') --PROMOCIONPROMOXION
    BEGIN
      SET @PromocionPromocionAplicada = 1
      SET @PromocionPromocion = 1 --PROMOCIONPROMOCION
    END ELSE
    IF @Nivel IN ('Particular') --PROMOCIONPARTICULAR
    BEGIN
      SET @PromocionParticularAplicada = 1
      SET @PromocionParticular = 1 --PROMOCIONPARTICULAR
    END  
     

  
    --Calcula el descuento y el complemento
    SELECT @Ponderado = 100
    SELECT @CalcDescuento = (@DescuentoAcum /100) * @Ponderado
    SELECT @Descuento = @CalcDescuento
    SELECT @Ponderado = @Ponderado - @CalcDescuento
    --SELECT @DescuentoAcum, @CalcDescuento, @Descuento

    --Calcula el descuento exclusivo y el complemento
    SELECT @PonderadoExclusivo = 100 --PROMOCIONEXCLUSIVA
    SELECT @CalcDescuentoExclusivo = (@DescuentoAcum /100) * @PonderadoExclusivo --PROMOCIONEXCLUSIVA
    SELECT @DescuentoExclusivo = @CalcDescuentoExclusivo --PROMOCIONEXCLUSIVA
    SELECT @PonderadoExclusivo = @PonderadoExclusivo - @CalcDescuentoExclusivo --PROMOCIONEXCLUSIVA

    --Calcula el descuento promocion y el complemento
    SELECT @PonderadoPromocion = 100 --PROMOCIONPROMOCION
    SELECT @CalcDescuentoPromocion = (@DescuentoAcum /100) * @PonderadoPromocion --PROMOCIONPROMOCION
    SELECT @DescuentoPromocion = @CalcDescuentoPromocion --PROMOCIONPROMOCION
    SELECT @PonderadoPromocion = @PonderadoPromocion - @CalcDescuentoPromocion --PROMOCIONPROMOCION

    --Calcula el descuento particular y el complemento
    SELECT @PonderadoParticular = 100 --PROMOCIONPARTICULAR
    SELECT @CalcDescuentoParticular = (@DescuentoAcum /100) * @PonderadoParticular --PROMOCIONPARTICULAR
    SELECT @DescuentoParticular = @CalcDescuentoParticular --PROMOCIONPARTICULAR
    SELECT @PonderadoParticular = @PonderadoParticular - @CalcDescuentoParticular --PROMOCIONPARTICULAR

  WHILE @@FETCH_STATUS = 0 
  BEGIN
    FETCH NEXT FROM CrDescto INTO @DescuentoAcum, @Nivel, @Descripcion, @FechaD, @FechaA, @ConVigencia
      IF @@FETCH_STATUS = 0
      BEGIN
        
     
        --IF @PromocionExclusiva = 0 OR @Nivel IN ('Siempre') --PROMOCIONEXCLUSIVA
        --BEGIN --PROMOCIONEXCLUSIVA 
          IF @Nivel IN ('Exclusiva') --PROMOCION Se quito la tipo promoción de aqui.
          BEGIN
            -- SELECT @Descuento = @DescuentoAcum --PROMOCIONEXCLUSIVA
            SET @PromocionExclusiva = 1 --PROMOCIONEXCLUSIVA
          END ELSE 
          IF @Nivel IN ('Promocion') --PROMOCIONPROMOCION
          BEGIN
            -- SELECT @Descuento = @DescuentoAcum --PROMOCIONEXCLUSIVA
            SET @PromocionPromocion = 1 --PROMOCIONPROMOCION
          END ELSE 
          IF @Nivel IN ('Particular') --PROMOCIONPARTICULAR
          BEGIN
            -- SELECT @Descuento = @DescuentoAcum --PROMOCIONPARTICULAR
            SET @PromocionParticular = 1 --PROMOCIONPARTICULAR
          END  

          --Suma los descuentos para que se puedan aplicar varias politicas al mismo tiempo.
          SELECT @CalcDescuento = (@DescuentoAcum /100) * @Ponderado    
          SELECT @Descuento = @Descuento + @CalcDescuento
          SELECT @Ponderado = @Ponderado - @CalcDescuento
          --Si es promocion, particulo o Exclusiva regresa el primer descuento pero segun yo debería de estar ordenado de alguna forma      

          --Calcula los descuentos exclusivos
          IF (@Nivel IN ('Siempre')) OR (@Nivel IN ('Exclusiva') AND @PromocionExclusivaAplicada = 0) --PROMOCIONEXCLUSIVA
          BEGIN
            SELECT @CalcDescuentoExclusivo = (@DescuentoAcum /100) * @PonderadoExclusivo --PROMOCIONEXCLUSIVA    
            SELECT @DescuentoExclusivo = @DescuentoExclusivo + @CalcDescuentoExclusivo --PROMOCIONEXCLUSIVA
            SELECT @PonderadoExclusivo = @PonderadoExclusivo - @CalcDescuentoExclusivo --PROMOCIONEXCLUSIVA
            IF @Nivel IN ('Exclusiva') SET @PromocionExclusivaAplicada = 1
          END ELSE
          IF (@Nivel IN ('Siempre')) OR (@Nivel IN ('Promocion') AND @PromocionPromocionAplicada = 0) --PROMOCIONPROMOCION
          BEGIN
            SELECT @CalcDescuentoPromocion = (@DescuentoAcum /100) * @PonderadoPromocion --PROMOCIONPROMOCION    
            SELECT @DescuentoPromocion = @DescuentoPromocion + @CalcDescuentoPromocion --PROMOCIONPROMOCION
            SELECT @PonderadoPromocion = @PonderadoPromocion - @CalcDescuentoPromocion --PROMOCIONPROMOCION
            IF @Nivel IN ('Promocion') SET @PromocionPromocionAplicada = 1
          END ELSE
          IF (@Nivel IN ('Siempre')) OR (@Nivel IN ('Particular') AND @PromocionParticularAplicada = 0)  --PROMOCIONPARTICULAR
          BEGIN
            SELECT @CalcDescuentoParticular = (@DescuentoAcum /100) * @PonderadoParticular --PROMOCIONPARTICULAR   
            SELECT @DescuentoParticular = @DescuentoParticular + @CalcDescuentoParticular --PROMOCIONPARTICULAR
            SELECT @PonderadoParticular = @PonderadoParticular - @CalcDescuentoParticular --PROMOCIONPARTICULAR
            IF @Nivel IN ('Particular') SET @PromocionParticularAplicada = 1            
          END
          
        --END --PROMOCIONEXCLUSIVA
      END
  END       
  
  CLOSE crDescto
  DEALLOCATE crDescto

  IF @PromocionPromocion = 1                                                          SET @Descuento = @DescuentoPromocion  ELSE
  IF @PromocionPromocion = 0 AND @PromocionParticular = 1                             SET @Descuento = @DescuentoParticular ELSE
  IF @PromocionPromocion = 0 AND @PromocionParticular = 0 AND @PromocionExclusiva = 1 SET @Descuento = @DescuentoExclusivo
  
  --Obtiene el costo del articulo
  EXEC spVerCosto @Sucursal, @Empresa, NULL, @Articulo, @Subcuenta, @UnidadVenta, @TipoCosteo, @Moneda, @TipoCambio, @MovCosto = @Costo OUTPUT, @ConReturn = 0

    --Cuando es por precio, calcula el precio minimo segun el tipo especifico y pone todo esto en una tabla temporal
    SELECT Precio = CASE WHEN p.Tipo = 'Precio' THEN /*MIN(ISNULL(pd.Monto,0))*/     SUM(dbo.fnWebPoliticaDescuento(pd.ID, pd.Cantidad, @vCondicion, pd.Monto))
       WHEN p.Tipo = 'Precio=Costo+[%]' THEN MIN(@Costo + (@Costo * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Costo+[$]' THEN MIN(@Costo + ISNULL(pd.Monto,0))
       WHEN p.Tipo = 'Precio=Costo+[% margen]' THEN MIN(@Costo / (1 - (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Costo*[Factor]' THEN MIN(@Costo * pd.Monto)
       WHEN p.Tipo = 'Precio=Precio+[%]' THEN MIN(@PrecioTemp + (@PrecioTemp * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio Lista+[%]' THEN MIN(@PrecioLista + (@PrecioLista * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 2+[%]' THEN MIN(@Precio2 + (@Precio2 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 3+[%]' THEN MIN(@Precio3 + (@Precio3 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 4+[%]' THEN MIN(@Precio4 + (@Precio4 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 5+[%]' THEN MIN(@Precio5 + (@Precio5 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 6+[%]' THEN MIN(@Precio6 + (@Precio6 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 7+[%]' THEN MIN(@Precio7 + (@Precio7 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 8+[%]' THEN MIN(@Precio8 + (@Precio8 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 9+[%]' THEN MIN(@Precio9 + (@Precio9 * (ISNULL(pd.Monto,0) / 100.00)))
       WHEN p.Tipo = 'Precio=Precio 10+[%]' THEN MIN(@Precio10 + (@Precio10 * (ISNULL(pd.Monto,0) / 100.00)))
              END,
     Orden = CASE WHEN p.Tipo = 'Precio' THEN 1
      WHEN p.Tipo = 'Precio=Costo+[%]' THEN 2
      WHEN p.Tipo = 'Precio=Costo+[$]' THEN 3
      WHEN p.Tipo = 'Precio=Costo+[% margen]' THEN 4
      WHEN p.Tipo = 'Precio=Costo*[Factor]' THEN 5
      WHEN p.Tipo = 'Precio=Precio+[%]' THEN 6
      WHEN p.Tipo = 'Precio=Precio Lista+[%]' THEN 7
      WHEN p.Tipo = 'Precio=Precio 2+[%]' THEN 8
      WHEN p.Tipo = 'Precio=Precio 3+[%]' THEN 9
      WHEN p.Tipo = 'Precio=Precio 4+[%]' THEN 10
      WHEN p.Tipo = 'Precio=Precio 5+[%]' THEN 11
      WHEN p.Tipo = 'Precio=Precio 6+[%]' THEN 12
      WHEN p.Tipo = 'Precio=Precio 7+[%]' THEN 13
      WHEN p.Tipo = 'Precio=Precio 8+[%]' THEN 14
      WHEN p.Tipo = 'Precio=Precio 9+[%]' THEN 15
      WHEN p.Tipo = 'Precio=Precio 10+[%]' THEN 16
        ELSE 99999999
        END,
        p.Tipo,
        p.Nivel
      INTO #PrecioTemp
      FROM Precio p
     INNER JOIN PrecioD pd ON p.ID = pd.ID
                          AND @Cantidad >= pd.Cantidad                          
     WHERE ((ISNULL(p.ConVigencia,0) = 0) OR (@FechaEmision BETWEEN p.FechaD AND p.FechaA))
       --Condiciones de Propiedades de Articulo 
       AND ((ISNULL(p.NivelArticulo,0) = 0) OR (p.Articulo = @Articulo)) 
       AND ((ISNULL(p.NivelSubCuenta,0) = 0) OR (p.SubCuenta = @Subcuenta)) 
       AND ((ISNULL(p.NivelUnidadVenta,0) = 0) OR (p.UnidadVenta = @UnidadVenta)) 
       AND ((ISNULL(p.NivelArtCat,0) = 0) OR (p.ArtCat = @ArtCat))
       AND ((ISNULL(p.NivelArtGrupo,0) = 0) OR (p.ArtGrupo = @ArtGrupo)) 
       AND ((ISNULL(p.NivelArtFam,0) = 0) OR (p.ArtFam = @ArtFam))
       AND ((ISNULL(p.NivelArtModelo,0) = 0) OR (p.Modelo = @ArtModelo))  
       AND ((ISNULL(p.NivelFabricante,0) = 0) OR (p.Fabricante = @Fabricante))
       AND ((ISNULL(p.NivelArtLinea,0) = 0) OR (p.ArtLinea = @ArtLinea)) 
       AND ((ISNULL(p.NivelArtRama,0) = 0) OR (p.ArtRama = @ArtRama))
       --Condiciones de Propiedades de Clientes
       AND ((ISNULL(p.NivelCliente,0) = 0) OR (p.Cliente = @Cliente))
       AND ((ISNULL(p.NivelCteGrupo,0) = 0) OR (p.CteGrupo = @CteGrupo))
       AND ((ISNULL(p.NivelCteCat,0) = 0) OR (p.CteCat = @CteCat))
       AND ((ISNULL(p.NivelCteFam,0) = 0) OR (p.CteFam = @CteFam))
       AND ((ISNULL(p.NivelCteZona,0) = 0) OR (p.CteZona = @CteZona))
        --Condiciones de Propiedades de la Factura
       AND ((ISNULL(p.NivelAgente,0) = 0) OR (p.Agente = @Agente))
       AND ((ISNULL(p.NivelMoneda,0) = 0) OR (p.Moneda = @Moneda))
       AND ((ISNULL(p.NivelCondicion,0) = 0) OR (p.Condicion = @Condicion))
       AND ((ISNULL(p.NivelAlmacen,0) = 0) OR (p.Almacen = @Almacen))
       AND ((ISNULL(p.NivelProyecto,0) = 0) OR (p.Proyecto = @Proyecto))
       AND ((ISNULL(p.NivelFormaEnvio,0) = 0) OR (p.FormaEnvio = @FormaEnvio))
       AND ((ISNULL(p.NivelMov,0) = 0) OR (p.Mov = @Mov))
       AND ((ISNULL(p.NivelServicioTipo,0) = 0) OR (p.ServicioTipo = @ServicioTipo))
       AND ((ISNULL(p.NivelContratoTipo,0) = 0) OR (p.ContratoTipo = @ContratoTipo))
       AND ((ISNULL(p.NivelEmpresa,0) = 0) OR (p.Empresa = @Empresa)) 
       AND ((ISNULL(p.NivelRegion,0) = 0) OR (p.Region = @Region))
       AND ((ISNULL(p.NivelSucursal,0) = 0) OR (p.Sucursal = @Sucursal))          
       AND ((ISNULL(p.ListaPrecios,'Todas') = 'Todas') OR (p.ListaPrecios = @ListaPreciosEsp))
       AND p.Tipo LIKE ('Precio%')
       AND p.Estatus = 'ACTIVA'
       AND pd.Cantidad = (SELECT MAX(Cantidad) 
                            FROM PrecioD pd2 
                           WHERE p.ID = pd2.ID
                             AND @Cantidad >= pd2.Cantidad)
   GROUP BY p.Tipo,
      p.Nivel
   ORDER BY Orden

   SELECT TOP 1 @Precio = Precio,
    @NivelPolitica = Nivel
     FROM #PrecioTemp
   ORDER BY Orden
   
   IF @NivelPolitica = 'Exclusiva'
     SELECT @Descuento = 0
   
END 
GO 

/**************** spListaUsuariosWeb ****************/
if exists (select * from sysobjects where id = object_id('dbo.spWebPrecios') and type = 'P') drop procedure dbo.spWebPrecios
GO
CREATE PROCEDURE spWebPrecios
                    @Articulo  varchar(20)          

AS BEGIN 
DECLARE 
@FechaEmision  datetime,
@Precio   float,
@Descuento    float,
@Politica   varchar(max),
@DescuentoMonto float, 
@PrecioLista       float, 
@PrecioMSI         float,  
@PrecioContado     float, 
@DescuentoMSI         float,  
@DescuentoContado     float           


SELECT  @FechaEmision = GETDATE ()


 EXEC spPrecioEsp NULL, 'Pesos', @Articulo, NULL, @PrecioLista OUTPUT

EXEC spWebPoliticaPreciosCalc @FechaEmision, @Articulo, 'MSI',     @PrecioMSI     OUTPUT, @DescuentoMSI     OUTPUT,  @Politica OUTPUT, @DescuentoMonto OUTPUT 
EXEC spWebPoliticaPreciosCalc @FechaEmision, @Articulo, 'Contado', @PrecioContado OUTPUT, @DescuentoContado OUTPUT,  @Politica OUTPUT, @DescuentoMonto OUTPUT 


IF @DescuentoMSI     > 0.00 SELECT @PrecioMSI     = dbo.fnDisminuyePorcentaje(@PrecioLista, @DescuentoMSI)
IF @DescuentoContado > 0.00 SELECT @PrecioContado = dbo.fnDisminuyePorcentaje(@PrecioLista, @DescuentoContado)

SELECT @PrecioLista      AS PrecioLista, 
       @PrecioMSI        AS MSI, 
       @DescuentoMSI     AS DescMSI,
       @PrecioContado    AS Contado, 
       @DescuentoContado AS DescContado 
 
 RETURN 
 END 
 GO



