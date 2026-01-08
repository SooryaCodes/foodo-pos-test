import { IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { getDB } from "../db/mongo";
import { send } from "../utils/response";

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Get audit logs
 *     tags: [Audit Logs]
 *     description: Retrieves audit logs. Can filter by itemId (returns logs for item and all its variants) or variantId. Returns all logs sorted by timestamp (most recent first) if no filter is provided.
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter audit logs by item ID. Returns logs for the item and all its variants.
 *         example: "65a7f0c9a123456789abcd01"
 *       - in: query
 *         name: variantId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter audit logs by variant ID. Returns only logs for the specified variant.
 *         example: "69600a0f44c4b63418173529"
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditLog'
 *             examples:
 *               allLogs:
 *                 summary: All audit logs
 *                 value:
 *                   - entityType: "VARIANT"
 *                     entityId: "69600a0f44c4b63418173529"
 *                     field: "update"
 *                     oldValue: { sellingPrice: 150 }
 *                     newValue: { sellingPrice: 170 }
 *                     user: "system"
 *                     timestamp: "2026-01-08T20:01:02.000Z"
 *               filteredByItemId:
 *                 summary: Filtered by itemId (item + all variants)
 *                 value:
 *                   - entityType: "ITEM"
 *                     entityId: "65a7f0c9a123456789abcd01"
 *                     field: "update"
 *                     oldValue: { name: "Burger" }
 *                     newValue: { name: "Cheese Burger" }
 *                     user: "system"
 *                     timestamp: "2026-01-08T20:00:00.000Z"
 *                   - entityType: "VARIANT"
 *                     entityId: "69600a0f44c4b63418173529"
 *                     field: "update"
 *                     oldValue: { quantity: 25 }
 *                     newValue: { quantity: 20 }
 *                     user: "system"
 *                     timestamp: "2026-01-08T20:01:02.000Z"
 *               filteredByVariantId:
 *                 summary: Filtered by variantId
 *                 value:
 *                   - entityType: "VARIANT"
 *                     entityId: "69600a0f44c4b63418173529"
 *                     field: "update"
 *                     oldValue: { quantity: 25 }
 *                     newValue: { quantity: 20 }
 *                     user: "system"
 *                     timestamp: "2026-01-08T20:01:02.000Z"
 */
export async function auditController(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const db = getDB();
  const { query } = parse(req.url || "", true);

  if (query.itemId) {
    const variants = await db
      .collection("variants")
      .find({ itemId: query.itemId })
      .project({ _id: 1 })
      .toArray();

    const variantIds = variants.map(v => v._id.toString());

    const logs = await db
      .collection("audit_logs")
      .find({
        $or: [
          { entityType: "ITEM", entityId: query.itemId },
          {
            entityType: "VARIANT",
            entityId: { $in: variantIds }
          }
        ]
      })
      .sort({ timestamp: -1 })
      .toArray();

    return send(res, 200, logs);
  }

  if (query.variantId) {
    const logs = await db
      .collection("audit_logs")
      .find({
        entityType: "VARIANT",
        entityId: query.variantId
      })
      .sort({ timestamp: -1 })
      .toArray();

    return send(res, 200, logs);
  }

  const logs = await db
    .collection("audit_logs")
    .find({})
    .sort({ timestamp: -1 })
    .toArray();

  return send(res, 200, logs);
}