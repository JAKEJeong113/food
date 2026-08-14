import { getDb } from "./db";

export interface RecipeRecommendation {
  recipeId: number;
  title: string;
  description: string;
  servings: number;
  cookTimeMinutes: number;
  kidFriendly: boolean;
  spicyLevel: number;
  cuisineType: string;
  cookingMethod: string;
  isDiet: boolean;
  isBabyFood: boolean;
  score: number;
  matchRate: number; // 0~100
  missing: string[];
  reason: string;
}

export interface RecommendFilters {
  maxTime?: number;
  kidFriendlyOnly?: boolean;
  noShopping?: boolean;
  cuisineType?: string; // 한식 | 중식 | 양식 | 일식
  cookingMethod?: string; // 볶음 | 찜 | 구이 | 튀김 | 조림 | 국물 | 부침 | 무침
  spicyOnly?: boolean; // spicy_level >= 1
  dietOnly?: boolean;
  babyFoodOnly?: boolean;
}

interface InventoryRow {
  ingredient_id: number;
  quantity: number;
  expiry_date: string | null;
}

interface RecipeRow {
  id: number;
  title: string;
  description: string | null;
  servings: number;
  cook_time_minutes: number;
  kid_friendly: number;
  spicy_level: number;
  cuisine_type: string;
  cooking_method: string;
  is_diet: number;
  is_baby_food: number;
}

interface RecipeIngredientRow {
  recipe_id: number;
  ingredient_id: number;
  name_ko: string;
  quantity_text: string;
  required: number;
  is_basic_seasoning: number;
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function timeScore(minutes: number): number {
  if (minutes <= 15) return 100;
  if (minutes <= 25) return 70;
  if (minutes <= 35) return 40;
  return 20;
}

export function recommendRecipes(
  householdId: number,
  filters: RecommendFilters = {}
): RecipeRecommendation[] {
  const db = getDb();

  const inventory = db
    .prepare("SELECT ingredient_id, quantity, expiry_date FROM inventory WHERE household_id = ?")
    .all(householdId) as InventoryRow[];
  const inventoryByIngredient = new Map(inventory.map((row) => [row.ingredient_id, row]));

  const recipes = db.prepare("SELECT * FROM recipe").all() as RecipeRow[];

  const allRecipeIngredients = db
    .prepare(
      `SELECT ri.recipe_id, ri.ingredient_id, im.name_ko, ri.quantity_text, ri.required, im.is_basic_seasoning
       FROM recipe_ingredient ri
       JOIN ingredient_master im ON im.id = ri.ingredient_id`
    )
    .all() as RecipeIngredientRow[];

  const results: RecipeRecommendation[] = recipes.map((recipe) => {
    const ingredients = allRecipeIngredients.filter((ri) => ri.recipe_id === recipe.id);
    const requiredNonSeasoning = ingredients.filter(
      (ri) => ri.required === 1 && ri.is_basic_seasoning === 0
    );

    const missing: string[] = [];
    let matchedCount = 0;

    for (const ri of requiredNonSeasoning) {
      const inv = inventoryByIngredient.get(ri.ingredient_id);
      if (inv && inv.quantity > 0) {
        matchedCount += 1;
      } else {
        missing.push(ri.name_ko);
      }
    }

    const matchRate =
      requiredNonSeasoning.length === 0
        ? 100
        : Math.round((matchedCount / requiredNonSeasoning.length) * 100);

    let urgency = 0;
    let urgentIngredient: string | null = null;
    for (const ri of ingredients) {
      const inv = inventoryByIngredient.get(ri.ingredient_id);
      if (!inv || !inv.expiry_date) continue;
      const d = daysUntil(inv.expiry_date);
      if (d <= 3 && urgency < 100) {
        urgency = 100;
        urgentIngredient = ri.name_ko;
      } else if (d <= 7 && urgency < 60) {
        urgency = 60;
        urgentIngredient = urgentIngredient ?? ri.name_ko;
      }
    }

    const tScore = timeScore(recipe.cook_time_minutes);
    const total = Math.round(matchRate * 0.6 + urgency * 0.25 + tScore * 0.15);

    let reason: string;
    if (missing.length === 0) {
      reason = urgentIngredient
        ? `모든 재료를 보유하고 있고, ${urgentIngredient} 소비기한이 얼마 남지 않았어요.`
        : "집에 있는 재료만으로 만들 수 있어요.";
    } else {
      reason = `${missing.join(", ")}만 있으면 만들 수 있어요.`;
    }

    return {
      recipeId: recipe.id,
      title: recipe.title,
      description: recipe.description ?? "",
      servings: recipe.servings,
      cookTimeMinutes: recipe.cook_time_minutes,
      kidFriendly: recipe.kid_friendly === 1,
      spicyLevel: recipe.spicy_level,
      cuisineType: recipe.cuisine_type,
      cookingMethod: recipe.cooking_method,
      isDiet: recipe.is_diet === 1,
      isBabyFood: recipe.is_baby_food === 1,
      score: total,
      matchRate,
      missing,
      reason,
    };
  });

  const filtered = results.filter((r) => {
    if (filters.maxTime && r.cookTimeMinutes > filters.maxTime) return false;
    if (filters.kidFriendlyOnly && !r.kidFriendly) return false;
    if (filters.noShopping && r.missing.length > 0) return false;
    if (filters.cuisineType && r.cuisineType !== filters.cuisineType) return false;
    if (filters.cookingMethod && r.cookingMethod !== filters.cookingMethod) return false;
    if (filters.spicyOnly && r.spicyLevel < 1) return false;
    if (filters.dietOnly && !r.isDiet) return false;
    if (filters.babyFoodOnly && !r.isBabyFood) return false;
    return true;
  });

  return filtered.sort((a, b) => b.score - a.score);
}
