import Cookies from 'universal-cookie';

const COOKIE_CSRF = 'csrfToken';

export async function request<T>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: object,
  headers?: object,
): Promise<T> {
  const cookies = new Cookies();
  const res = await fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json',
      'x-csrf-token': cookies.get(COOKIE_CSRF),
      ...headers,
    },
    body: body ? JSON.stringify(body) : '',
  });
  return await res.json();
}

export async function post<T>(url: string, body?: object, headers?: object) {
  return request<T>(url, 'POST', body, headers);
}

export async function put<T>(url: string, body?: object, headers?: object) {
  return request<T>(url, 'PUT', body, headers);
}

export async function patch<T>(url: string, body?: object, headers?: object) {
  return request<T>(url, 'PATCH', body, headers);
}

export async function executeDelete<T>(url: string, body?: object, headers?: object) {
  return request<T>(url, 'DELETE', body, headers);
}

export async function get<T>(url: string, headers?: object): Promise<T> {
  const cookies = new Cookies();
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'x-csrf-token': cookies.get(COOKIE_CSRF),
      ...headers,
    },
  });
  return res.json();
}
