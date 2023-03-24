<?php
    session_start();
    class   Conectar{
        protected $dbh;

        protected function Conexion(){
            try{
                $conectar = $this->dbh=new PDO("sqlsrv:Server=DESKTOP-M04N98K\SQLEXPRESS;Database=Market","sa","2424");
                return $conectar;
                print "conexion realizada con exito"."<br />";
            }catch(Exception $e){
                print "Error en la conexion BD". $e->getMessage(). "<br/>";
                die();
            }
        }

        public static function ruta() {
            return "http://localhost/Ferreteria/CODIGO/";
        }
    }


?>

