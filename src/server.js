import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

// GET => Buscar uma informação do back-end
// POST => Criar uma informação no back-end
// PUT => Atualizar uma informação no back-end
// DELETE => Deletar uma informação no back-end
// PATCH =>  Atualizar uma informação específica de uma recurso no back-end

// Stateful - Stateless

// Query Parameters: URL Stateful -> paginação, filtros...
// Route Parameters:(URL) identificação de recurso
// Request body: Envio de informações de um formulário

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);
    console.log();
    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
