export interface Variant {
    itemId: string;
    name: string;
    sellingPrice: number;
    costPrice: number;
    quantity: number;
    properties: Record<string, string | number | boolean>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }