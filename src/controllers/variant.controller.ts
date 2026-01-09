import { IncomingMessage, ServerResponse } from "http";
import { ObjectId } from "mongodb";
import { send } from "../utils/response";
import { Variant } from "../types/variant";
import { getDB } from "../db/mongo";
import { logAudit } from "./audit.helper";
import { parseBody } from "../utils/bodyParser";

/**
 * @swagger
 * /variants:
 *   post:
 *     summary: Create a new variant
 *     tags: [Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                 insertedId:
 *                   type: string
 *       400:
 *         description: Invalid input
 *
 * /variants/{id}:
 *   put:
 *     summary: Update an existing variant
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               name:
 *                 type: string
 *               sellingPrice:
 *                 type: number
 *               costPrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *               properties:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updated:
 *                   type: boolean
 *       404:
 *         description: Variant not found
 *   delete:
 *     summary: Soft delete a variant
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *       404:
 *         description: Variant not found
 */
export async function variantController(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
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
        }

        if (req.method === "PUT") {
            if (!id) {
                return send(res, 400, { message: "Variant ID is required" });
            }

            if (!ObjectId.isValid(id)) {
                return send(res, 400, { message: "Invalid variant ID format" });
            }

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
                entityId: id,
                field: "update",
                oldValue: old,
                newValue: updates,
                user: "system",
                timestamp: new Date()
            });
            return send(res, 200, { message: "Variant updated successfully", updated: true });
        }

        if (req.method === "DELETE") {
            if (!id) {
                return send(res, 400, { message: "Variant ID is required" });
            }

            if (!ObjectId.isValid(id)) {
                return send(res, 400, { message: "Invalid variant ID format" });
            }

            const variant = await db.collection<Variant>("variants").findOne({ _id: new ObjectId(id) });

            if (!variant) {
                return send(res, 404, { message: "Variant not found" });
            }

            await db.collection<Variant>("variants").updateOne(
                { _id: new ObjectId(id) },
                { $set: { isDeleted: true } }
            );

            await logAudit({
                entityType: "VARIANT",
                entityId: id,
                field: "softDelete",
                oldValue: false,
                newValue: true,
                user: "system",
                timestamp: new Date()
            });

            return send(res, 200, { deleted: true });
        }

        return send(res, 405, { message: "Method not allowed" });
    } catch (error: any) {
        console.error("Error in variantController:", error);
        return send(res, 500, { 
            message: "Internal server error", 
            error: error.message 
        });
    }
}