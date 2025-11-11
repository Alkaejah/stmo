import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { FIFTEEN_MINUTES, TWELVE_MINUTES } from "../../constants/time";
import { API_URL_DRIVERS } from "../../constants";

export async function getSessionUser() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_DRIVERS}/auth/info`);
}

function useGetSessionUser() {
  const query = useQuery({
    queryKey: ["session-user"],
    queryFn: () => getSessionUser(),
    gcTime: FIFTEEN_MINUTES,
    staleTime: TWELVE_MINUTES,
  });
  return query;
}

export default useGetSessionUser;
