import https from "https";

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

        const postData = JSON.stringify({
          chat_id: chatId,
          text: "Welcome! Click below to open the horoscope app:",
          ...replyMarkup,
        });

        const requestOptions = {
          hostname: "api.telegram.org",
          path: `/bot${token}/sendMessage`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": postData.length,
          },
        };

        const request = https.request(requestOptions, (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            const responseData = JSON.parse(data);

            if (response.statusCode >= 200 && response.statusCode < 300) {
              console.log("Message sent successfully:", responseData);
              res.status(200).json(responseData);
            } else {
              console.error(
                "Telegram API responded with status",
                response.statusCode
              );
              res.status(response.statusCode).send("Failed to send message");
            }
          });
        });

        request.on("error", (error) => {
          console.error("Error processing request:", error.message);
          res.status(500).send("Failed to process request");
        });

        request.write(postData);
        request.end();
      } else {
        console.log("Message not recognized");
        res.status(200).send("No action needed");
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
