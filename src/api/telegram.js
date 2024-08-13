import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (message && message.text === "/start") {
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

      try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: chatId,
          text: "Welcome! Click below to open the horoscope app:",
          ...replyMarkup,
        });
        res.status(200).send("Message sent");
      } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send message");
      }
    } else {
      res.status(200).send("No action needed");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}
