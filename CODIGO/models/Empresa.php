emp_<?php
    class Empresa extends Conectar {
      /*   TODO: LISTAR REGISTROS */
        public function get_empresa_x_com_id ($com_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_EMPRESA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$com_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_empresa_x_emp_id ($emp_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_EMPRESA_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_empresa($emp_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_EMPRESA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
        public function insert_empresa($com_id,$emp_nom,$emp_ruc){
            $conectar=parent::Conexion();
            $sql = "SP_I_EMPRESA_01 ?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$com_id);
            $query -> bindValue(2,$emp_nom);
            $query -> bindValue(3,$emp_ruc);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
        public function update_empresa($emp_id,$com_id,$emp_nom,$emp_ruc){
            $conectar=parent::Conexion();
            $sql = "SP_U_EMPRESA_01 ?,?,?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$emp_id);
            $query -> bindValue(2,$suc_id);
            $query -> bindValue(3,$emp_nom);
            $query -> bindValue(4,$emp_ruc);
            $query -> execute();
        }
        
    }
?>