import type { User } from "@supabase/supabase-js";
import type { Profile, ProfissionalRPC } from "../../shared/types/database";
import { useUserStore } from "../../stores/user";
import { useAgendamentoStore } from "../../stores/agendamento";

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  const supabase = useSupabaseClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userStore.setUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar profile no servidor:", profileError);
      } else if (profileData) {
        userStore.setProfile(profileData as Profile);

        // --- Hidratar profissionais e profissional atual ---
        try {
          const profileId = (profileData as Profile).id ?? null;
          if (profileId != null) {
            const { data: profData, error: profError } = await supabase.rpc(
              "get_profissionais"
            );
            if (profError) {
              console.error(
                "Erro ao chamar RPC get_profissionais no servidor:",
                profError
              );
            } else if (profData) {
              try {
                // profData pode ser array ou objeto; normalizamos para array
                const profsArray = Array.isArray(profData)
                  ? (profData as any[])
                  : [profData as any];

                // Normaliza para ProfissionalRPC
                const profissionaisNormalizados: ProfissionalRPC[] =
                  profsArray.map((p: any) => ({
                    nome_do_profissional:
                      p.nome_do_profissional ?? p.nome ?? null,
                    especialidade_do_profissional:
                      p.especialidade_do_profissional ??
                      p.especialidade ??
                      null,
                    id_do_profissional: p.id_do_profissional ?? p.id ?? null,
                    id_do_perfil: p.id_do_perfil ?? p.id_perfil ?? null,
                    id_da_especialidade:
                      p.id_da_especialidade ?? p.id_especialidade ?? null,
                  }));

                // Hidrata a lista de profissionais no store
                userStore.setProfissionais(profissionaisNormalizados);

                // Define o profissional no SSR para manter consistência de hidratação
                const found = profissionaisNormalizados.find(
                  (p: ProfissionalRPC) => {
                    return Number(p.id_do_perfil) === Number(profileId);
                  }
                );
                if (found) {
                  userStore.setProfissional(found);
                }
              } catch (e) {
                console.error(
                  "Erro ao processar retorno de get_profissionais:",
                  e,
                  profData
                );
              }
            }
          }
        } catch (e) {
          console.error("Erro ao hidratar profissionais no servidor:", e);
        }

        // --- Tentar hidratar agendamentos para o profissional correspondente ---
        // Nota: Como profissional não é definido no SSR, não hidrata agendamentos aqui; client fará
        try {
          const agendamentoStore = useAgendamentoStore();
          const profissionalId =
            userStore.profissional?.id_do_profissional ?? null;
          if (profissionalId) {
            const { data: agendamentos, error: agError } = await supabase
              .from("agendamentos")
              .select("*")
              .eq("profissionais_id", profissionalId)
              .eq("cancelado", false)
              .order("data", { ascending: true })
              .order("hora_inicio", { ascending: true });

            if (!agError && agendamentos) {
              agendamentoStore.setAgendamentosForProfissional(
                Number(profissionalId),
                agendamentos as any
              );
            } else if (agError) {
              console.error(
                "Erro ao buscar agendamentos no servidor:",
                agError
              );
            }
          }
        } catch (e) {
          console.error("Erro ao hidratar agendamentos no servidor:", e);
        }
        // Observação: removemos a execução do RPC `get_profissionais` no plugin do
        // servidor para evitar duplicação com a chamada que será feita no cliente.
        // O composable `useProfissionais` deve ser usado no cliente para buscar
        // e centralizar a execução da RPC (com deduplicação interna).
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar user no servidor:", error);
  }
});
