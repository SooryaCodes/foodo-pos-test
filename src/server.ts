import http,{IncomingMessage, ServerResponse} from 'http';
import dotenv from 'dotenv';
import {connectDB} from "./db/mongo";
import {router} from "./router"

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is not set");
    process.exit(1);
}

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    router(req, res);
});

async function startServer() {
    try {
        await connectDB(MONGO_URI);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

startServer();