import {IncomingMessage, ServerResponse} from "http";
import {ObjectId} from "mongodb";
import {send} from "../utils/response";
import {Item} from "../types/item";
import {getDB} from "../db/mongo";
import{logAudit} from "./audit.helper";
import {parseBody} from "../utils/bodyParser";

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
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
 * /item/{id}:
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               category:
 *                 type: string
 *               productCode:
 *                 type: string
 *               branchId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
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
 *         description: Item not found
 */
export async function itemController(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const db = getDB();

        if (req.method === "POST") {
            const body = await parseBody<Omit<Item, "createdAt" | "updatedAt">>(req);

            const item:Item = {
                ...body,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const result = await db.collection<Item>("items").insertOne(item);
            return send(res,201,result);
        }

        if(req.method=="PUT"){
            const id = req.url!.split("/")[2];
            
            if (!id) {
                return send(res, 400, { message: "Item ID is required" });
            }

            if (!ObjectId.isValid(id)) {
                return send(res, 400, { message: "Invalid item ID format" });
            }

            const updates = await parseBody<Partial<Item>>(req);

            const oldItem = await db.collection<Item>("items").findOne({_id: new ObjectId(id)});

            if(!oldItem){
                return send(res, 404, {message: "Item not found"});
            }

            await db.collection<Item>("items").updateOne(
                {
                    _id: new ObjectId(id)
                },
                {
                    $set: {...updates, updatedAt: new Date()}
                }
            )

            await logAudit({
                entityType: "ITEM",
                entityId: id,
                field: "updated",
                oldValue: oldItem,
                newValue: updates,
                user: "system",
                timestamp: new Date()
            });
            return send(res, 200, {message: "Item updated successfully",updated:true});
        }

        return send(res, 405, { message: "Method not allowed" });
    } catch (error: any) {
        console.error("Error in itemController:", error);
        return send(res, 500, { 
            message: "Internal server error", 
            error: error.message 
        });
    }
}