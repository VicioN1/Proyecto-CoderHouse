const chatModel = require("../../models/chat.model");

class ChatManager {
  constructor() {
    this.Chat = {};
  }

  async addChat(user, message) {
    try {
      const newChat = await chatModel.create({
        user,
        message
      });
      console.log("mensaje guardado")
      return ("mensaje guardado")
    } catch (error) {
      console.error(error)
    }
  }

  async readChat() {
    try {
      const Chat = await chatModel.find();
      return Chat;
    } catch (error) {
      console.error("Error al obtener todos los Chat", error);
      return [];
    }
  }
}


module.exports = ChatManager;
