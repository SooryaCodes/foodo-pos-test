export interface AuditLog {
    entityType: "ITEM" | "VARIANT";
    entityId: string;
    field: string;
    oldValue: unknown;
    newValue: unknown;
    user: string;
    timestamp: Date;
  }