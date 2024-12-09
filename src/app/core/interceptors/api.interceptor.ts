import { HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environment";

// export const apiInterceptor: HttpInterceptorFn = (req, next) => {
//   // const apiReq = req.clone({ url: `https://api.realworld.io/api${req.url}` });
//   // return next(apiReq);
// };

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};