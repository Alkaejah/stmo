import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllReceivedFeedbacksByEnforcerId(
  enforcerId: string | undefined,
) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/feedbacks/${enforcerId}/list`,
  );
}

function useGetAllReceivedFeedbacksByEnforcerId(
  enforcerId: string | undefined,
) {
  const query = useQuery({
    queryKey: ["feedbacks-list", enforcerId],
    queryFn: () => getAllReceivedFeedbacksByEnforcerId(enforcerId),
    enabled: !!enforcerId,
  });
  return query;
}
export default useGetAllReceivedFeedbacksByEnforcerId;
