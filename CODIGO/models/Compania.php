<?php
    class Compania extends Conectar {
      /*   TODO: LISTAR REGISTROS */
        public function get_compania(){
            $conectar=parent::Conexion();
            $sql = "SP_L_COMPANIA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_compania_x_com_id ($com_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_COMPANIA_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$com_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_compania($com_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_COMPANIA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$com_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
        public function insert_compania($com_nom){
            $conectar=parent::Conexion();
            $sql = "SP_I_COMPANIA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
        public function update_compania($com_id,$com_nom){
            $conectar=parent::Conexion();
            $sql = "SP_U_COMPANIA_01 ?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$com_id);
            $query -> bindValue(2,$suc_id);
            $query -> execute();
        }
        
    }
?>