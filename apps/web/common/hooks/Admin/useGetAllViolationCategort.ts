import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllViolationCategory() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/settings/violation-category`,
  );
}

function useGetAllViolationCategory() {
  const query = useQuery({
    queryKey: ["settings-violation-category"],
    queryFn: () => getAllViolationCategory(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllViolationCategory;
