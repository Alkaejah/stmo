import { API_URL_BACKOFFICE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getBackOfficerInfo(backOfficerId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_BACKOFFICE}/auth/${backOfficerId}/personal-info`,
  );
}

function useGetBackOfficerInfo(backOfficerId: string | undefined) {
  const query = useQuery({
    queryKey: ["personal-info", backOfficerId],
    queryFn: () => getBackOfficerInfo(backOfficerId),
    enabled: !!backOfficerId,
  });
  return query;
}
export default useGetBackOfficerInfo;
