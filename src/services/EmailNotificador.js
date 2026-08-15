import nodemailer from "nodemailer";
import { config } from "../config.js";

// No lo probe ni se si funciona, los datos estan en un archivo que se encuentra en el .gitignore


export class EmailNotificador {
  async enviar(participante, mensaje) {
    if (config.email.usuario === "") {
      console.log("Falta completar los datos de email en config.js");
      return;
    }

    const transporte = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.usuario,
        pass: config.email.password,
      },
    });

    await transporte.sendMail({
      from: config.email.usuario,
      to: participante.mail,
      subject: "AHK te lleva al Mundial",
      text: mensaje,
    });

    console.log("Email enviado a " + participante.mail);
  }
}
