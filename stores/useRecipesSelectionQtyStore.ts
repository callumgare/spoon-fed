import { createGlobalState } from "@vueuse/core";
import type { Recipe } from "~/lib/paprika/types";
import { wrapWithPropertyChangeWatcher } from "~/lib/utils/reactivity";

const selectedItemsMenuUid = "spoon-fed-synced-items"

export const useRecipesSelectionQtyStore = createGlobalState(() => {
	const paprika = usePaprika()
  const { getRecipe } = useRecipes();

  watch(paprika, () => {
    if (paprika.value) {
      ensureMenuExists() // Deliberately don't await this so we don't make recipe selection wait on menu creation
      loadPerviouslySelectedRecipes()
    }
  }, {immediate: true})

  function updatePaprikaMenuItem(recipeId: string, oldValue: number | undefined, newValue: number) {
    const recipe = getRecipe(recipeId)
    if (!recipe) {
      throw Error(`Attempted to update the qty of recipe "${recipeId}" but such a recipe does not appear to exist`)
    }
    logger.info(`New selection qty for recipe "${recipe.name}" is ${newValue}`)
    if (paprika.value) {
      upsertMenuItem(recipe, newValue)
    }
  }

  async function loadPerviouslySelectedRecipes(): Promise<void> {
    if (!paprika.value) return
    const menuItems = await paprika.value.menuItems({ cacheTtl: 0 })
    const selectedMenuItems = menuItems.filter(menuItem => 
      (menuItem.menu_uid === selectedItemsMenuUid)
      && (menuItem.day === 1)
    )

    const newStoreValues: Record<string, number> = {
      ...recipesSelectionQtyStore.value
    }
    
    for (const menuItem of selectedMenuItems) {
      if (menuItem.recipe_uid) {
        newStoreValues[menuItem.recipe_uid] = 1
      }
    }
  
    recipesSelectionQtyStore.value = wrapWithPropertyChangeWatcher(newStoreValues, updatePaprikaMenuItem)
  }

  async function ensureMenuExists(): Promise<void> {
    if (!paprika.value) return
    await paprika.value.upsertMenus([
      {
        "name": "Spoon Fed - Selected Recipes",
        "days": 1,
        "deleted": false,
        "order_flag": 999,
        "uid": selectedItemsMenuUid,
        "notes": "This list mirrors which recipes are selected in Spoon Fed"
      }
    ])
  }

  async function upsertMenuItem(recipe: Recipe, selectionQty: number): Promise<void> {
    if (!paprika.value) return
    await paprika.value.upsertMenuItems([
      {
        "order_flag": 0,
        "name": recipe.name,
        "menu_uid": selectedItemsMenuUid,
        "deleted": !selectionQty,
        "uid": `${recipe.uid}-sf`,
        "recipe_uid": recipe.uid,
        "day": 1,
        "type_uid": null
      }
    ])
  }

  const recipesSelectionQtyStore = ref<Record<string, number>>(
    wrapWithPropertyChangeWatcher({}, updatePaprikaMenuItem)
  )

  return recipesSelectionQtyStore
});
