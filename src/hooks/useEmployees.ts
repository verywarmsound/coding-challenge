import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { Employee } from "../types";

export function useEmployees() {
    return useQuery<Employee[]>('employees', async () => {
        const response = await axios.get('/employees');
        return response.data;
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation(
        async (employee: Employee) => {
            const response = await axios.put(`/employees/${employee.id}`, employee);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employees');
            },
        }
    );
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation(
        async (id: number) => {
            await axios.delete(`/employees/${id}`);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employees');
            },
        }
    );
}

export function useAddEmployee() {
    const queryClient = useQueryClient();
    return useMutation(
        async (employee: Omit<Employee, 'id'>) => {
            const response = await axios.post('/employees', employee);
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('employees');
            },
        }
    );
}
