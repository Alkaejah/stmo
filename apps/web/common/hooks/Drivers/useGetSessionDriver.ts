import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import {
  API_URL_DRIVERS,
  FIFTEEN_MINUTES,
  TWELVE_MINUTES,
} from "@/common/constants";

export async function getSessionDriver() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_DRIVERS}/auth/info`);
}

function useGetSessionDriver() {
  const query = useQuery({
    queryKey: ["session-driver"],
    queryFn: () => getSessionDriver(),
    gcTime: FIFTEEN_MINUTES,
    staleTime: TWELVE_MINUTES,
  });
  return query;
}

export default useGetSessionDriver;
