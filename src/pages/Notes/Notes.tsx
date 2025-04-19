import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import NotesComponent from "../../components/notes/NotesComponent";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label"; 
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Input from "../../components/form/input/InputField";
import { useState } from "react";
import apiClient from "../../util/apiClient";
import Textarea from "../../components/form/input/TextArea";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export interface Note {
    id: number;
    serialNumber: number;
    noteTitle: string;
    noteDesc: string;
    createdAt: string;
    deletedAt: string | null;
    updatedAt: string | null;
    username: string;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
  }
  export async function createNote(note: Note): Promise<ApiResponse<Note> | null> {
    try {
      const response = await apiClient.post<ApiResponse<Note>>("/api/create/note", note);
  
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Error creating note:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
      return null;
    }
  }
export default function Notes() {
    const { isOpen, openModal, closeModal } = useModal();
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDesc, setNoteDesc] = useState("");
    const username = useSelector((state: RootState) => state.authSlice.user?.username);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const noteRequest = {
            noteTitle,
            noteDesc,
            username: username,
        };

        const response = await createNote(noteRequest as any);
        if (response) {
            console.log("Note created:", response.data);
            closeModal();
            setNoteTitle("");
            setNoteDesc("");
        }
    };
    return (
        <>
            <PageMeta
                title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <PageBreadcrumb pageTitle="Notes" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 flex justify-between items-center">
                <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md" style={{fontSize: 30}}>
                    Notes
                </h3>
                <Button onClick={() => {
                    openModal();
                }}>
                    Add Note
                </Button>
            </div>
            <NotesComponent />
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Note
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleCreate}>
                        <div className="px-2 overflow-y-auto custom-scrollbar w-full">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 w-full">
                                <div className="w-full lg:col-span-2">
                                    <Label>Title</Label>
                                    <Input className="w-full" type="text" value={noteTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteTitle(e.target.value)} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea value={noteDesc} onChange={(value: string) => setNoteDesc(value)} rows={2}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm">
                                Create Note
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
