import {
  API_URL_BACKOFFICE,
  FIFTEEN_MINUTES,
  TWELVE_MINUTES,
} from "@/common/constants";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";

export async function verifyBackOfficerSession() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_BACKOFFICE}/auth/verify-session`);
}

function useVerifyBackOfficerSession() {
  const query = useQuery({
    queryKey: ["backoffice-session"],
    queryFn: () => verifyBackOfficerSession(),
    gcTime: FIFTEEN_MINUTES,
    staleTime: TWELVE_MINUTES,
  });
  return query;
}

export default useVerifyBackOfficerSession;
