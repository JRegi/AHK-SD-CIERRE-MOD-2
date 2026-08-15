import { Sorteo } from "./entities/Sorteo.js";
import { Administrador } from "./entities/Administrador.js";
import { Materia } from "./entities/Materia.js";

const sorteo = new Sorteo();

const admin = new Administrador("Ana");
admin.modificarCosto(sorteo.plata, 6000);
admin.modificarChances(sorteo.oro, 5);

const juan = sorteo.registrar("Juan", "Perez", 22, "juan@mail.com", "40111222");
juan.esAlumnoAHK = true;
juan.materias.push(new Materia("Programacion 1", true, 8));
juan.materias.push(new Materia("Programacion 2", true, 7));
juan.materias.push(new Materia("Bases de Datos", true, 9));
juan.materias.push(new Materia("Redes", false, 0));
juan.materias.push(new Materia("Algoritmos", false, 0));
juan.materias.push(new Materia("Ingles", false, 0));
juan.materias.push(new Materia("Sistemas Operativos", false, 0));
juan.materias.push(new Materia("Matematica", false, 0));
juan.materias.push(new Materia("Fisica", false, 0));

juan.telefono = "+5491100000000";
juan.telegramChatId = "123456789";
juan.mediosContacto = ["email", "sms", "telegram"];

const maria = sorteo.registrar("Maria", "Gomez", 25, "maria@mail.com", "40333444");

sorteo.invitar(juan, "pedro@mail.com", "40555666");
await sorteo.aceptar("40555666", "Pedro", "Diaz", 20, true);

sorteo.invitar(juan, "lucia@mail.com", "40777888");
await sorteo.aceptar("40777888", "Lucia", "Ruiz", 19, false);

console.log("1) Referidos convertidos por Juan:", sorteo.cantidadReferidos(juan));
console.log("2) Chances de Juan:", sorteo.chancesDiscriminadas(juan));
console.log("3) Participantes por categoria:", sorteo.cantidadPorCategoria());
console.log("4) Participante con mas chances:", sorteo.participanteConMasChances().nombre);

const hace1Hora = new Date(Date.now() - 60 * 60 * 1000);
console.log("5) Referidos aceptados en la ultima hora:", sorteo.referidosAceptadosEnPeriodo(hace1Hora, new Date()));

console.log("6) Alumnos AHK vs otros:", sorteo.alumnosAHKvsOtros());
console.log("7) Promedio de chances en Bronce:", sorteo.promedioChances(sorteo.bronce));
console.log("8) Materias de Juan:", sorteo.materias(juan));
console.log("9) Inscriptos por dia:", sorteo.inscriptosPorDia());
console.log("10) Ascensos de categoria:", sorteo.cantidadAscensos());

console.log("Probabilidad de Juan:", sorteo.probabilidad(juan));
console.log("Probabilidad de Maria:", sorteo.probabilidad(maria));
