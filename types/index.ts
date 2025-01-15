export interface User {
  id: string;
  updated_at: string;
}

export interface ShoppingListAccessWithListsResponse {
  profile_id: string;
  shopping_list_id: string;
  shopping_lists: {
    id: string;
    created_at: string;
    creator_profile_id: string;
    name: string;
  }[];
}

export interface ShoppingList {
  id: string;
  created_at: string;
  creator_profile_id: string;
  name: string;
}
