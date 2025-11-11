import { API_URL_ADMIN_MODULE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useQuery } from "@tanstack/react-query";

export async function getAllDriversFeedbacks() {
  const apiService = new ApiService();
  return await apiService.get(
    `${API_URL_ADMIN_MODULE}/enforcers/feedbacks/evaluation`,
  );
}

function useGetAllDriversFeedbacks() {
  const query = useQuery({
    queryKey: ["enforcers-feedbacks-evaluation"],
    queryFn: () => getAllDriversFeedbacks(),
    refetchOnWindowFocus: false,
  });
  return query;
}
export default useGetAllDriversFeedbacks;
