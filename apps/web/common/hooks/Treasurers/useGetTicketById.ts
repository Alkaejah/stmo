import { API_URL_TREASURERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getTicketById(ticketId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_TREASURERS}/treasurer-module/tickets/citation-ticket/generated/${ticketId}`,
  );
}

function useGetTicketById(ticketId: string | undefined) {
  const query = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId,
  });
  return query;
}
export default useGetTicketById;
