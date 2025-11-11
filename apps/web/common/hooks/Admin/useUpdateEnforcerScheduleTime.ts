import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Update_Enforcer_Schedule_Time } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function updateEnforcerScheduleTime(
  enforcerId: string,
  props: T_Update_Enforcer_Schedule_Time,
) {
  const apiService = new ApiService();
  return await apiService.patch(
    `${API_URL_ADMIN_MODULE}/enforcers/${enforcerId}/scheduling/update-time`,
    props,
  );
}

function useUpdateEnforcerScheduleTime() {
  return useMutation({
    mutationFn: ({
      enforcerId,
      scheduleTime,
    }: {
      enforcerId: string;
      scheduleTime: string;
    }) => updateEnforcerScheduleTime(enforcerId, { scheduleTime }),
  });
}

export default useUpdateEnforcerScheduleTime;
