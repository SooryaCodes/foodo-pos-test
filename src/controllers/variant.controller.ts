import { IncomingMessage, ServerResponse } from "http";
import { ObjectId } from "mongodb";
import { send } from "../utils/response";
import { Variant } from "../types/variant";
import { getDB } from "../db/mongo";
import { logAudit } from "./audit.helper";
import { parseBody } from "../utils/bodyParser";

export async function variantController(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const db = getDB();


    const id = req.url?.split("/")[2];

    if (req.method === "POST") {
        const body = await parseBody<Omit<Variant, "createdAt" | "updatedAt" | "isDeleted">>(req);

        const variant: Variant = {
            ...body,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }


        const result = await db.collection<Variant>("variants").insertOne(variant);
        return send(res, 201, result);

        if (req.method == "PUT") {
            const updates = await parseBody<Partial<Variant>>(req);

            const old = await db.collection<Variant>("variants").findOne({ _id: new ObjectId(id) });

            if (!old) {
                return send(res, 404, { message: "Variant not found" });
            }

            await db.collection<Variant>("variants").updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    $set: { ...updates, updatedAt: new Date() }
                }
            )
            await logAudit({
                entityType: "VARIANT",
                entityId: id as string,
                field: "update",
                oldValue: old,
                newValue: updates,
                user: "system",
                timestamp: new Date()
            });
            return send(res, 200, { message: "Variant updated successfully", updated: true });
        }
        if (req.method === "DELETE" && id) {
            await db.collection<Variant>("variants").updateOne(
                { _id: new ObjectId(id) },
                { $set: { isDeleted: true } }
            );

            await logAudit({
                entityType: "VARIANT",
                entityId: id as string,
                field: "softDelete",
                oldValue: false,
                newValue: true,
                user: "system",
                timestamp: new Date()
            });

            return send(res, 200, { deleted: true });
        }
    }
}