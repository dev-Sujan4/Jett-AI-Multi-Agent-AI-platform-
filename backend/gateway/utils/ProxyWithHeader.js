import proxy from "express-http-proxy";

export const ProxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
      parseReqBody: false,
      limit: "50mb",
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts
    },
  });
};
