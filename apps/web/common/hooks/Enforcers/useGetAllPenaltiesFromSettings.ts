import { API_URL_ENFORCER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllPenaltiesFromSettings() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ENFORCER_MODULE}/settings/penalties`);
}

function useGetAllPenaltiesFromSettings() {
  const query = useQuery({
    queryKey: ["penalties-from-settings"],
    queryFn: () => getAllPenaltiesFromSettings(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllPenaltiesFromSettings;
