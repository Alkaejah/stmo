import { API_URL_ENFORCER_MODULE } from "@/common/constants";
import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { T_Add_Driver } from "@repo/contract";

export async function addDriver(props: T_Add_Driver) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ENFORCER_MODULE}/drivers/add-driver`,
    props,
  );
}

function useAddDriver() {
  const query = useMutation({
    mutationFn: (props: T_Add_Driver) => addDriver(props),
  });
  return query;
}

export default useAddDriver;
