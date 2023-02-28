<?php
    class Cliente extends Conectar {
      /*   TODO: LISTAR REGISTROS */
<<<<<<< HEAD
        public function get_cliente_x_emp_id ($emp_id){
=======
        public function get_cliente_x_em_id ($emp_id){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_L_CLIENTE_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_cliente_x_cli_id ($cli_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_CLIENTE_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cli_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_cliente($cli_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_CLIENTE_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cli_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
<<<<<<< HEAD
        public function insert_cliente($emp_id,$cli_nom,$cli_nit,$cli_telf,$cli_direcc,$cli_correo){
=======
        public function insert_cliente($emp_id,$cli_nom,$cli_ruc,$cli_telf,$cli_direcc,$cli_correo){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_I_CLIENTE_01 ?,?,?,?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> bindValue(2,$cli_nom);
<<<<<<< HEAD
            $query -> bindValue(1,$cli_nit);
=======
            $query -> bindValue(1,$cli_ruc);
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $query -> bindValue(1,$cli_telf);
            $query -> bindValue(1,$cli_direcc);
            $query -> bindValue(1,$cli_correo);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
<<<<<<< HEAD
        public function update_cliente($cli_id,$emp_id,$cli_nom,$cli_nit,$cli_telf,$cli_direcc,$cli_correo){
=======
        public function update_cliente($cli_id,$emp_id,$cli_nom,$cli_ruc,$cli_telf,$cli_direcc,$cli_correo){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_U_CLIENTE_01 ?,?,?,?,?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cli_id);
            $query -> bindValue(2,$emp_id);
            $query -> bindValue(3,$cli_nom);
<<<<<<< HEAD
            $query -> bindValue(4,$cli_nit);
=======
            $query -> bindValue(4,$cli_ruc);
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $query -> bindValue(5,$cli_telf);
            $query -> bindValue(6,$cli_direcc);
            $query -> bindValue(7,$cli_correo);
        }
        
    }
?>