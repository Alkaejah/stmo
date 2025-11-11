import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllOfficersAccounts() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/accounts/list/officers`);
}

function useGetAllOfficersAccounts() {
  const query = useQuery({
    queryKey: ["accounts-list-officers"],
    queryFn: () => getAllOfficersAccounts(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllOfficersAccounts;
