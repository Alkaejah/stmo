import { API_URL_ENFORCER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useMutation } from "@tanstack/react-query";

interface IProps {
  driverControlNumber: string;
  violationId: string;
}

export async function getViolationCounts(props: IProps) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ENFORCER_MODULE}/tickets/citation-ticket/generated/violation-count`,
    props,
  );
}

function useGetViolationCounts() {
  const query = useMutation({
    mutationFn: (props: IProps) => getViolationCounts(props),
  });
  return query;
}

export default useGetViolationCounts;
