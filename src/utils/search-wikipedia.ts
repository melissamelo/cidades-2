import wikipedia from "wikijs";
import { green } from "chalk";

type Cidade = {
  nome: string;
  estado: string;
  uf: string;
};

type CidadeWikipedia = {
  nome: string;
  estado: string;
  uf: string;
  wikipedia: {
    nome?: string;
    idh?: string;
    populacao?: number;
  };
};

type Info = {
  general: object
}

type CidadeInfo = {
  nome: string;
  idh: string;
}

function haveInfo(object: object): object is Info {
  return "general" in object;
}

function isCidade(object: object): object is CidadeInfo {
  return "idh" in object;
}

function handlePopulacao(substr: string) {
  const regex = /[a-zA-Z.,]/g;
  const str = substr.replaceAll(" ", "").replaceAll(regex, "");
  const arr = str.split("");
  return Number(arr.join(""));
}

export async function searchWikipedia(cidades: Array<Cidade>, searchString: string) {
  const data = [];
  for (let i = 0; i < cidades.length; i ++) {
    console.log(`[•] Buscando cidade ${cidades[i].nome} - ${cidades[i].uf} na Wikipedia...`);
    const search = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).search(cidades[i].nome);
    const { results } = search;
    console.log(`[•] Buscando o resultado correto da pesquisa...`);
    for (let j = 0; j < results.length; j++) {
      const page = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).page(results[j]);
      let info: object;
      let found: boolean;
      let content: string;
      let populacao: number;
      try {
        info = await page.fullInfo();
        if (haveInfo(info)) {
          if (isCidade(info.general)) {
            found = true;
            console.log(`[•] Página ${j + 1} (${results[j]})`, green("corresponde"),`à pesquisa!`);
            try {
              content = await page.rawContent();
              if (content.includes("habitantes")) {
                const index = content.indexOf("habitantes");
                const substr = content.substring(index - 10, index - 1);
                populacao = handlePopulacao(substr);
              }
            } catch (e) {
              content = "";
            }
            data.push({ 
              nome: cidades[i].nome, 
              estado: cidades[i].estado, 
              uf: cidades[i].uf, 
              wikipedia: {
                nome: info.general.nome || null,
                idh: info.general.idh || null,
                populacao: populacao || null
              } 
            });
          } else {
            found = false;
            console.log(`[•] Página ${j + 1} (${results[j]}) não corresponde à pesquisa.`)
          }
        }
      } catch (e) {
        info = {};
        found = false;
      }
      if (found) break;
    }
  }
  console.log(data);










  // const getCidades = cidades.map(async (cidade, index) => {
  //   console.log(`[•] Buscando cidade ${cidade.nome} - ${cidade.uf} na Wikipedia...`);
  //   const search = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).search(cidade.nome);
  //   const { results } = search;
  //   console.log(`[•] Buscando o resultado correto da pesquisa...`);
  //   console.log(results)
    // const data = results.map(async (result) => {
    //   const page = await wikipedia({ apiUrl: 'https://pt.wikipedia.org/w/api.php' }).page(result);
    //   let info: object;
    //   let found: boolean;
    //   let content: string;
    //   let populacao: number;
    //   try {
    //     info = await page.fullInfo();
    //     if (haveInfo(info)) {
    //       if (isCidade(info.general)) {
    //         found = true;
    //         console.log(`[•] Página correta encontrada!`);
    //         try {
    //           content = await page.rawContent();
    //           if (content.includes("habitantes")) {
    //             const index = content.indexOf("habitantes");
    //             const substr = content.substring(index - 10, index - 1);
    //             populacao = handlePopulacao(substr);
    //           }
    //         } catch (e) {
    //           content = "";
    //         }
    //         return { 
    //           nome: cidade.nome, 
    //           estado: cidade.estado, 
    //           uf: cidade.uf, 
    //           wikipedia: {
    //             nome: info.general.nome || null,
    //             idh: info.general.idh || null,
    //             populacao: populacao || null
    //           } 
    //         };
    //       } else {
    //         return false;
    //       }
    //     }
    //   } catch (e) {
    //     info = {};
    //     return false;
    //   }
    // });

    // console.log(data);
  // });

  // return getCidades || false;

  return data || false;
}
