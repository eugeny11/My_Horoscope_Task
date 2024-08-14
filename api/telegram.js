import axios from "axios";

export default async function handler(req, res) {
  console.log("Webhook triggered");
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      if (message && message.text === "/start") {
        console.log("Start command received");
        const chatId = message.chat.id;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const url = "https://my-horoscope-task.vercel.app";

        const replyMarkup = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Horoscope App",
                  web_app: { url },
                },
              ],
            ],
          },
        };

        const response = await axios.post(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            chat_id: chatId,
            text: "Welcome! Click below to open the horoscope app:",
            ...replyMarkup,
          }
        );
        console.log("Message sent successfully:", response.data);
        res.status(200).json(response.data);
      } else {
        console.log("Message not recognized");
        res.status(200).send("No action needed");
      }
    } catch (error) {
      console.error(
        "Error processing request:",
        error.response?.data || error.message
      );
      res.status(500).send("Failed to process request");
    }
  } else {
    console.log("Wrong request method");
    res.status(405).send("Method not allowed");
  }
}
