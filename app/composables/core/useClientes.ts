import { ref } from "vue";
import type { Cliente, Database } from "../../../shared/types/database";
import { useSupabaseClient } from "#imports";

// Define o tipo para inserção de clientes, removendo campos gerados automaticamente pelo banco
type ClientesInsert = Omit<Cliente, "id" | "created_at" | "updated_at">;

export const useClientes = () => {
  const supabase = useSupabaseClient<Database>();
  const clientes = ref<Cliente[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<any>(null);

  // Função para buscar todos os clientes do banco de dados.
  const fetchClientes = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: apiError } = await supabase
        .from("clientes")
        .select("*");
      if (apiError) throw apiError;
      clientes.value = data as Cliente[];
    } catch (err) {
      error.value = err;
      console.error("Erro ao buscar clientes:", err);
    } finally {
      loading.value = false;
    }
  };

  // Função para adicionar um novo cliente ao banco de dados.
  const addCliente = async (newCliente: ClientesInsert) => {
    // Insere um novo cliente na tabela 'clientes' do Supabase.
    const { data, error } = await supabase
      .from("clientes")
      .insert([newCliente] as any);

    if (error) {
      throw error;
    }
    return data;
  };

  // Função para atualizar um cliente existente no banco de dados.
  const updateCliente = async (id: number, updatedCliente: Partial<Cliente>) => {
    // Evite atualizar 'id', 'created_at' ou 'updated_at'
    const { data, error } = await (supabase
      .from("clientes")
      .update as any)(updatedCliente)
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    // Refetch para atualizar a lista local
    await fetchClientes();

    return data;
  };

  const deleteCliente = async (id: number) => {
    // Função para deletar um cliente existente no banco de dados.
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    // Refetch para atualizar a lista local
    await fetchClientes();

    return { success: true };
  };

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  };
};
