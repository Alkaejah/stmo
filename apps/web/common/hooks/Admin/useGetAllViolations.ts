import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllViolations() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/settings/violations`);
}

function useGetAllViolations() {
  const query = useQuery({
    queryKey: ["settings-violations"],
    queryFn: () => getAllViolations(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllViolations;
