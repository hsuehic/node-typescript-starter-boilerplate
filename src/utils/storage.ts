import { ModalsObject } from '../types/types';

export const mapToObj = <T>(map: Map<string, T>): ModalsObject<T> => {
  const entry = map.entries();
  const obj: ModalsObject<T> = {};
  for (const [key, value] of entry) {
    obj[key] = value;
  }
  return obj;
};

export const objToMap = <T>(obj: ModalsObject<T>) => {
  const map = new Map<string, T>();
  const keys = Object.keys(obj);
  keys.forEach((key: string) => {
    map.set(key, obj[key]);
  });
  return map;
};

export const getFromStorage = <T>(): Promise<T> => {
  return new Promise(resolve => {
    chrome.storage.sync.get(items => {
      resolve(items as T);
    });
  });
};

export const saveToStorage = (items: { [key: string]: any }): Promise<void> => {
  return new Promise(resolve => {
    chrome.storage.sync.set(
      {
        ...items,
      },
      () => {
        resolve();
      },
    );
  });
};
