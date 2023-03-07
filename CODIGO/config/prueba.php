<?php
require_once('conexion.php');

// Crear una instancia de la clase Conectar
$con = new Conectar();

// Llamar al método Conexion() para establecer la conexión a la base de datos
$dbh = $con->Conexion();

// Verificar si la conexión se realizó correctamente
if ($dbh) {
  echo "Conexión establecida correctamente";
} else {
  echo "Error al conectar a la base de datos";
}
?>