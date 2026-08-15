import { Categoria } from "./Categoria.js";
import { Participante } from "./Participante.js";
import { Referido } from "./Referido.js";
import { Referencia } from "./Referencia.js";
import { ArU2026Service } from "../services/ArU2026Service.js";
import { EmailNotificador } from "../services/EmailNotificador.js";
import { SmsNotificador } from "../services/SmsNotificador.js";
import { TelegramNotificador } from "../services/TelegramNotificador.js";

export class Sorteo {
  constructor() {
    this.participantes = [];
    this.referidos = [];
    this.ascensos = 0;
    this.bronce = new Categoria("Bronce", 2, 0, 0);
    this.plata = new Categoria("Plata", 3, 5000, 50);
    this.oro = new Categoria("Oro", 5, 10000, 200);
    this.verificador = new ArU2026Service();
    this.emailNotificador = new EmailNotificador();
    this.smsNotificador = new SmsNotificador();
    this.telegramNotificador = new TelegramNotificador();
  }

  async notificar(participante, mensaje) {
    for (let i = 0; i < participante.mediosContacto.length; i = i + 1) {
      const medio = participante.mediosContacto[i];
      if (medio === "email") {
        await this.emailNotificador.enviar(participante, mensaje);
      } else if (medio === "sms") {
        await this.smsNotificador.enviar(participante, mensaje);
      } else if (medio === "telegram") {
        await this.telegramNotificador.enviar(participante, mensaje);
      }
    }
  }

  registrar(nombre, apellido, edad, mail, dni) {
    const participante = new Participante(nombre, apellido, edad, mail, dni);
    participante.categoria = this.bronce;
    participante.estudiaTecnologia = this.verificador.verificarEstudiante(dni);
    this.participantes.push(participante);
    return participante;
  }

  buscarParticipante(dni) {
    for (let i = 0; i < this.participantes.length; i = i + 1) {
      if (this.participantes[i].dni === dni) {
        return this.participantes[i];
      }
    }
    return null;
  }

  buscarReferido(dni) {
    for (let i = 0; i < this.referidos.length; i = i + 1) {
      if (this.referidos[i].dni === dni) {
        return this.referidos[i];
      }
    }
    return null;
  }

  invitar(referente, email, dni) {
    if (this.buscarReferido(dni)) {
      throw new Error("Esa persona ya fue referida por otro participante");
    }
    const referido = new Referido(email, dni, referente);
    this.referidos.push(referido);
    return referido;
  }

  async aceptar(dni, nombre, apellido, edad, esAlumnoAHK) {
    const referido = this.buscarReferido(dni);
    if (!referido) {
      throw new Error("No existe una invitación para ese DNI");
    }

    referido.aceptado = true;
    const referente = referido.referente;

    const nuevo = this.registrar(nombre, apellido, edad, referido.email, dni);
    nuevo.esAlumnoAHK = esAlumnoAHK;
    nuevo.referidoPor = referente;

    const chance = this.calcularChancePorReferido(referente, nuevo);
    referente.referencias.push(new Referencia(referente, nuevo, chance));

    this.verificarAscenso(referente);
    await this.notificar(referente, "Tu referido " + nuevo.nombre + " se unió al sorteo");
    return nuevo;
  }

  calcularChancePorReferido(referente, referido) {
    if (!referente.esAlumnoAHK) {
      return 1;
    }
    if (referido.esAlumnoAHK) {
      return 2;
    }
    if (referido.estudiaTecnologia) {
      return 1;
    }
    return 0.5;
  }

  verificarAscenso(participante) {
    const cantidad = participante.contarReferidos();
    if (participante.categoria === this.bronce && cantidad >= this.plata.referidosMinimos) {
      participante.categoria = this.plata;
      this.ascensos = this.ascensos + 1;
    } else if (participante.categoria === this.plata && cantidad >= this.oro.referidosMinimos) {
      participante.categoria = this.oro;
      this.ascensos = this.ascensos + 1;
    }
  }

  calcularTotalChances() {
    let total = 0;

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      total = total + this.participantes[i].calcularChancesTotales();
    }

    return total;
  }

  probabilidad(participante) {
    const total = this.calcularTotalChances();
    if (total === 0) {
      return 0;
    }
    return (participante.calcularChancesTotales() / total) * this.participantes.length;
  }

  cantidadReferidos(participante) {
    return participante.contarReferidos();
  }

  chancesDiscriminadas(participante) {
    return participante.detalleChances();
  }

  cantidadPorCategoria() {
    const resultado = { Bronce: 0, Plata: 0, Oro: 0 };

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      const nombreCategoria = this.participantes[i].categoria.nombre;
      resultado[nombreCategoria] = resultado[nombreCategoria] + 1;
    }

    return resultado;
  }

  participanteConMasChances() {
    let mejor = null;

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      const participante = this.participantes[i];
      if (mejor === null || participante.calcularChancesTotales() > mejor.calcularChancesTotales()) {
        mejor = participante;
      }
    }

    return mejor;
  }

  referidosAceptadosEnPeriodo(desde, hasta) {
    let total = 0;

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      const referencias = this.participantes[i].referencias;
      for (let j = 0; j < referencias.length; j = j + 1) {
        if (referencias[j].fecha >= desde && referencias[j].fecha <= hasta) {
          total = total + 1;
        }
      }
    }

    return total;
  }

  alumnosAHKvsOtros() {
    let alumnosAHK = 0;

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      if (this.participantes[i].esAlumnoAHK) {
        alumnosAHK = alumnosAHK + 1;
      }
    }

    const otros = this.participantes.length - alumnosAHK;
    return { alumnosAHK: alumnosAHK, otros: otros };
  }

  promedioChances(categoria) {
    let total = 0;
    let cantidad = 0;

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      const participante = this.participantes[i];
      if (participante.categoria === categoria) {
        total = total + participante.calcularChancesTotales();
        cantidad = cantidad + 1;
      }
    }

    if (cantidad === 0) {
      return 0;
    }
    return total / cantidad;
  }

  materias(participante) {
    return {
      cursadas: participante.contarMateriasCursadas(),
      aprobadas: participante.contarMateriasAprobadas(),
    };
  }

  inscriptosPorDia() {
    const porDia = {};

    for (let i = 0; i < this.participantes.length; i = i + 1) {
      const dia = this.participantes[i].fechaInscripcion.toISOString().slice(0, 10);
      if (porDia[dia] === undefined) {
        porDia[dia] = 1;
      } else {
        porDia[dia] = porDia[dia] + 1;
      }
    }

    return porDia;
  }

  cantidadAscensos() {
    return this.ascensos;
  }
}
