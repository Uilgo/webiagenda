import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../shared/types/database";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const profile = ref<Profile | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  const setUser = (newUser: User | null, newProfile?: Profile | null) => {
    user.value = newUser;
    if (newProfile) {
      profile.value = newProfile;
    }
  };

  const setProfile = (newProfile: Profile | null) => {
    profile.value = newProfile;
  };

  const clearUser = () => {
    user.value = null;
    profile.value = null;
  };

  return {
    user,
    profile,
    isAuthenticated,
    setUser,
    setProfile,
    clearUser,
  };
});
