export class Referencia {
  constructor(referente, referido, chance) {
    this.referente = referente;
    this.referido = referido;
    this.chance = chance;
    this.fecha = new Date();
  }
}
