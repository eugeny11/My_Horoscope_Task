import fetch from "node-fetch";

export default async function handler(req, res) {
  console.log("Webhook triggered");
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      if (message) {
        const chatId = message.chat.id;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const url = "https://my-horoscope-task.vercel.app";

        if (message.text === "/start") {
          console.log("Start command received");

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

          const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_id: chatId,
                text: "Welcome! Click below to open the horoscope app:",
                ...replyMarkup,
              }),
            }
          );
          const data = await response.json();
          console.log("Message sent successfully:", data);
          res.status(200).json(data);
        } else if (message.text === "/stop") {
          console.log("Stop command received");

          const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_id: chatId,
                text: "Work has been stopped. Goodbye!",
              }),
            }
          );
          const data = await response.json();
          console.log("Stop message sent successfully:", data);
          res.status(200).json(data);
        } else {
          console.log("Message not recognized");
          res.status(200).send("No action needed");
        }
      } else {
        console.log("Message not found");
        res.status(400).send("Invalid message format");
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
