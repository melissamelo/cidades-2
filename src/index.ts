import Koa from "koa";
import { router } from "./routes/router";
import { green, red } from "chalk";

const koaApp: Koa = new Koa();

const PORT = process.env.PORT || process.env.port || 3000;

koaApp.use(router.routes());

try {
  const server = koaApp.listen(PORT);
  server.on("listening", () => {
    console.log(green("[√]"), "Application", green("api-cidades"), "successfully started");
  });
} catch (e) {
  console.log(red("[X]"), "Application", red("api-cidades"),"startup failed");
  console.log(e);
  process.exit(1);
}
