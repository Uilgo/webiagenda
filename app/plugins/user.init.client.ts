import { watchEffect } from "vue";
import type { User } from "@supabase/supabase-js";
import type { Profile, ProfissionalRPC } from "../../shared/types/database";
import { useUserStore } from "../../stores/user";
import { useAgendamentoStore } from "../../stores/agendamento";
import { useProfissionais } from "../composables/core/useProfissionais";
import { useAgendamento } from "../composables/core/useAgendamento";

export default defineNuxtPlugin(() => {
  const userStore = useUserStore();
  const supabaseUser = useSupabaseUser();
  const supabase = useSupabaseClient();

  watchEffect(async () => {
    if (supabaseUser.value) {
      userStore.setUser(supabaseUser.value as User);
  
      // Fetch profile usando supabaseUser diretamente
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", supabaseUser.value.id)
        .single();
  
      if (profileError) {
        console.error("Erro ao buscar profile:", profileError);
      } else if (profileData) {
        userStore.setProfile(profileData as Profile);
  
        // Se o servidor já preencheu o profissional no store (SSR hydration), não refetch
        if (userStore.profissional) {
          return;
        }
  
        // Use o composable centralizado para obter profissionais (evita duplicação de RPC)
        try {
          const profissionaisComposable = useProfissionais();
  
          // Se o store já tiver a lista (serializada pelo SSR), inicializa o composable com ela
          if (
            userStore.profissionais &&
            userStore.profissionais.length > 0 &&
            (!profissionaisComposable.profissionais.value ||
              profissionaisComposable.profissionais.value.length === 0)
          ) {
            profissionaisComposable.profissionais.value =
              userStore.profissionais;
            profissionaisComposable.fetched.value = true;
          }
  
          // Caso o composable ainda não tenha dados, faz fetch (será deduplicado pelo composable)
          if (!profissionaisComposable.fetched.value) {
            await profissionaisComposable.fetchProfissionais();
          }
  
          const profissionaisList = profissionaisComposable.profissionais.value;
          const profile = profileData as Profile;
  
          let selectedProfissional: ProfissionalRPC | null = null;
  
          // Tenta carregar profissional selecionado persistido
          if (typeof window !== "undefined") {
            try {
              const persistedIdStr = localStorage.getItem("selectedProfissionalId");
              if (persistedIdStr) {
                const persistedId = Number(persistedIdStr);
                selectedProfissional = profissionaisList.find(
                  (p: ProfissionalRPC) => p.id_do_profissional === persistedId
                ) || null;
              }
            } catch (e) {
              console.error("Erro ao carregar selectedProfissionalId do localStorage:", e);
            }
          }
  
          // Se não há persistido válido, fallback para o profissional do usuário logado
          if (!selectedProfissional) {
            selectedProfissional = profissionaisList.find(
              (p: ProfissionalRPC) => p.id_do_perfil === profile.id
            ) || null;
          }

          if (selectedProfissional) {
            userStore.setProfissional(selectedProfissional);
            const { fetchAllAgendamentosByProfissional } = useAgendamento();
            if (selectedProfissional.id_do_profissional) {
              fetchAllAgendamentosByProfissional(selectedProfissional.id_do_profissional).catch((e) => {
                console.error("Erro ao inicializar agendamentos para o profissional selecionado:", e);
              });
            }
          }
        } catch (e) {
          console.error("Erro ao buscar profissionais via composable:", e);
        }
      }
    } else {
      userStore.clearUser();
      if (typeof window !== "undefined") {
        localStorage.removeItem("selectedProfissionalId");
      }
    }
  });
});
