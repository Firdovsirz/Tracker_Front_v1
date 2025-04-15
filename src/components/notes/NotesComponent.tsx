import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import apiClient from "../../util/apiClient";
import Textarea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
import Skeleton from "react-loading-skeleton";
import { useModal } from "../../hooks/useModal";
import EditIcon from '@mui/icons-material/Edit';
import "react-loading-skeleton/dist/skeleton.css";
import DeleteIcon from '@mui/icons-material/Delete';

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

export interface NotesResponse {
    status: number;
    data: Note[];
    statusMessage: string | null;
}

export default function NotesComponent() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteDesc, setNoteDesc] = useState("");
    const username = useSelector((state: RootState) => state.authSlice.user?.username);
    const token = useSelector((state: RootState) => state.authSlice.token);
    const { isOpen, openModal, closeModal } = useModal();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log("handleSave function triggered");

        if (!selectedNote) {
            console.log("No selected note");
            return;
        }

        const updatedFields: any = {};

        if (noteTitle !== selectedNote.noteTitle) updatedFields.noteTitle = noteTitle;
        if (noteDesc !== selectedNote.noteDesc) updatedFields.noteDesc = noteDesc;

        console.log("Updated Fields to be sent:", updatedFields);

        if (Object.keys(updatedFields).length === 0) {
            console.log("No changes to update, closing modal.");
            closeModal();
            return;
        }

        try {
            console.log("Sending PATCH request...");
            const response = await apiClient.patch(`/api/note/update/${selectedNote.serialNumber}`, updatedFields, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Response from PATCH request:", response);

            closeModal();
            setNotes((prev) =>
                prev.map((n) => (n.serialNumber === selectedNote.serialNumber ? { ...n, ...updatedFields } : n))
            );
        } catch (err) {
            console.error("Error updating note:", err);
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get<NotesResponse>(
                    `/api/note/user/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const sortedNotes = [...response.data.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setNotes(sortedNotes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [username]);

    useEffect(() => {
        if (selectedNote) {
            console.log("Selected Note for Modal:", selectedNote);
            setNoteTitle(selectedNote.noteTitle || "");
            setNoteDesc(selectedNote.noteDesc || "");
        }
    }, [selectedNote]);

    return (
        <>
            {loading ? (
                <>
                    {[...Array(4)].map((_, index) => (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 my-5" key={index}>
                            <Skeleton height={20} width={`60%`} />
                            <Skeleton height={15} width={`80%`} />
                            <Skeleton height={15} width={`40%`} />
                        </div>
                    ))}
                </>
            ) : (
                notes.map((note, index) => (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-2 my-5" key={index}>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {note.serialNumber}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {new Date(note.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md" style={{ fontSize: 20 }}>{note.noteTitle}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{note.noteDesc}</p>
                        </div>
                        <div className="flex">
                            <div className="rounded-[5px] p-2 w-[fit-content] h-[fit-content] mr-2" style={{ background: "blue", color: "#fff", cursor: "pointer" }}>
                                <EditIcon onClick={() => { 
                                    console.log("Opening modal with note:", note); 
                                    setSelectedNote(note); 
                                    openModal(); 
                                }} />
                            </div>
                            <div className="rounded-[5px] p-2 w-[fit-content] h-[fit-content]" style={{ background: "red", color: "#fff", cursor: "pointer" }}>
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                ))
            )}
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Edit Note
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="px-2 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Username</Label>
                                    <Input type="text" value={selectedNote?.username || ""} disabled />
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input type="text" value={noteTitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteTitle(e.target.value)} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea value={noteDesc} onChange={(value: string) => setNoteDesc(value)} rows={4} />
                                </div>
                                <div>
                                    <Label>Serial Number</Label>
                                    <Input type="text" value={selectedNote?.serialNumber.toString() || ""} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}