<?php
    class Moneda extends Conectar {
      /*   TODO: LISTAR REGISTROS */
        public function get_moneda_x_suc_id ($suc_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_MONEDA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_moneda_x_mon_id ($mon_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_MONEDA_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$mon_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_moneda($mon_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_MONEDA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$mon_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
        public function insert_moneda($suc_id,$mon_nom){
            $conectar=parent::Conexion();
            $sql = "SP_I_MONEDA_01 ?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> bindValue(2,$mon_nom);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
        public function update_moneda($mon_id,$suc_id,$mon_nom){
            $conectar=parent::Conexion();
            $sql = "SP_U_MONEDA_01 ?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$mon_id);
            $query -> bindValue(2,$suc_id);
            $query -> bindValue(3,$mon_nom);
            $query -> execute();
        }
        
    }
?>