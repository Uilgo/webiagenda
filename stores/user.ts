import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../shared/types/database";
import { useAgendamentoStore } from "./agendamento";

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
    const agStore = useAgendamentoStore();
    const currentId = profissional.value?.id_do_profissional;
    profissional.value = newProfissional;
    if (typeof window !== "undefined") {
      if (newProfissional && newProfissional.id_do_profissional) {
        const newId = newProfissional.id_do_profissional;
        localStorage.setItem("selectedProfissionalId", newId.toString());
        // If changing to a different professional, clear the agendamentos map
        if (currentId && currentId !== newId) {
          agStore.clearAgendamentos();
        }
      } else {
        localStorage.removeItem("selectedProfissionalId");
        // If clearing, clear agendamentos
        agStore.clearAgendamentos();
      }
    }
  };
  
  const clearUser = () => {
    user.value = null;
    profile.value = null;
    profissional.value = null;
    profissionais.value = [];
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedProfissionalId");
    }
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
