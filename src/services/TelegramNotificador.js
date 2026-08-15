import TelegramBot from "node-telegram-bot-api";
import { config } from "../config.js";

// No lo probe ni se si funciona, los datos estan en un archivo que se encuentra en el .gitignore


export class TelegramNotificador {
  async enviar(participante, mensaje) {
    if (config.telegram.token === "") {
      console.log("Falta completar los datos de Telegram en config.js");
      return;
    }

    const bot = new TelegramBot(config.telegram.token);

    await bot.sendMessage(participante.telegramChatId, mensaje);

    console.log("Telegram enviado a " + participante.telegramChatId);
  }
}
