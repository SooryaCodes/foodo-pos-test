import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Foodo POS Backend API",
      version: "1.0.0",
      description:
        "Inventory management APIs for Food Ordering POS system"
    },
    servers: [
      {
        url: "/"   // ✅ WORKS everywhere (local + docker)
      }
    ],
    tags: [
      { name: "Items", description: "Item management" },
      { name: "Variants", description: "Variant management" },
      { name: "Audit Logs", description: "Audit activity feed" }
    ],
    components: {
      schemas: {
        Item: {
          type: "object",
          properties: {
            name: { type: "string" },
            brand: { type: "string" },
            category: { type: "string" },
            productCode: { type: "string" },
            branchId: { type: "string" }
          },
          required: ["name", "brand", "category", "productCode", "branchId"]
        },
        Variant: {
          type: "object",
          properties: {
            itemId: { type: "string" },
            name: { type: "string" },
            sellingPrice: { type: "number" },
            costPrice: { type: "number" },
            quantity: { type: "number" },
            properties: {
              type: "object",
              additionalProperties: true
            }
          },
          required: ["itemId", "name", "sellingPrice", "costPrice", "quantity"]
        },
        AuditLog: {
          type: "object",
          properties: {
            entityType: {
              type: "string",
              enum: ["ITEM", "VARIANT"]
            },
            entityId: { type: "string" },
            field: { type: "string" },
            oldValue: {},
            newValue: {},
            user: { type: "string" },
            timestamp: { type: "string", format: "date-time" }
          }
        }
      }
    }
  },
  apis: ["./src/controllers/*.ts"]
});