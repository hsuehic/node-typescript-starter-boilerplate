import { get } from '../../utils/fetch';
import { HttpResponse, Project, Api } from '../../types/types';
import { PATH_PROJECTS, PATH_PROJECT_APIS } from './constant';

export async function fetchProjects(urlPlatformAddress: string) {
  return await get<HttpResponse<{ items: Project[] }>>(`${urlPlatformAddress}${PATH_PROJECTS}`);
}

export async function fetchApis(urlPlatformAddress: string, projectId: number) {
  const pathname = PATH_PROJECT_APIS.replace('{{projectId}}', projectId.toString());
  return await get<HttpResponse<Api[]>>(`${urlPlatformAddress}${pathname}`);
}
