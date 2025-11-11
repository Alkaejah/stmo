import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllPenalties() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/settings/penalties`);
}

function useGetAllPenalties() {
  const query = useQuery({
    queryKey: ["settings-penalties"],
    queryFn: () => getAllPenalties(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllPenalties;
