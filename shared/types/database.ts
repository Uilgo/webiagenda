/**
 * Tipo Database que define a estrutura dos tipos do banco de dados,
 * incluindo o perfil do usuário. Segue o padrão para tipagem de tabelas.
 */
export type Database = {
  public: {
    Profile: Profile;
    Especialidades: Especialidades;
    Cliente: Cliente;
  };
};

/**
 * Interface Cliente que representa um cliente no sistema.
 */
export interface Cliente {
  id: number;
  created_at: string;
  updated_at: string | null;
  email: string | null;
  cpf: string | null;
  nome: string | null;
  telefone: string | null;
  endereco: string | null;
}

/**
 * Interface Profile que define a estrutura do perfil do usuário no banco de dados.
 * Inclui campos como ID, datas de criação e atualização, ID do usuário associado,
 * nome e role (papel/permissão).
 */
export interface Profile {
  id: number;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
  nome: string | null;
  role: string | null;
}

/**
 * Interface Especialidades que define a estrutura da tabela especialidades no banco de dados.
 * Inclui campos como ID, datas de criação e atualização, e o nome da especialidade.
 */
export interface Especialidades {
  id: number;
  created_at: string;
  updated_at: string | null;
  especialidade: string | null;
}

/**
 * Interface para representar o retorno da RPC `get_profissionais`.
 * Campos seguem o formato retornado pelo banco (snake_case conforme exemplo).
 */
export interface ProfissionalRPC {
  nome_do_profissional: string | null;
  especialidade_do_profissional: string | null;
  id_do_profissional: number | null;
  id_do_perfil: number | null;
  id_da_especialidade: number | null;
}

/**
 * Interface para representar o retorno da RPC `get_all_profiles_if_admin`.
 */
export interface UserProfileRPC {
  id: number;
  nome: string | null;
}
