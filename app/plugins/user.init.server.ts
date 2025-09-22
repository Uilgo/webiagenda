import type { User } from "@supabase/supabase-js";
import type { Profile } from "../../shared/types/database";
import { useUserStore } from "../../stores/user";

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  const supabase = useSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userStore.setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar profile no servidor:', error);
      } else if (data) {
        userStore.setProfile(data as Profile);
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar user no servidor:', error);
  }
});