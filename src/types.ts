/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Types representing RAB, AHSP, and RAP structures for Indonesian construction standards.

export type ResourceType = 'material' | 'labor' | 'equipment';

export interface ResourceItem {
  type: ResourceType;
  code: string;
  name: string;
  unit: string;
  coefficient: number;
  defaultPrice: number;
}

export interface AHSPTemplate {
  code: string;
  name: string;
  unit: string;
  category: string;
  components: ResourceItem[];
}

export interface RABItem {
  id: string;
  number?: string;
  category: string;
  name: string;
  volume: number;
  unit: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface RAPResource {
  id: string;
  type: ResourceType;
  name: string;
  unit: string;
  coefficient: number;
  neededQuantity: number;
  unitPrice: number;
  totalCost: number;
}

export interface RAPItem {
  id: string; // matches RABItem.id
  category: string;
  name: string;
  volume: number;
  unit: string;
  matchedAHSPCode?: string;
  matchedAHSPName?: string;
  resources: RAPResource[];
  totalDirectCost: number; // sum of resource totalCosts
  unitDirectCost: number; // totalDirectCost / volume
  ownerUnitPrice?: number; // from RAB unitPrice
  ownerTotalPrice?: number; // from RAB totalPrice
  profit: number; // ownerTotalPrice - totalDirectCost
  profitPercentage: number; // (profit / ownerTotalPrice) * 100
}

export interface ResourceRegistryItem {
  key: string; // slugified or standardized resource name
  type: ResourceType;
  name: string;
  unit: string;
  totalQuantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ConstructionProject {
  name: string;
  location: string;
  owner?: string;
  rabItems: RABItem[];
  rapItems: RAPItem[];
  resourceRegistry: { [key: string]: ResourceRegistryItem };
  totalRABAmount: number;
  totalRAPAmount: number;
  totalProfit: number;
}
