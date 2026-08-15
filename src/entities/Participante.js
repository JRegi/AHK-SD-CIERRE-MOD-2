export class Participante {
  constructor(nombre, apellido, edad, mail, dni) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.mail = mail;
    this.dni = dni;
    this.esAlumnoAHK = false;
    this.estudiaTecnologia = false;
    this.materias = [];
    this.categoria = null;
    this.referidoPor = null;
    this.referencias = [];
    this.fechaInscripcion = new Date();
  }

  contarReferidos() {
    return this.referencias.length;
  }

  calcularChanceMateriasCursadas() {
    let total = 0;

    for (let i = 0; i < this.materias.length; i = i + 1) {
      if (!this.materias[i].aprobada) {
        total = total + 0.5;
      }
    }

    return total;
  }

  calcularChanceMateriasAprobadas() {
    let total = 0;

    for (let i = 0; i < this.materias.length; i = i + 1) {
      const materia = this.materias[i];
      if (materia.aprobada) {
        total = total + (materia.nota * 0.5);
      }
    }

    return total;
  }

  contarMateriasCursadas() {
    let total = 0;

    for (let i = 0; i < this.materias.length; i = i + 1) {
      if (!this.materias[i].aprobada) {
        total = total + 1;
      }
    }

    return total;
  }

  contarMateriasAprobadas() {
    let total = 0;

    for (let i = 0; i < this.materias.length; i = i + 1) {
      if (this.materias[i].aprobada) {
        total = total + 1;
      }
    }

    return total;
  }

  calcularChancePorReferidos() {
    let total = 0;

    for (let i = 0; i < this.referencias.length; i = i + 1) {
      total = total + this.referencias[i].chance;
    }

    return total;
  }

  calcularChancesTotales() {
    const base = this.calcularChanceMateriasAprobadas() + this.calcularChanceMateriasCursadas() + this.calcularChancePorReferidos();
    return this.categoria.multiplicador * base;
  }

  detalleChances() {
    return {
      categoria: this.categoria.multiplicador,
      materiasCursadas: this.calcularChanceMateriasCursadas(),
      materiasAprobadas: this.calcularChanceMateriasAprobadas(),
      referidos: this.calcularChancePorReferidos(),
      total: this.calcularChancesTotales(),
    };
  }
}
