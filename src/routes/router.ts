import Router from "koa-router";
import { getCidades } from "../controllers/get-cidades";

const router = new Router();

router.get("/cidades", getCidades);

export { router };
