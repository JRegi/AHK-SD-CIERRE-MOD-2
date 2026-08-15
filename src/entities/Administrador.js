export class Administrador {
  constructor(nombre) {
    this.nombre = nombre;
  }

  modificarChances(categoria, valor) {
    categoria.multiplicador = valor;
  }

  modificarCosto(categoria, valor) {
    categoria.costo = valor;
  }
}
