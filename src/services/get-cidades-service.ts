import wikipedia from "wikijs";
import { getCidadesIBGE } from "./get-cidades-ibge";
import { yellow } from "chalk";

type CidadeInfo = {
  general: {
    nome: string;
    idh: string;
  };
};

function hasCidadeInfo(object: object): object is CidadeInfo {
  return "general" in object;
}

function handlePopulacao(substrPop: string) {
  const regex = /[a-zA-Z.,]/g;
  const strSpace = substrPop.replaceAll(" ", "");
  const str = strSpace.replaceAll(regex, "")

  const arr = str.split("");

  return Number(arr.join(""));
}

export async function getCidadesService() {
  const cidadesIBGE = await getCidadesIBGE();

  if (cidadesIBGE) {
    const cidades = [];
    const cidadesIncompletas = [];
    let populacao: number;

    for (let i = 0; i < 10; i++) {
      console.log(`[•] Buscando cidade ${cidadesIBGE[i].nome} na Wikipedia...`);
      const searchCidade = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).search(cidadesIBGE[i].nome);

      console.log(`[•] Pegando a página do primeiro resultado: (${searchCidade.results[0]})...`);
      const cidadePage = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).page(searchCidade.results[0]);

      console.log(`[•] Lendo a página...`);
      let cidadeInfo: object;
      let cidadeContent: string;

      try {
        cidadeInfo = await cidadePage.fullInfo();
      } catch (e) {
        cidadeInfo = {};
      }

      try {
        cidadeContent = await cidadePage.rawContent();
      } catch (e) {
        cidadeContent = "";
      }

      if (cidadeContent && cidadeContent.includes("habitantes")) {
        const indexOfHab = cidadeContent.indexOf("habitantes");
        const substrHab = cidadeContent.substring(indexOfHab - 10, indexOfHab - 1);
        populacao = handlePopulacao(substrHab);
      }

      if (cidadeInfo && hasCidadeInfo(cidadeInfo)) {
        if (!cidadeInfo.general.nome || !cidadeInfo.general.idh || !populacao) {
          cidadesIncompletas.push({ nome: cidadesIBGE[i].nome, uf: cidadesIBGE[i].uf })
        } else {
          cidades.push({ nome: cidadeInfo.general.nome, idh: cidadeInfo.general.idh, populacao: populacao });
        }
      }
    }

    if (cidadesIncompletas.length > 0) {
      for (let i = 0; i < cidadesIncompletas.length; i++) {
        console.log(cidadesIncompletas);
        console.log(i)
        console.log(`[•] Buscando`, yellow("novamente"), `a cidade ${cidadesIncompletas[i].nome} na Wikipedia...`);
        const searchCidade = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).search(`cidade ${cidadesIncompletas[i].nome} ${cidadesIncompletas[i].uf}`);

        console.log(`[•] Pegando`, yellow("novamente"), `a página do primeiro resultado: (${searchCidade.results[0]})...`);
        const cidadePage = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).page(searchCidade.results[0]);

        console.log(`[•] Lendo`, yellow("novamente"), `a página...`);
        let cidadeInfo: object;
        let cidadeContent: string;

        try {
          cidadeInfo = await cidadePage.fullInfo();
        } catch (e) {
          cidadeInfo = {};
        }
  
        try {
          cidadeContent = await cidadePage.rawContent();








        } catch (e) {
          cidadeContent = "";
        }
  
        if (cidadeContent && cidadeContent.includes("habitantes")) {
          const indexOfHab = cidadeContent.indexOf("habitantes");
          const substrHab = cidadeContent.substring(indexOfHab - 10, indexOfHab - 1);
          populacao = handlePopulacao(substrHab);
        }
  
        if (cidadeInfo && hasCidadeInfo(cidadeInfo)) {
          if (!cidadeInfo.general.nome || !cidadeInfo.general.idh || !populacao) {
            // cidadesIncompletas.push({ nome: cidadesIBGE[i].nome, uf: cidadesIBGE[i].uf })
          } else {
            cidades.push({ nome: cidadeInfo.general.nome, idh: cidadeInfo.general.idh, populacao: populacao });
            // cidadesIncompletas.splice(i, 1)
          }
        }
      }
    }

    console.log(`[•] Cidades completas:`);
    console.log(cidades);
    console.log("---------------------------------------------------------------");
    console.log(`[•] Cidades incompletas:`);
    console.log(cidadesIncompletas);
    console.log(`[•] Cidades com dados completos: ${cidades.length}`);
    console.log(`[•] Cidades com dados incompletos: ${cidadesIncompletas.length}`);
    return cidades;
  } else {
    return false;
  }
}