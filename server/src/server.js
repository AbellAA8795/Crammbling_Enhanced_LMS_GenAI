import dotenv from "dotenv";
import app from "./app.js";;

dotenv.config();

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

  console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("Callback URL:", process.env.GOOGLE_CALLBACK_URL);