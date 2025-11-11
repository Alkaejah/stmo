import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllEnforcersForEvaluation() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/accounts/enforcers/evaluation`,
  );
}

function useGetAllEnforcersForEvaluation() {
  const query = useQuery({
    queryKey: ["enforcers"],
    queryFn: () => getAllEnforcersForEvaluation(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllEnforcersForEvaluation;
