import { ref } from "vue";
import type { UserProfileRPC } from "../../../shared/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useUsers = () => {
  const users = ref<UserProfileRPC[]>([]);

  const fetchUsers = async () => {
    const client = useSupabaseClient() as SupabaseClient;
    const { data, error } = await client.rpc("get_all_profiles_if_admin");

    if (error) {
      console.error("Erro ao buscar usuários:", error);
      throw error;
    }

    try {
      if (!data) {
        users.value = [];
        return;
      }

      if (Array.isArray(data)) {
        users.value = data.map((d: any) => ({
          id: d.id,
          nome: d.nome ?? null,
        })) as UserProfileRPC[];
      } else if (typeof data === "object") {
        users.value = [data as UserProfileRPC];
      } else {
        users.value = [];
      }
    } catch (e) {
      console.error(
        "Erro ao normalizar retorno de get_all_profiles_if_admin:",
        e,
        data
      );
      users.value = [];
    }
  };

  return {
    users,
    fetchUsers,
  };
};
