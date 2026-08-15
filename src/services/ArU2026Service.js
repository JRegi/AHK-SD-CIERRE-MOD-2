export class ArU2026Service {
  verificarEstudiante(dni) {
    return Number(dni) % 2 === 0;
  }
}
