import {IncomingMessage, ServerResponse} from "http";
import {getDB} from "../db/mongo";
import {send} from "../utils/response";

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Get all audit logs
 *     tags: [Audit Logs]
 *     description: Retrieves all audit logs sorted by timestamp (most recent first)
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 */
export async function auditController(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const db = getDB();
    const logs = await db.collection("audit_logs").find({}).sort({timestamp: -1}).toArray();
    send(res, 200, logs);
}