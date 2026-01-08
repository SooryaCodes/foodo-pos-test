import http,{IncomingMessage, ServerResponse} from 'http';
import dotenv from 'dotenv';
import {connectDB} from "./db/mongo";
import {router} from "./router"

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const MONGO_URI = process.env.MONGO_URI as string;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    await connectDB(MONGO_URI);
    router(req, res);
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});