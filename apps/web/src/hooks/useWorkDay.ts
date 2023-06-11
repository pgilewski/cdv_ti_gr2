// import axios from 'axios';
// import { useMutation, useQueryClient } from 'react-query';

// import { useApi } from '../features/ApiProvider';
// import { TaskHour, WorkDay } from '../typings/types';

// type CreateWorkDayData = {
//   userId: number;
//   date: string;
// };

// type CreateWorkDayResponse = {
//   workDay: WorkDay;
// };

// type AddTaskHourData = {
//   workDayId: number;
//   taskId: number;
//   startTime: Date;
//   endTime: Date;
// };

// type AddTaskHourResponse = {
//   taskHour: TaskHour;
// };

// type DeleteTaskHourData = {
//   taskHourId: number;
// };

// type DeleteTaskHourResponse = {
//   success: boolean;
// };

// const API_BASE_URL = 'http://api.example.com'; // Replace with your API base URL

// export const useWorkDay = () => {
//   const api = useApi();
//   const queryClient = useQueryClient();

//   const createWorkDay = useMutation<CreateWorkDayResponse, Error, CreateWorkDayData>(
//     (data) => api.post(`${API_BASE_URL}/workdays`, data).then((response) => response.data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('workDays');
//       },
//     }
//   );

//   const addTaskHour = useMutation<AddTaskHourResponse, Error, AddTaskHourData>(
//     (data) => axios.post(`${API_BASE_URL}/taskhours`, data).then((response) => response.data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('workDays');
//       },
//     }
//   );

//   const deleteTaskHour = useMutation<DeleteTaskHourResponse, Error, DeleteTaskHourData>(
//     (data) => axios.delete(`${API_BASE_URL}/taskhours/${data.taskHourId}`).then((response) => response.data),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries('workDays');
//       },
//     }
//   );

//   return {
//     createWorkDay,
//     addTaskHour,
//     deleteTaskHour,
//   };
// };
