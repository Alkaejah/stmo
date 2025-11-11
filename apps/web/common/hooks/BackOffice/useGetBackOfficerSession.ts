import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import {
  API_URL_BACKOFFICE,
  FIFTEEN_MINUTES,
  TWELVE_MINUTES,
} from "@/common/constants";

export async function getBackOfficerSession() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_BACKOFFICE}/auth/info`);
}

function useGetBackOfficerSession() {
  const query = useQuery({
    queryKey: ["backofficer-session"],
    queryFn: () => getBackOfficerSession(),
    gcTime: FIFTEEN_MINUTES,
    staleTime: TWELVE_MINUTES,
  });
  return query;
}

export default useGetBackOfficerSession;
