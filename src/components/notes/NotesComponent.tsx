import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    const username = useSelector((state: RootState) => state.authSlice.user?.username);
    const token = useSelector((state: RootState) => state.authSlice.token);

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
                const sortedNotes = [...response.data.data].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setNotes(sortedNotes);
            } catch (error) {
                console.error("Error fetching notes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [username]);
    console.log(notes);

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
                    </div>
                ))
            )}
        </>
    )
}
