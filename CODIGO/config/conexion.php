<?php
    class   Conectar{
        protected $dbh;

        protected function Conexion(){
            try{
                $conectar = $this->dbh=new PDO("sqlsrv:Server=localhost;Database=Market","sa","");
                return $conectar;
            }catch(Exception $e){
                print "Error en la conexion BD". $e->getMesagge(). "<br/>";
                die();
            }
        }
    }
    
?>


