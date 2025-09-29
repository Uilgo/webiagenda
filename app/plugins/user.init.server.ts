import type { User } from "@supabase/supabase-js";
import type { Profile } from "../../shared/types/database";
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

        // --- Tentar hidratar agendamentos para o profissional correspondente ---
        try {
          const agendamentoStore = useAgendamentoStore();
          // Procurar o profissional correspondente ao profile.
          // Em vez de confiar em nomes de colunas da tabela (que podem variar),
          // chamamos a RPC `get_profissionais` que já normaliza os campos.
          const profileId = (profileData as Profile).id ?? null;
          if (profileId == null) {
            // não temos id do profile — nada a fazer
          } else {
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
                const found = profsArray.find((p: any) => {
                  // o RPC usa `id_do_perfil`/`id_perfil` — checamos ambas
                  return (
                    Number(p.id_do_perfil ?? p.id_perfil) === Number(profileId)
                  );
                });

                if (found) {
                  const profissionalId =
                    found.id_do_profissional ?? found.id ?? null;
                  if (profissionalId) {
                    const { data: agendamentos, error: agError } =
                      await supabase
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
