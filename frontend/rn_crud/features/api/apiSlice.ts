import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TaskState } from '../task-list/taskListSlice';
import base64 from 'base-64';

const createAuth = (username: string, sessionID: string) => 'Basic ' + base64.encode(`${username}:${sessionID}`);

const apiSlice = createApi({
    // adds to state.api, default
    reducerPath: 'api',
    tagTypes: ['tasks'],
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.180.0.211:8000' }),
    // represents operations and requests for this server
    endpoints: builder => ({
        getTasks: builder.query({
            query: (arg: AuthCred) => ({
                url: '/user/tasks',
                method: 'GET',
                headers: {
                    'Authorization': createAuth(arg.username, arg.sessionID)
                }
            }),
            providesTags: ['tasks']
        }),

        // mutations

        login: builder.mutation({
            query: (arg: LoginCred) => ({
                url: '/auth/login',
                method: 'POST',
                body: arg
            })
        }),
        signup: builder.mutation({
            query: (arg: SignupCred) => ({
                url: '/auth/signup',
                method: 'POST',
                body: arg
            })
        }),
        logout: builder.mutation({
            query: (arg: AuthCred) => ({
                url: '/auth/logout',
                method: 'POST',
                body: arg
            })
        }),
        deleteTasks: builder.mutation({
            query: (arg: AuthCred) => ({
                url: '/user/removeAllTasks',
                method: 'POST',
                headers: {
                    'Authorization': createAuth(arg.username, arg.sessionID)
                }
            })
        }),
        addTasks: builder.mutation({
            query: (arg: AuthCred & { tasks: Array <TaskState> }) => ({
                url: '/user/addTasks',
                method: 'POST',
                headers: {
                    'Authorization': createAuth(arg.username, arg.sessionID)
                },
                body: arg.tasks
            }),
            invalidatesTags: ['tasks']
        })
    })
});

export default apiSlice;
export const { 
    useGetTasksQuery,

    useLoginMutation, useSignupMutation, useLogoutMutation,
    useDeleteTasksMutation, useAddTasksMutation     
} = apiSlice;

export type AuthCred = {
    username: string,
    sessionID: string
};
export type LoginCred = {
    username: string,
    password: string
};
export type SignupCred = LoginCred & {
    name: string,
    email: string
};