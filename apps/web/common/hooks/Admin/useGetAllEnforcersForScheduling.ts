import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllEnforcersForScheduling() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/enforcers/scheduling`);
}

function useGetAllEnforcersForScheduling() {
  const query = useQuery({
    queryKey: ["scheduling-enforcers"],
    queryFn: () => getAllEnforcersForScheduling(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllEnforcersForScheduling;
