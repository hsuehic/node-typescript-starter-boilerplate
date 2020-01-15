import { getFromStorage } from '../utils/storage';
import { StorageState } from '../types/types';
import {
  KEY_STORAGE_PROJECTS,
  KEY_STORAGE_SELECTED_APIS,
  KEY_STORAGE_PROXIES,
  KEY_STORAGE_SELECTED_PROXIES,
} from './constant';
import { isSameHost } from '../utils/url';

let listener: (
  details: chrome.webRequest.WebRequestBodyDetails,
) => void | chrome.webRequest.BlockingResponse;
async function updateProxyConfig() {
  const persistedStates = (await getFromStorage<StorageState>()) || {
    [KEY_STORAGE_PROJECTS]: {},
    [KEY_STORAGE_SELECTED_APIS]: {},
  };
  const projects = persistedStates[KEY_STORAGE_PROJECTS] || {};
  const apis = persistedStates[KEY_STORAGE_SELECTED_APIS] || {};
  const extraProxies = persistedStates[KEY_STORAGE_PROXIES] || {};
  const selectedExtraProxies = persistedStates[KEY_STORAGE_SELECTED_PROXIES] || [];

  if (listener) {
    chrome.webRequest.onBeforeRequest.removeListener(listener);
  }
  listener = function(details: chrome.webRequest.WebRequestBodyDetails) {
    const keys = Object.keys(projects);
    const url = new URL(details.url);

    // firstly, match mock proxies, if not matched, then match extra proxies

    // match mock proxies
    const matchedKeys = keys.reduce((prev: string[], k: string) => {
      if (projects[k].origin == url.protocol + '//' + url.host) {
        prev.push(k);
      }
      return prev;
    }, []);
    if (matchedKeys && matchedKeys.length > 0) {
      for (let i = 0; i < matchedKeys.length; i++) {
        const key = matchedKeys[i];
        const apiArr = apis[key];
        if (apiArr) {
          const api = apiArr.find(a => a.pathname === url.pathname && a.method === details.method);
          if (api) {
            const mockProject = projects[key];
            const { platform, project } = mockProject;
            const { namespace } = project;
            const redirectUrl = `${platform}/mock/${namespace}${api.pathname}`;
            return {
              redirectUrl: redirectUrl,
            };
          }
        }
      }
    }

    // match extra proxies
    if (selectedExtraProxies && selectedExtraProxies.length > 0) {
      for (const k of selectedExtraProxies) {
        const proxy = extraProxies[`${k}`];
        if (proxy) {
          const { pathRewrites } = proxy;
          const urlOrigin = new URL(proxy.origin);
          if (isSameHost(url, urlOrigin)) {
            if (pathRewrites && pathRewrites.length > 0) {
              for (const pr of proxy.pathRewrites) {
                const reg = new RegExp(`^${pr.oldPath}`);
                const matches = reg.exec(url.pathname);
                if (matches) {
                  const newPathname = url.pathname.replace(reg, pr.newPath);
                  return {
                    redirectUrl: `${proxy.target}${newPathname}${url.search}${url.hash}`,
                  };
                }
              }
            } else {
              return {
                redirectUrl: `${proxy.target}${url.pathname}${url.search}${url.hash}`,
              };
            }
          }
        }
      }
    }
  };
  chrome.webRequest.onBeforeRequest.addListener(
    listener,
    {
      urls: ['<all_urls>'],
    },
    ['blocking'],
  );
}

//   const data = `function FindProxyURL(url, host) {
//         var projects = ${JSON.stringify(projects)};
//         var apis = ${JSON.stringify(apis)};
//         var projectKeys = Object.keys(projects);

//         const k = projectKeys.find(function (key) {
//           var mockProject = projects[key];
//           return mockProject.origin == url.protocol + "//" + url.host;
//         });
//         if (k) {
//           var apiArr = apis[k];
//           if (apiArr) {
//             var api = apiArr.find(function (api) {
//               return url.pathname.indexOf(api.pathname) > -1;
//             });
//             if (api) {
//               var p = projects[k];
//               var targetUrl = new URL(p.platform);
//               return "PROXY " + targetUrl.host + "; DIRECT";
//             }
//           }
//         }
//         return "DIRECT";
//       }`;
//   const config = {
//     mode: 'pac_script',
//     pacScript: {
//       data: data,
//     },
//   };
//   chrome.proxy.settings.set({ value: config, scope: 'regular' }, function() {
//     console.log('FindProxyURL:');
//     console.log(data);
//   });
// }

async function init() {
  await updateProxyConfig();
  chrome.storage.onChanged.addListener(
    async (_changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync') {
        await updateProxyConfig();
      }
    },
  );
}

init();
