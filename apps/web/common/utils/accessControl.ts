// src/utils/accessControl.ts

type SubscriptionPlan = "Basic" | "Pro" | "Elite";

export interface User {
  subscriptionPlan: SubscriptionPlan;
  gameFowlMaterialsCount: number;
}

const FREE_PLAN_LIMIT = 2;

export function canAddGameFowlMaterial(user: User): boolean {
  if (user.subscriptionPlan === "Pro") return true;
  return user.gameFowlMaterialsCount < FREE_PLAN_LIMIT;
}
