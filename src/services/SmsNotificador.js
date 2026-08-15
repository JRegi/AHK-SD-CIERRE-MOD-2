import twilio from "twilio";
import { config } from "../config.js";

// No lo probe ni se si funciona, los datos estan en un archivo que se encuentra en el .gitignore


export class SmsNotificador {
  async enviar(participante, mensaje) {
    if (config.sms.accountSid === "") {
      console.log("Falta completar los datos de SMS en config.js");
      return;
    }

    const cliente = twilio(config.sms.accountSid, config.sms.authToken);

    await cliente.messages.create({
      from: config.sms.telefono,
      to: participante.telefono,
      body: mensaje,
    });

    console.log("SMS enviado a " + participante.telefono);
  }
}
