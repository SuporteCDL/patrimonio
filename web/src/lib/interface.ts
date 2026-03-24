export interface ILocalidade {
  id: number;
  descricao: string; 
}

export interface IGrupo {
  id: number;
  descricao: string;
}

export interface ISubGrupo {
  id: number;
  codgrupo: number;
  descricao: string;
}

export interface IMarca {
  id: number;
  descricao: string;
}

export interface ICentroCusto {
  id: number;
  descricao: string;
}

export interface IAtivo {
  id: number;
  codigo: string;
  status: string;
  motivo_baixa: string;
  descricao: string;
  aquisicao: string;
  valor_aquisicao: number;
  valor_atual: number;
  depreciacao: number;
  codsubgrupo: number;
  codcentrocusto: number;
  codmarca: number;
  encontrado: boolean;
  codlocalidade: number;
  responsavel: string;
}

export interface ISituacao {
  id: number;
  situacao: string;
}

export interface IAtivoJoin {
  id: number
  codigo: string
  status: string
  motivo_baixa: string;
  descricao: string
  aquisicao: string
  valor_aquisicao: number
  valor_atual: number
  depreciacao: number
  codsubgrupo: number
  codcentrocusto: number
  codmarca: number
  codlocalidade: number
  encontrado: boolean
  localidade: string
  subgrupo: string
  centrocusto: string
  marca: string
  responsavel: string
}

export interface IUsuario {
  id: number;
  nome: string;
  email: string;
  password: string;
}

export interface IConferencia {
  id: number
  descricao: string
  data_inicio: Date
  data_fim: Date
  responsavel: string
  status: string
}

export interface IConferenciaItem {
  id: number
  conferencia_id: number
  patrimonio_id: number
  encontrado: boolean
  observacao?: string | undefined
  data_verificacao?: Date | undefined
}
