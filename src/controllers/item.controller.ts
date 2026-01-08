import {IncomingMessage, ServerResponse} from "http";
import {ObjectId} from "mongodb";
import {send} from "../utils/response";
import {Item} from "../types/item";
import {getDB} from "../db/mongo";
import{logAudit} from "./audit.helper";
import {parseBody} from "../utils/bodyParser";


export async function itemController(req: IncomingMessage, res: ServerResponse): Promise<void> {
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
}