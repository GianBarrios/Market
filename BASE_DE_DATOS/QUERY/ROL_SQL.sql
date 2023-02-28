	--LISTAR TODAS LAS ROLS POR SUCURSAL
	ALTER PROCEDURE SP_L_ROL_01
	@SUC_ID INT
	AS
	BEGIN
		SELECT * FROM TM_ROL
		WHERE 
		SUC_ID = @SUC_ID
		AND EST=1
	END

	--OBTENER REGISTRO POR ID
	CREATE PROCEDURE SP_L_ROL_02
	@ROL_ID INT
	AS
	BEGIN
		SELECT * FROM TM_ROL
		WHERE 
		ROL_ID = @ROL_ID
		AND EST=1
	END

	--ELIMINAR REGISTRO 
	CREATE PROCEDURE SP_D_ROL_01
	@ROL_ID INT
	AS
	BEGIN
		UPDATE TM_ROL
		SET
			EST=0
		WHERE 
		ROL_ID = @ROL_ID
	END

	--REGISTRAR NUEVO REGISTRO
	CREATE PROCEDURE SP_I_ROL_01
	@SUC_ID INT,
	@ROL_NOM VARCHAR(150)
	AS
	BEGIN
		INSERT INTO TM_ROL
		(SUC_ID,ROL_NOM,FECH_CREA,EST)
		VALUES
		(@SUC_ID,@ROL_NOM,GETDATE(),1)
	END

	--ACTUALIZAR REGISTRO
	CREATE PROCEDURE SP_U_ROL_01
	@ROL_ID INT,
	@SUC_ID INT,
	@ROL_NOM VARCHAR(150)

	AS
	BEGIN
		UPDATE TM_ROL	
		SET
		SUC_ID = @SUC_ID,
		ROL_NOM = @ROL_NOM
		WHERE
		ROL_ID = @ROL_ID
	END