/** APPCarrito **/
if not exists (select * from SysTabla where SysTabla = 'APPCarrito') 
INSERT INTO SysTabla (SysTabla,Tipo) VALUES ('APPCarrito','Movimiento')
if not exists (select * from sysobjects where id = object_id('dbo.APPCarrito') and type = 'U') 
  CREATE TABLE dbo.CarritoAPP (
    ID                         int IDENTITY(1,1) NOT NULL,
    Usuario                    varchar(20)  NOT NULL, 
    Cliente                    varchar(10)  NOT NULL,
    Condicion                  varchar(50)      NULL, 

    Modulo                     char(5)          NULL, 
    ModuloID                   int              NULL, 
    Renglon                    int              NULL, 

    Articulo                   varchar(20)      NULL, 
    Cantidad                   float            NULL, 
    Precio                     money            NULL, 
    Precio2                    money            NULL, 
    Precio3                    money            NULL,
    DescripcionExtra           varchar(100)      NULL,
         
CONSTRAINT priAPPCarrito PRIMARY KEY CLUSTERED (ID, Usuario, Cliente))
GO

GO
--EXEC spALTER_TABLE 'WebVenta', 'Opciones', 'varchar(50)  NULL'
GO

EXEC spALTER_TABLE 'CarritoAPP', 'Almacen', 'varchar(10) NULL'
EXEC spALTER_TABLE 'Venta', 'RefNombre', 'varchar(100) NULL'
EXEC spALTER_TABLE 'Venta', 'RefEmail',  'varchar(50) NULL'
EXEC spALTER_TABLE 'Venta', 'RefTelefono',  'varchar(50) NULL'


/** OTROS SPS **/
-- EXEC spAppClienteOmision 'droldan', '00001'

CREATE TABLE dbo.NotificacionApp(
    Usuario                    varchar(20)  NOT NULL,
    Token                      varchar(255) NOT NULL,
    Enviado                    bit
)
GO