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

          // Verifica se já existe um profissional definido no store (ex.: vindo do SSR)
          const existingProfissional = userStore.profissional;
          const serverProfIsValid =
            !!existingProfissional &&
            profissionaisList.some(
              (p: ProfissionalRPC) =>
                p.id_do_profissional ===
                (existingProfissional as ProfissionalRPC).id_do_profissional
            );

          let selectedProfissional: ProfissionalRPC | null = null;

          // Se o servidor já definiu um profissional válido, respeita esse valor (prioridade)
          if (serverProfIsValid) {
            selectedProfissional = existingProfissional as ProfissionalRPC;
          } else {
            // Tenta carregar profissional selecionado persistido (client-side)
            if (typeof window !== "undefined") {
              try {
                const persistedIdStr = localStorage.getItem(
                  "selectedProfissionalId"
                );
                if (persistedIdStr) {
                  const persistedId = Number(persistedIdStr);
                  selectedProfissional =
                    profissionaisList.find(
                      (p: ProfissionalRPC) =>
                        p.id_do_profissional === persistedId
                    ) || null;
                }
              } catch (e) {
                console.error(
                  "Erro ao carregar selectedProfissionalId do localStorage:",
                  e
                );
              }
            }

            // Se não há persistido válido, fallback para o profissional do usuário logado
            if (!selectedProfissional) {
              selectedProfissional =
                profissionaisList.find(
                  (p: ProfissionalRPC) => p.id_do_perfil === profile.id
                ) || null;
            }
          }

          // Se encontramos um profissional selecionado e ele é diferente do atual do store, atualiza
          if (selectedProfissional) {
            const currentId = userStore.profissional?.id_do_profissional;
            const newId = selectedProfissional.id_do_profissional;
            // Só define se for diferente ou se não havia antes (evita sobreescrever o valor vindo do SSR)
            if (!currentId || currentId !== newId) {
              userStore.setProfissional(selectedProfissional);
            }
            const { fetchAllAgendamentosByProfissional } = useAgendamento();
            if (newId) {
              fetchAllAgendamentosByProfissional(newId).catch((e) => {
                console.error(
                  "Erro ao inicializar agendamentos para o profissional selecionado:",
                  e
                );
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
