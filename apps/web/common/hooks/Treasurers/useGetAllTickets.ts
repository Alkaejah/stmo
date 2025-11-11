import { API_URL_TREASURER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllTickets() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_TREASURER_MODULE}/tickets/citation-ticket/generated/list`,
  );
}

function useGetAllTickets() {
  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getAllTickets(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllTickets;
