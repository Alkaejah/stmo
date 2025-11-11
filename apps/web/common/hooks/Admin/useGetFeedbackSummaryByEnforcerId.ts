import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getFeedbacksSummaryByEnforcerId(
  enforcerId: string | undefined,
) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/feedbacks/${enforcerId}/summary`,
  );
}

function useGetFeedbacksSummaryByEnforcerId(enforcerId: string | undefined) {
  const query = useQuery({
    queryKey: ["feedbacks-summary", enforcerId],
    queryFn: () => getFeedbacksSummaryByEnforcerId(enforcerId),
    enabled: !!enforcerId,
  });
  return query;
}
export default useGetFeedbacksSummaryByEnforcerId;
