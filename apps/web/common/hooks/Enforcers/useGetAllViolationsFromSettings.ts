import { API_URL_ENFORCER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllViolationsFromSettings() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ENFORCER_MODULE}/settings/violations`);
}

function useGetAllViolationsFromSettings() {
  const query = useQuery({
    queryKey: ["violations-from-settings"],
    queryFn: () => getAllViolationsFromSettings(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllViolationsFromSettings;
