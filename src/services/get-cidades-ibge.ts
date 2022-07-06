import axios from "axios";
import { magenta, red } from "chalk";

type Regiao = {
  id: number;
  sigla: string;
  nome: string;
};

type UF = {
  id: number;
  sigla: string;
  nome: string;
  regiao: Regiao;
};

type Mesorregiao = {
  id: number;
  nome: string;
  UF: UF;
};

type Microrregiao = {
  id: number;
  nome: string;
  mesorregiao: Mesorregiao;
};

type RegiaoIntermediaria = {
  id: number;
  nome: string;
  UF: UF;
};

type RegiaoImediata = {
  id: number;
  nome: string;
  "regiao-intermediaria": RegiaoIntermediaria;
};

interface CidadeIBGE {
  id: string;
  nome: string;
  microrregiao: Microrregiao;
  "regiao-imediata": RegiaoImediata;
}

export interface Cidade {
  nome: string;
  estado: string;
  uf: string;
}

export async function getCidadesIBGE() {
  console.log("[•] Carregando as cidades da API do IBGE...");
  const URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP/municipios";
  let cidades: Array<Cidade>;

  try {
    const response = await axios.get(URL);
    const data: Array<CidadeIBGE> = response.data;
    cidades = data.map((cidade) => {
      return {
        nome: cidade.nome,
        estado: cidade.microrregiao.mesorregiao.UF.nome,
        uf: cidade.microrregiao.mesorregiao.UF.sigla
      };
    });
    console.log(magenta("[•]"), "CIDADES:", magenta(cidades.length));
    return cidades;
  } catch (e) {
    console.log(red("[X]"), "Erro ao carregar as cidades da API do IBGE");
    return false;
  }
}
