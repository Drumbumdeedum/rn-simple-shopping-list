import { User } from "@/types";
import { supabase } from "@/utils/initSupabase";

export const fetchUserById = async (id: string): Promise<User> => {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", id)
    .single();
  return data;
};
