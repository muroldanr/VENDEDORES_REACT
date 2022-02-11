SET DATEFIRST 7
SET ANSI_NULLS OFF
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET LOCK_TIMEOUT -1
SET QUOTED_IDENTIFIER OFF
GO

IF EXISTS (SELECT name FROM sysobjects WHERE name = 'fnMovAnexoVenta') DROP FUNCTION fnMovAnexoVenta
GO
CREATE FUNCTION fnMovAnexoVenta (
    @Modulo char(5),
    @ModuloID int
)
RETURNS varchar(250)
AS BEGIN
    DECLARE @Direccion varchar(250)

    SELECT @Direccion = RTRIM(LTRIM(MIN(AnexoMov.Direccion)))
    FROM MovImpuesto
    JOIN AnexoMov
        ON  MovImpuesto.OrigenModulo = AnexoMov.Rama
        AND MovImpuesto.OrigenModuloID = AnexoMov.ID
    WHERE MovImpuesto.Modulo = @Modulo
        AND MovImpuesto.ModuloID = @ModuloID
        AND MovImpuesto.OrigenModulo = 'VTAS'
        AND AnexoMov.Icono = '745'
    RETURN(@Direccion)
END
GO

IF EXISTS (SELECT name FROM sysobjects WHERE name = 'fnRellenarCerosIzquierda') DROP FUNCTION fnRellenarCerosIzquierda
GO
CREATE FUNCTION fnRellenarCerosIzquierda
    (
    @Numero             varchar(100),
    @Longitud               int
    )
RETURNS varchar(100)
AS BEGIN
  DECLARE
    @Resultado   varchar(100)
  SET @Numero =RTRIM(LTRIM(@Numero))
  SELECT  @Resultado =  dbo.fnRellenarConCaracter (@Numero,@Longitud,'I','0')
RETURN (@Resultado)
END
GO

