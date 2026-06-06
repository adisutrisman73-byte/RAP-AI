/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RABItem, RAPItem, ResourceRegistryItem, ConstructionProject, RAPResource } from '../types';
import { AHSP_DATABASE, REF_PRICES } from '../data/ahspData';

export function calculateProjectRAP(
  projectName: string,
  location: string,
  ownerName: string,
  rabItems: RABItem[],
  mappings: { [rabId: string]: string },
  customPrices: { [resourceName: string]: number }
): ConstructionProject {
  const rapItems: RAPItem[] = [];
  const resourceRegistry: { [key: string]: ResourceRegistryItem } = {};

  // 1. Calculate each RAP item
  for (const rab of rabItems) {
    const matchedAHSPCode = mappings[rab.id];
    const ahsp = matchedAHSPCode ? AHSP_DATABASE.find(a => a.code === matchedAHSPCode) : null;

    let resources: RAPResource[] = [];
    let totalDirectCost = 0;

    if (ahsp) {
      resources = ahsp.components.map((comp, compIdx) => {
        const itemVolume = rab.volume || 0;
        const neededQuantity = itemVolume * comp.coefficient;
        const currentUnitPrice = customPrices[comp.name] !== undefined ? customPrices[comp.name] : comp.defaultPrice;
        const totalCost = neededQuantity * currentUnitPrice;

        totalDirectCost += totalCost;

        // Aggregate to global resource registry
        const registryKey = comp.name;
        if (!resourceRegistry[registryKey]) {
          resourceRegistry[registryKey] = {
            key: registryKey,
            type: comp.type,
            name: comp.name,
            unit: comp.unit,
            totalQuantity: 0,
            unitPrice: currentUnitPrice,
            totalPrice: 0
          };
        }
        resourceRegistry[registryKey].totalQuantity += neededQuantity;
        resourceRegistry[registryKey].totalPrice = resourceRegistry[registryKey].totalQuantity * currentUnitPrice;

        return {
          id: `${rab.id}_res_${compIdx}`,
          type: comp.type,
          name: comp.name,
          unit: comp.unit,
          coefficient: comp.coefficient,
          neededQuantity,
          unitPrice: currentUnitPrice,
          totalCost
        };
      });
    }

    const ownerUnitPrice = rab.unitPrice || 0;
    const ownerTotalPrice = rab.totalPrice || (rab.volume * ownerUnitPrice) || 0;
    const unitDirectCost = rab.volume > 0 ? (totalDirectCost / rab.volume) : 0;
    const profit = ownerTotalPrice - totalDirectCost;
    const profitPercentage = ownerTotalPrice > 0 ? (profit / ownerTotalPrice) * 100 : 0;

    rapItems.push({
      id: rab.id,
      category: rab.category || 'Lain-lain',
      name: rab.name,
      volume: rab.volume,
      unit: rab.unit,
      matchedAHSPCode: ahsp?.code || undefined,
      matchedAHSPName: ahsp?.name || undefined,
      resources,
      totalDirectCost,
      unitDirectCost,
      ownerUnitPrice,
      ownerTotalPrice,
      profit,
      profitPercentage
    });
  }

  // 2. Finalize totals
  const totalRABAmount = rabItems.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const totalRAPAmount = rapItems.reduce((acc, curr) => acc + curr.totalDirectCost, 0);
  const totalProfit = totalRABAmount - totalRAPAmount;

  return {
    name: projectName,
    location,
    owner: ownerName,
    rabItems,
    rapItems,
    resourceRegistry,
    totalRABAmount,
    totalRAPAmount,
    totalProfit
  };
}
