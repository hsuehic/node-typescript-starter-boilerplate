import {
  KEY_STORAGE_PROJECTS,
  KEY_STORAGE_SELECTED_APIS,
  KEY_STORAGE_PROXIES,
  KEY_STORAGE_SELECTED_PROXIES,
} from '../constant';

export interface Project {
  id: number;
  namespace: string;
  name: string;
}

export interface MockProject {
  origin: string;
  platform: string;
  project: Project;
}

export interface ModalsObject<T> {
  [key: string]: T;
}

export interface Api {
  id: number;
  pathname: string;
  method: string;
  name: string;
  key: number;
}

export interface PathRewrite {
  oldPath: string;
  newPath: string;
}

export interface ProxySettings {
  key: string;
  origin: string;
  target: string;
  pathRewrites: PathRewrite[];
}

export interface HttpResponse<T> {
  code: 0;
  data: T;
}

export interface StorageState {
  [KEY_STORAGE_PROJECTS]: ModalsObject<MockProject>;
  [KEY_STORAGE_SELECTED_APIS]: ModalsObject<Api[]>;
  [KEY_STORAGE_PROXIES]: ModalsObject<ProxySettings>;
  [KEY_STORAGE_SELECTED_PROXIES]: string[] | number[];
}
