export interface User {
  id: string;
  email: string;
  updated_at: string;
}

export interface ShoppingListAccessWithListsResponse {
  user_id: string;
  shopping_list_id: string;
  shopping_lists: ShoppingList[];
}

export interface ShoppingList {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
}

export interface ShoppingListAccess {
  id: string;
  created_at: string;
  user_id: string;
  shopping_list_id: string;
}

export interface ShoppingListItem {
  id: string;
  created_at: string;
  shopping_list_id: string;
  name: string;
  checked: boolean;
}

export interface Friend {
  created_at: string;
  user_id: string;
  friend_id: string;
  accepted: boolean;
}

export interface FriendStatus {
  id: string;
  email: string;
  accepted: boolean;
}
