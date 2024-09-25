import { Request, Response, Router, IRouter } from "express";
import { Gateway } from "../gateway";
import { Logger } from "./logger";
import { Middleware } from "./middleware";
import { logResponseStatus } from "./utils";
/**
 * Enum for the {@link IRouter} methods
 */
type RouterMethod = "get" | "set" | "delete" | "head" | "post";

/**
 * A wrapper to conveniently create endpoints
 * @param {RouterMethod} method type of {@link RouterMethod} eg `get` or `set`
 * @param endpoint the endpoint eg `/` or `/api/hello`
 * @param router the express {@link Router} to bind the route to
 * @param callback the callback to execute when the route is hit
 * @param middlewares collection of middleware to run before the callback
 * ---
 * ## **EXAMPLE**
 * Creating a .ts file in `src/routes/` with a default
 * export of type `(Router, Gateway) => void`, will allow
 * the {@link Gateway} to autoload all routes created with {@link registerHTTP}
 * @example
 * //src/routes/<any>.ts
 * export default (router: Router, gateway: Gateway) => {
 *  registerHTTP("get", "/", router, (req, res) => {
 *    res.send("Hello World!");
 *  });
 * };
 */
export function registerHTTP(
  method: RouterMethod,
  endpoint: string,
  router: Router,
  callback: (req: Request, res: Response) => void,
  middlewares?: Middleware[]
) {
  /*Below runs when Route is Registered by Gateway on Server Start */
  Logger.logGreen(`++ (${method.toUpperCase()}) ${endpoint}`);

  // same as router.get(), etc, just called dynamically and saves using switch/if else
  (router as any)[method](endpoint, (req: Request, res: Response) => {
    /*Below runs before every request */
    // eg: add 'global middleware here, runs before all other middleware'

    /* Core Request Chain*/
    // Recursive middleware chain before running callback
    const runMiddleware = (index: number) => {
      if (index < (middlewares?.length || 0)) {
        middlewares![index](req, res, () => runMiddleware(index + 1));
      } else {
        callback(req, res);
      }
    };
    /* Below runs after every request*/
    res.on("finish", () => {
      if (Gateway.debug) logResponseStatus(res, method, endpoint);
    });
    try {
      // Start request
      runMiddleware(0);
    } catch (error) {
      console.log(error);
    }
  });
}
