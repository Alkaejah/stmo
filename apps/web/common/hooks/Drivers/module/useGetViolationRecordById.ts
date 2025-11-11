import { API_URL_DRIVER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getViolationRecordById(recordId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_DRIVER_MODULE}/violations-record/${recordId}`,
  );
}

function useGetViolationRecordById(recordId: string | undefined) {
  const query = useQuery({
    queryKey: ["violation-record", recordId],
    queryFn: () => getViolationRecordById(recordId),
    enabled: !!recordId,
  });
  return query;
}
export default useGetViolationRecordById;
