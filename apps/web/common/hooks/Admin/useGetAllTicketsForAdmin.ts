import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllTicketsForAdmin() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/tickets`);
}

function useGetAllTicketsForAdmin() {
  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getAllTicketsForAdmin(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllTicketsForAdmin;
