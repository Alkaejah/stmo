import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllHistoricalTickets() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_ADMIN_MODULE}/tickets/historical`);
}

function useGetAllHistoricalTickets() {
  const query = useQuery({
    queryKey: ["historical-tickets"],
    queryFn: () => getAllHistoricalTickets(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllHistoricalTickets;
