import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllDriversAccounts() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/accounts/list/drivers`);
}

function useGetAllDriversAccounts() {
  const query = useQuery({
    queryKey: ["accounts-list-drivers"],
    queryFn: () => getAllDriversAccounts(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllDriversAccounts;
