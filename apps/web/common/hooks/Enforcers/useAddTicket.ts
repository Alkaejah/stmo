import { API_URL_ENFORCER_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { T_Ticket } from "@repo/contract";
import { useMutation } from "@tanstack/react-query";

export async function addTicket(props: T_Ticket) {
  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ENFORCER_MODULE}/tickets/citation-ticket/generate`,
    props,
  );
}

function useAddTicket() {
  const query = useMutation({
    mutationFn: (props: T_Ticket) => addTicket(props),
  });
  return query;
}

export default useAddTicket;
