import type { User } from "@supabase/supabase-js";
import type { Profile } from "../../shared/types/database";
import { useUserStore } from "../../stores/user";

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  const supabaseUser = useSupabaseUser();
  const supabase = useSupabaseClient();

  if (supabaseUser.value) {
    userStore.setUser(supabaseUser.value as User);
    
    // Fetch profile usando supabaseUser diretamente
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', supabaseUser.value.id)
      .single();

    if (error) {
      console.error('Erro ao buscar profile:', error);
    } else if (data) {
      userStore.setProfile(data as Profile);
    }
  }
});
