import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getHistoricalTicketById(
  historicalTicketId: string | undefined,
) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/tickets/historical/${historicalTicketId}`,
  );
}

function useGetHistoricalTicketById(historicalTicketId: string | undefined) {
  const query = useQuery({
    queryKey: ["historical-ticket", historicalTicketId],
    queryFn: () => getHistoricalTicketById(historicalTicketId),
    enabled: !!historicalTicketId,
  });
  return query;
}
export default useGetHistoricalTicketById;
