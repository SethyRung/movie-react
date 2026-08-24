import type { AxiosRequestConfig } from "axios";
import type { ZodSchema } from "zod";
import { api } from "@/utils/axios";
import { toServiceError } from "./error";

export async function request<T>(config: AxiosRequestConfig, schema: ZodSchema<T>): Promise<T> {
  try {
    const response = await api.request<T>(config);
    return schema.parse(response.data);
  } catch (error) {
    throw toServiceError(error);
  }
}
