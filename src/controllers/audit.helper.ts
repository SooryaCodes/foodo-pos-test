import { getDB } from "../db/mongo";
import {AuditLog} from "../types/audit";

export async function logAudit(log: AuditLog): Promise<void> {
    const db = getDB();
    await db.collection<AuditLog>("audit_logs").insertOne(log);
}