<?php 
/*TODO llamando Clases */
require_once ("../config/conexion.php");
require_once("../models/Empresa.php");

$empresa = new Empresa();

switch($_GET["op"]){
    /*TODO Guardar y editar, guardar cuando el ID este vacio, y actualizar cuando se envie el ID */
    case "guardaryeditar":
        if(empty($_Post["emp_id"])){
            $empresa->insert_empresa($_POST["com_id"],$_POST["emp_nom"],$_POST["emp_nit"]);
            } else{
                $empresa->update_empresa($_POST["emp_id"],$_POST["com_id"],$_POST["emp_nom"],$_POST["emp_nit"]);
            }
         break;

         /*TODO Listado de registros formato JSon para datatable JS */
    case "listar":
        $datos=$empresa->get_empresa_x_com_id($_POST["com_id"]);
        $data=Array();
        foreach($datos as $row){
            $sub_array = array();
            $sub_array = $row["emp_nom"];
            $sub_array = "Editar";
            $sub_array = "Eliminar";
            $data[] = $sub_array;
        }

        $result = array(
            "sEcho" => 1,
            "iTotalRecords" =>count($data),
            "iTotalDisplayRecords" =>count($data),
            "aaData" =>$data);
            echo json_encode($results);
         break;  
        /*TODO Mostrar informacion de registro segun su ID */
    case    "mostrar":
        $datos=$empresa->get_empresa_x_emp_id($_POST["emp_id"]);
        if(is_array($datos)==true and count($datos)>0){
            foreach($datos as $row) {
                $output["emp_id"]=$row["emp_id"];
                $output["com_id"]=$row["com_id"];
                $output["emp_nom"]=$row["emp_nom"];
                $output["emp_nit"]=$row["emp_nit"];
                 }
                echo json_encode($output);
        }
        
         break; 
/*TODO Cambiar el estado a 0 del registro*/ 
    case "eliminar":

        $empresa->delete_empresa($_POST["emp_id"]);
        break;
    /* TODO LISTAR COMBO */
    case "combo";
        $datos=$empresa->get_empresa_x_com_id($_POST["com_id"]);
        if (is_array($datos)==true and count($datos)>0){
            $html ="";
            $html.="<option selected>Seleccionar </option>";
            foreach ($datos as $row) {
                $html."<option value='".$row["emp_id"]."'>".$row["emp_nom"]."</option>";
            }
            echo $html;
        }
    break;
}
?>