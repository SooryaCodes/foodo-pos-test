import {IncomingMessage, ServerResponse} from "http";
import {getDB} from "../db/mongo";
import {send} from "../utils/response";

export async function auditController(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const db = getDB();
    const logs = await db.collection("audit_logs").find({}).sort({timestamp: -1}).toArray();
    send(res, 200, logs);
}