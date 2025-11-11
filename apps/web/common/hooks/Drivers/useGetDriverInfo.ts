import { API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getDriverInfo(driverId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_DRIVERS}/auth/${driverId}/personal-info`,
  );
}

function useGetDriverInfo(driverId: string | undefined) {
  const query = useQuery({
    queryKey: ["personal-info", driverId],
    queryFn: () => getDriverInfo(driverId),
    enabled: !!driverId,
  });
  return query;
}
export default useGetDriverInfo;
