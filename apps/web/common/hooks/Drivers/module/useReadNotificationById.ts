import { API_URL_DRIVER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useMutation } from "@tanstack/react-query";

export async function readNotificationById(notificationId: string | undefined) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_DRIVER_MODULE}/notifications/${notificationId}/read`,
  );
}

function useReadNotificationById(notificationId: string | undefined) {
  const query = useMutation({
    mutationFn: () => readNotificationById(notificationId),
  });
  return query;
}

export default useReadNotificationById;
