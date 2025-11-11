import { API_URL_DRIVER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllNotifications() {
  const apiService = new ApiService();
  return await apiService.get(`${API_URL_DRIVER_MODULE}/notifications`);
}

function useGetAllNotifications() {
  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotifications(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllNotifications;
