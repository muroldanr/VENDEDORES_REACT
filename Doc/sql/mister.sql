/*** spWebUsuario ***/
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
        @Personal   varchar(10) OUTPUT,
        @Agente     varchar(10) OUTPUT
AS BEGIN
   SELECT 
        @Empresa   = LTRIM(RTRIM(Empresa)),
        @Sucursal  = Sucursal,
        @Usuario   = LTRIM(RTRIM(Usuario)),
        @Cliente   = LTRIM(RTRIM(Cliente)),
        @Proyecto  = LTRIM(RTRIM(Proyecto)),
        @Proveedor = LTRIM(RTRIM(Proveedor)),
        --@Ubicacion = LTRIM(RTRIM(Ubicacion)),
        @Personal  = LTRIM(RTRIM(Personal)),
        @Agente    = LTRIM(RTRIM(Agente))
     FROM WebUsuario
    WHERE UsuarioWeb =  @UsuarioWeb
END
RETURN 
GO

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