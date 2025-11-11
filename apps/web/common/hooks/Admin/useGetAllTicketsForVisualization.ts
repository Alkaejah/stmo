import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllTicketsForVisualization() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/tickets/citation-ticket/generated/list/graph/dist`,
  );
}

function useGetAllTicketsForVisualization() {
  const query = useQuery({
    queryKey: ["tickets-graph-dist"],
    queryFn: () => getAllTicketsForVisualization(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllTicketsForVisualization;
