<template>
  <div class="flex flex-col items-center justify-center">
    <h2 class="text-xl font-bold text-gray-800">
      {{ profissional?.nome_do_profissional || "Nome não disponível" }}
    </h2>
    <p class="text-base text-gray-600">
      {{
        profissional?.especialidade_do_profissional ||
        "Especialidade não disponível"
      }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProfissionalRPC } from "../../../../../shared/types/database";
import type { Profile } from "../../../../../shared/types/database";

const user = useSupabaseUser();

const { data: profissional } = await useAsyncData('user-profile', async () => {
  if (!user.value) {
    return null;
  }

  const client = useSupabaseClient();

  // Busca o profile do usuário logado
  const { data: profileData, error: profileError } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", user.value.id)
    .single();

  if (profileError || !profileData) {
    console.error("Erro ao buscar profile:", profileError);
    return null;
  }

  // Busca profissionais via RPC
  const { data: rpcData, error: rpcError } = await client.rpc("get_profissionais");

  if (rpcError) {
    console.error("Erro ao buscar profissionais:", rpcError);
    return null;
  }

  if (!rpcData) {
    return null;
  }

  // Normaliza o retorno para o tipo esperado
  let profissionaisList: ProfissionalRPC[] = [];
  try {
    const rpcDataAny = rpcData as any;
    if (Array.isArray(rpcDataAny)) {
      profissionaisList = rpcDataAny.map((d: any) => ({
        nome_do_profissional: d.nome_do_profissional ?? d.nome ?? null,
        especialidade_do_profissional: d.especialidade_do_profissional ?? d.especialidade ?? null,
        id_do_profissional: d.id_do_profissional ?? d.id ?? null,
        id_do_perfil: d.id_do_perfil ?? d.id_perfil ?? null,
        id_da_especialidade: d.id_da_especialidade ?? d.id_especialidade ?? null,
      })) as ProfissionalRPC[];
    } else if (typeof rpcDataAny === "object" && rpcDataAny !== null) {
      profissionaisList = [rpcDataAny as ProfissionalRPC];
    }
  } catch (e) {
    console.error("Erro ao normalizar profissionais:", e, rpcData);
    return null;
  }

  // Filtra pelo id do profile
  const matchingProfissional = profissionaisList.find(
    (p: ProfissionalRPC) => p.id_do_perfil === (profileData as Profile).id
  );
  return matchingProfissional || profissionaisList[0] || null;
});
</script>
