import Swal from 'sweetalert2';
import { useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import Label from "../../components/form/Label";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from '../../components/form/date-picker';
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Textarea from "../../components/form/input/TextArea";
import TasksComponent from '../../components/tasks/TasksComponent';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

// Task interface with correct fields
export interface Task {
    id?: number;
    serialNumber?: number;
    taskTitle: string;
    taskDesc: string;
    createdAt?: string;
    deletedAt?: string | null;
    deadline: string;
    username: string;
    status?: number;
    fullfilment?: number;
    isPrivate?: number;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
}

export async function createTask(task: Task, token: string, closeModal: () => void, resetForm: () => void): Promise<ApiResponse<Task> | null> {
    try {
        const response = await apiClient.post<ApiResponse<Task>>(
            "/api/create/task",
            task,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        closeModal();
        resetForm();
        await Swal.fire({
            title: 'Created!',
            text: 'Task created.',
            icon: 'success',
            confirmButtonText: 'OK',
        });
        window.location.reload();
        return response.data;
    } catch (error: any) {
        if (error.response) {
            Swal.fire({
                title: 'Error!',
                text: error.response.data?.message || 'An error occurred while creating the task.',
                icon: 'error',
                confirmButtonText: 'CLOSE',
            });
            console.error("Error creating task:", error.response.data);
        } else {
            Swal.fire({
                title: 'Network Error!',
                text: 'Unable to reach the server. Please check your connection.',
                icon: 'error',
                confirmButtonText: 'CLOSE',
            });
            console.error("Network error:", error.message);
        }
        return null;
    }
}

export default function Notes() {
    const { isOpen, openModal, closeModal } = useModal();
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [deadline, setDeadline] = useState(""); // ISO string
    const username = useSelector((state: RootState) => state.authSlice.user?.username);
    const token = useSelector((state: RootState) => state.authSlice.token);
    // const [isChecked, setIsChecked] = useState(false);
    const [isCheckedTwo, setIsCheckedTwo] = useState(true);
    // const [isCheckedDisabled, setIsCheckedDisabled] = useState(false);

    const resetForm = () => {
        setTaskTitle("");
        setTaskDesc("");
        setDeadline("");
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token || !username) {
            Swal.fire({
                title: 'Unauthorized!',
                text: 'You must be logged in to create a task.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        const taskRequest: Task = {
            username,
            taskTitle,
            taskDesc,
            deadline,
            isPrivate: isCheckedTwo ? 1 : 0,
        };

        const response = await createTask(taskRequest, token, closeModal, resetForm);
        if (response) {
            console.log("Task created:", response.data);
        }
    };

    return (
        <>
            <PageMeta
                title="Tasks Dashboard | Task Manager"
                description="This is the tasks dashboard where you can manage your tasks."
            />
            <PageBreadcrumb pageTitle="Tasks" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 flex justify-between items-center">
                <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md" style={{ fontSize: 30 }}>
                    Tasks
                </h3>
                <Button onClick={() => openModal()}>
                    Add Task
                </Button>
            </div>
            <TasksComponent />
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 max-h-[90vh] overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Create Task
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleCreate}>
                        <div className="px-2 overflow-y-auto custom-scrollbar w-full">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 w-full">
                                <div className="lg:col-span-2">
                                    <Label>Deadline</Label>
                                    <DatePicker
                                        id="date-picker"
                                        placeholder="gg-aa-iiii"
                                        onChange={(dates: Date[]) => {
                                            if (dates && dates.length > 0) {
                                                setDeadline(dates[0].toISOString());
                                            }
                                        }}
                                    />
                                </div>
                                <div className="w-full lg:col-span-2">
                                    <Label>Task Title</Label>
                                    <Input className="w-full" type="text" value={taskTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskTitle(e.target.value)} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Task Description</Label>
                                    <Textarea value={taskDesc} onChange={(value: string) => setTaskDesc(value)} rows={2} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isCheckedTwo}
                                        onChange={setIsCheckedTwo}
                                        label="Private"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm">
                                Create Task
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}