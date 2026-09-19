import proxy from "express-http-proxy";

export const ProxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
      parseReqBody: false,
      limit: "50mb",
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["x-user-id"] = srcReq.user?.userId || "demo-user";
      return proxyReqOpts;
    },
  });
};
