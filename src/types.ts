export interface PlanOptions {
  budget: number;
  diet: string;
  people: number;
  time: number;
  ingredients: string;
}

export interface CookingPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  groceryList: string[];
  substitutions: string[];
  estimatedCost: number;
  budgetStatus: string;
}
