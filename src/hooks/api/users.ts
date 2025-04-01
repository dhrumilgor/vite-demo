import { useQuery } from "@tanstack/react-query"

export const useGetStudents = (data: any) => {
    return useQuery({
      queryKey: [
        'student',
        data?.skip,
        data?.limit,
        data?.search,
        data?.sortField,
        data?.sortOrder,
        data?.status,
      ],
      queryFn: () =>getUserList(data),
    })
  }
  
  async function getUserList(data:any){
    const response = await fetch(`https://dummyjson.com/users?skip=${data?.skip}&limit=${data?.limit}&search=${data?.search}&sort=${data?.sortField}&order=${data?.sortOrder}&status=${data?.status}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }