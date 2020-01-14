/**
 * determine whether to URL contain the same host
 * @param url1 {URL}
 * @param url2 {URL}
 */
export const isSameHost = (url1: URL, url2: URL): boolean => {
  return (
    url1.protocol === url2.protocol && url1.hostname === url2.hostname && url1.port === url2.port
  );
};
