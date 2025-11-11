import { T_BackendResponse } from "@repo/contract";
import { API_URL } from "../constants/ev";

export class ApiService {
  private BASE_URL: string | undefined;

  constructor(source: "main" = "main") {
    if (source === "main") {
      this.BASE_URL = API_URL || "";
    }
  }

  private constructOptions(removeContentType = false) {
    const headers = {
      ...(!removeContentType && {
        "Content-Type": "application/json",
      }),
    } as Record<string, any>;
    const options = {
      headers,
      credentials: "include" as RequestCredentials,
    };
    return options;
  }

  async get<T = T_BackendResponse>(
    endpoint: string,
    params?: Record<string, any>,
    removeContentType?: boolean,
    signal?: AbortSignal,
  ): Promise<T> {
    const reqParams = new URLSearchParams(params).toString();
    const otherOptions = this.constructOptions(removeContentType);
    const res = await fetch(
      `${this.BASE_URL}${endpoint}${params ? `?${reqParams}` : ""}`,
      {
        ...otherOptions,
        ...(signal ? { signal } : {}),
      },
    );
    return (await res).json();
  }

  async post<T = T_BackendResponse>(
    endpoint: string,
    body: any,
    raw?: boolean,
    removeContentType?: boolean,
  ): Promise<T> {
    const otherOptions = this.constructOptions(removeContentType);
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "POST",
      body: !raw ? JSON.stringify(body) : body,
      ...otherOptions,
    });
    return (await res).json();
  }

  async patch<T = T_BackendResponse>(
    endpoint: string,
    body?: any,
    raw?: boolean,
    removeContentType?: boolean,
  ): Promise<T> {
    const otherOptions = this.constructOptions(removeContentType);
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "PATCH",
      body: !raw ? JSON.stringify(body) : body,
      ...otherOptions,
    });
    return (await res).json();
  }

  async delete<T = T_BackendResponse>(
    endpoint: string,
    body?: any,
    raw?: boolean,
    removeContentType?: boolean,
  ): Promise<T> {
    const otherOptions = this.constructOptions(removeContentType);
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "DELETE",
      body: !raw ? JSON.stringify(body) : body,
      ...otherOptions,
    });
    return (await res).json();
  }
}
