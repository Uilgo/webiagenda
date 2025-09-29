import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../shared/types/database";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const profile = ref<Profile | null>(null);
  const profissional = ref<ProfissionalRPC | null>(null);
  const profissionais = ref<ProfissionalRPC[]>([]);

  const isAuthenticated = computed(() => !!user.value);

  const setUser = (
    newUser: User | null,
    newProfile?: Profile | null,
    newProfissional?: ProfissionalRPC | null
  ) => {
    user.value = newUser;
    if (newProfile) {
      profile.value = newProfile;
    }
    if (newProfissional) {
      profissional.value = newProfissional;
    }
  };

  const setProfissionais = (list: ProfissionalRPC[] = []) => {
    profissionais.value = list;
  };

  const setProfile = (newProfile: Profile | null) => {
    profile.value = newProfile;
  };

  const setProfissional = (newProfissional: ProfissionalRPC | null) => {
    profissional.value = newProfissional;
  };

  const clearUser = () => {
    user.value = null;
    profile.value = null;
    profissional.value = null;
    profissionais.value = [];
  };

  return {
    user,
    profile,
    profissional,
    profissionais,
    isAuthenticated,
    setUser,
    setProfile,
    setProfissional,
    setProfissionais,
    clearUser,
  };
});
