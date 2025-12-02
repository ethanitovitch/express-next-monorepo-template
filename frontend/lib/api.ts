/* eslint-disable @typescript-eslint/no-explicit-any */

import { env } from './config';

export const get = <T>(url: string, options?: RequestInit): Promise<T> =>
  fetch(`${env.API_URL.toString()}${url}`, { ...options, method: 'GET', credentials: 'include' }).then(response => response.json());

export const post = <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
  fetch(`${env.API_URL.toString()}${url}`, { 
    ...options, 
    method: 'POST', 
    body: data ? JSON.stringify(data) : undefined, 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

export const put = <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
  fetch(`${env.API_URL.toString()}${url}`, { 
    ...options, 
    method: 'PUT', 
    body: data ? JSON.stringify(data) : undefined, 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

export const patch = <T>(url: string, data?: any, options?: RequestInit): Promise<T> =>
  fetch(`${env.API_URL.toString()}${url}`, { ...options, method: 'PATCH', body: data ? JSON.stringify(data) : undefined, credentials: 'include' }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });

export const del = <T>(url: string, options?: RequestInit): Promise<T> =>
  fetch(`${env.API_URL.toString()}${url}`, { ...options, method: 'DELETE', credentials: 'include' }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });