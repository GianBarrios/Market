<?php
    class Categoria extends Conectar {
      /*   TODO: LISTAR REGISTROS */
        public function get_categoria_x_suc_id ($suc_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_CATEGORIA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);

        }
        /* TODO: LISTAR REGISTRO POR ID EN ESPECIFICO */
        public function get_categoria_x_cat_id ($cat_id){
            $conectar=parent::Conexion();
            $sql = "SP_L_CATEGORIA_02 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cat_id);
            $query -> execute();
            return $query->fetchAll(PDO::FETCH_ASSOC);
        }
        /* TODO: ELIMINAR O CAMBIAR ESTADO A ELIMINADO */
        public function delete_categoria($cat_id) {
            $conectar=parent::Conexion();
            $sql = "SP_D_CATEGORIA_01 ?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cat_id);
            $query -> execute();
        }
        /* TODO: REGISTRO DE DATOS */
        public function insert_categoria($suc_id,$cat_nom){
            $conectar=parent::Conexion();
            $sql = "SP_I_CATEGORIA_01 ?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$suc_id);
            $query -> bindValue(2,$cat_id);
            $query -> execute();
        }
        /* TODO: ACTUALIZAR DATOS */
        public function update_categoria($cat_id,$suc_id,$cat_nom){
            $conectar=parent::Conexion();
            $sql = "SP_U_CATEGORIA_01 ?,?";
            $query=$conectar->prepare($sql);
            $query -> bindValue(1,$cat_id);
            $query -> bindValue(2,$suc_id);
            $query -> bindValue(3,$cat_nom);
            $query -> execute();
        }
        
    }
?>