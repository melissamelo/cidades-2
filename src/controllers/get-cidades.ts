import { Context, Next } from "koa";
import { getCidadesService } from "../services/get-cidades-service";
import { searchWikipedia } from "../utils/search-wikipedia";

export async function getCidades(ctx: Context, next: Next) {
  const cidades = await searchWikipedia([
    {nome: "Adamantina", estado: "São Paulo", uf: "SP"},
    {nome: "Adolfo", estado: "São Paulo", uf: "SP"},
    {nome: "Águas de Lindóia", estado: "São Paulo", uf: "SP"}
  ], "");
  console.log("<-- GET /cidades");
  ctx.status = 200;
  ctx.body = { message: "Success" };
  await next();
}
