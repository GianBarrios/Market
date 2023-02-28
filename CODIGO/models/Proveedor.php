<?php
    class Proveedor extends Conectar {
      /*   TODO: LISTAR REGISTROS */
<<<<<<< HEAD
        public function get_proveedor_x_emp_id ($emp_id){
=======
        public function get_proveedor_x_em_id ($emp_id){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_L_PROVEEDOR_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_proveedor_x_prov_id ($prov_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_PROVEEDOR_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$prov_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_proveedor($prov_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_PROVEEDOR_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$prov_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
<<<<<<< HEAD
        public function insert_proveedor($emp_id,$prov_nom,$prov_nit,$prov_telf,$prov_direcc,$prov_correo){
=======
        public function insert_proveedor($emp_id,$prov_nom,$prov_ruc,$prov_telf,$prov_direcc,$prov_correo){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_I_PROVEEDOR_01 ?,?,?,?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> bindValue(2,$prov_nom);
<<<<<<< HEAD
            $query -> bindValue(1,$prov_nit);
=======
            $query -> bindValue(1,$prov_ruc);
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $query -> bindValue(1,$prov_telf);
            $query -> bindValue(1,$prov_direcc);
            $query -> bindValue(1,$prov_correo);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
<<<<<<< HEAD
        public function update_proveedor($prov_id,$emp_id,$prov_nom,$prov_nit,$prov_telf,$prov_direcc,$prov_correo){
=======
        public function update_proveedor($prov_id,$emp_id,$prov_nom,$prov_ruc,$prov_telf,$prov_direcc,$prov_correo){
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $conectar=parent::Conexion();
            $sql = "SP_U_PROVEEDOR_01 ?,?,?,?,?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$prov_id);
            $query -> bindValue(2,$emp_id);
            $query -> bindValue(3,$prov_nom);
<<<<<<< HEAD
            $query -> bindValue(4,$prov_nit);
=======
            $query -> bindValue(4,$prov_ruc);
>>>>>>> 3fb13662bdaef0dc82a51c21ae5319e0d0603be7
            $query -> bindValue(5,$prov_telf);
            $query -> bindValue(6,$prov_direcc);
            $query -> bindValue(7,$prov_correo);
        }
        
    }
?>