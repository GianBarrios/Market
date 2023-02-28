suc_<?php
    class Sucursal extends Conectar {
      /*   TODO: LISTAR REGISTROS */
        public function get_sucursal_x_com_id ($emp_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_SUCURSAL_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_sucursal_x_suc_id ($suc_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_SUCURSAL_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_sucursal($suc_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_SUCURSAL_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
        public function insert_sucursal($emp_id,$suc_nom){
            $conectar=parent::Conexion();
            $sql = "SP_I_SUCURSAL_01 ?,?";
            $query=$conectar->prepare($sql);
<<<<<<< HEAD
            $query -> bindValue(1,$emp_id);
=======
            $query -> bindValue(1,$com_id);
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $query -> bindValue(2,$suc_nom);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
<<<<<<< HEAD
        public function update_sucursal($suc_id,$emp_id,$suc_nom,$suc_nit){
=======
        public function update_sucursal($suc_id,$emp_id,$suc_nom,$suc_ruc){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_U_SUCURSAL_01 ?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> bindValue(2,$emp_id);
            $query -> bindValue(3,$suc_nom);
            $query -> execute();
        }
        
    }
?>