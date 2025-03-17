import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";

dotenv.config({
    path: ".env"
});

const PORT=process.env.PORT || 5000


connectDB()
.then(()=>{app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})});