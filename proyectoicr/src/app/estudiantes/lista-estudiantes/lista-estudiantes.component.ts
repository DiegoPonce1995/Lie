import { AutenticacionService } from './../../login/autenticacionService.service';
import { Component, OnInit } from "@angular/core";
import { EstudiantesService } from "../estudiante.service";
import { Estudiante } from "../estudiante.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-lista-estudiantes",
  templateUrl: "./lista-estudiantes.component.html",
  styleUrls: ["./lista-estudiantes.component.css"]
})
export class ListaEstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  curso: string;
  permisos={
    notas:0,
    asistencia:0,
    eventos:0,
    sanciones:0,
    agendaCursos:0,
    inscribirEstudiante:0,
    registrarEmpleado:0,
    cuotas:0
  };
  isLoading: boolean = true;

  constructor(public servicio: EstudiantesService, public router: Router, public authService: AutenticacionService) {}

  ngOnInit() {

    if(this.servicio.retornoDesdeAcciones= false){
      this.isLoading=true;
    }else{

       this.servicio.getEstudiantesListener().subscribe(estudiantesBuscados => {
      this.estudiantes = estudiantesBuscados;
      this.isLoading= false;
    });
    
    if (this.servicio.retornoDesdeAcciones) {
      this.servicio.retornoDesdeAcciones = false;
    }
    this.authService.obtenerPermisosDeRol().subscribe(response=>{
      this.permisos=response.permisos;
    });
    }


  }

  asignarEstudianteSeleccionado(indice){
    this.servicio.estudianteSeleccionado = this.estudiantes.find(
      estudiante =>
        estudiante.numeroDocumento === this.estudiantes[indice].numeroDocumento
    );
    this.servicio.retornoDesdeAcciones = true;
  }

  onInscribir(indice) {
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./curso"]);
  }

  onMostrar(indice) {
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./mostrar"]);
  }

  onRetiro(indice) {
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./retiroAnticipado"]);
  }

  onLlegadaTarde(indice) {
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./llegadaTarde"]);
  }

  onVisualizarPerfil(indice) {
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./perfilEstudiante"]);
  }

  onJustificar(indice){
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./justificarInasistencia"]);
  }

  onRegistrarAR(indice){
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./altaAdultoResponsable"]);
  }

  onRegistrarExamenes(indice){
    this.asignarEstudianteSeleccionado(indice);
    this.router.navigate(["./calificacionesExamenes"]);
  }
}
