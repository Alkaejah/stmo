import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllViolationAddress() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/settings/violation-address`,
  );
}

function useGetAllViolationAddress() {
  const query = useQuery({
    queryKey: ["settings-violation-address"],
    queryFn: () => getAllViolationAddress(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllViolationAddress;
