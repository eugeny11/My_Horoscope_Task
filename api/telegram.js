import { request } from "https";

export default async function handler(req, res) {
  console.log("Webhook triggered");
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      if (message) {
        const chatId = message.chat.id;
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const url = "https://my-horoscope-task.vercel.app";

        const postData = (text, replyMarkup) =>
          JSON.stringify({
            chat_id: chatId,
            text,
            ...replyMarkup,
          });

        const sendMessage = (text, replyMarkup = null) => {
          return new Promise((resolve, reject) => {
            const options = {
              hostname: "api.telegram.org",
              path: `/bot${token}/sendMessage`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(
                  postData(text, replyMarkup)
                ),
              },
            };

            const req = request(options, (response) => {
              let data = "";
              response.on("data", (chunk) => {
                data += chunk;
              });
              response.on("end", () => {
                resolve(JSON.parse(data));
              });
            });

            req.on("error", (error) => {
              reject(error);
            });

            req.write(postData(text, replyMarkup));
            req.end();
          });
        };

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

          const data = await sendMessage(
            "Welcome! Click below to open the horoscope app:",
            replyMarkup
          );
          console.log("Message sent successfully:", data);
          res.status(200).json(data);
        } else if (message.text === "/stop") {
          console.log("Stop command received");

          const data = await sendMessage("Work has been stopped. Goodbye!");
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
      console.error("Error processing request:", error.message);
      res.status(500).send("Failed to process request");
    }
  } else {
    console.log("Wrong request method");
    res.status(405).send("Method not allowed");
  }
}
