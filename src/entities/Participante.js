export class Participante {
  constructor(
    nombre = null, 
    apellido = null, 
    edad = null, 
    mail = null, 
    dni = null
    ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.mail = mail;
    this.dni = dni;
    this.medioContactoPreferido = null;
    this.chancesPorMaterias = null;
    this.chancesPorReferencias = null;
    this.chancesTotales = null;
    this.tipoInstitucionAcademica = null;
    this.Categoria = null;
    this.Referencia = null;
    this.Probabilidad = null;
  }



  calcularChancesPorMaterias() {
    
  }

  calcularChancesTotales() {
    
  }

  calcularProbabilidad() {
    
  }
}
