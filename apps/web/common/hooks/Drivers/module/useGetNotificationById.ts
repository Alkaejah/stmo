import { API_URL_DRIVER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getNotificationById(notificationId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_DRIVER_MODULE}/notifications/${notificationId}`,
  );
}

function useGetNotificationById(notificationId: string | undefined) {
  const query = useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => getNotificationById(notificationId),
    enabled: !!notificationId,
  });
  return query;
}
export default useGetNotificationById;
