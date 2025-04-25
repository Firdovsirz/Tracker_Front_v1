import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import apiClient from "../../util/apiClient";
import { RootState } from "../../redux/store";
import Skeleton from "react-loading-skeleton";
import EditIcon from '@mui/icons-material/Edit';
import "react-loading-skeleton/dist/skeleton.css";
import NotFoundIcon from "../../../public/404.png";
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PinCodeScreen from "../../components/pinCode/PinCodeScreen";


export interface Task {
  id: number;
  serialNumber: number;
  taskTitle: string;
  taskDesc: string;
  createdAt: Date;
  deadline: Date;
  status: number;
  fulfillment: number;
  isPrivate: number;
}

export interface NotesResponse {
  status: number;
  data: Task[];
  statusMessage: string | null;
}


// delete task if needed


// export async function deleteNote(username: string): Promise<void> {
//   try {
//     const response = await apiClient.delete(`/api/tasks/${username}`);
//     console.log(response);

//     Swal.fire({
//       title: 'Deleted!',
//       text: `The note with the ${username} serial number deleted.`,
//       icon: 'success',
//       confirmButtonText: 'OK',
//     });
//   } catch (error: any) {
//     Swal.fire({
//       title: 'Error!',
//       text: error.response?.data?.message || 'Error happened when try to delete.',
//       icon: 'error',
//       confirmButtonText: 'CLOSE',
//     });
//   }
// }

export default function TasksComponent() {
  const username = useSelector((state: RootState) => state.authSlice.user?.username);
  const token = useSelector((state: RootState) => state.authSlice.token);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revealedNotes, setRevealedNotes] = useState<Set<number>>(new Set());
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      console.log("worked");

      try {
        setLoading(true);
        const response = await apiClient.get<NotesResponse>(
          `/api/tasks/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        const sortedNotes = [...response.data.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTasks(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [username]);

  return (
    <div>
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
            ) : tasks.length === 0 ? (
                <div className='flex flex-col sm:flex-row justify-center items-center p-[50px] text-center sm:text-left'>
                    <img src={NotFoundIcon} alt="not-found" className='w-[200px] h-[200px] sm:mr-[50px] mb-5 sm:mb-0' />
                    <p className='text-gray-400 text-[20px] dark:text-white/90'>NO NOTES FOUND.</p>
                </div>
            ) : (
                tasks.map((note, index) => (
                    <div
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-5 my-5"
                      key={index}
                      style={{ position: 'relative' }}
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {note.serialNumber}
                            </p>
                            <p
                              className="text-sm text-gray-500 dark:text-gray-400 mb-2"
                              style={{ filter: note.isPrivate === 1 && !revealedNotes.has(note.id) ? 'blur(6px)' : 'none' }}
                            >
                                {new Date(note.createdAt).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                            {note.isPrivate === 1 && (
                              <VisibilityIcon
                                className="ml-2"
                                style={{ color: "#999", cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedNoteId(note.id);
                                  setPinModalVisible(true);
                                }}
                              />
                            )}
                        </div>
                        <div>
                            <h3
                              className="flex items-center mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                              style={{
                                fontSize: 20,
                                filter: note.isPrivate === 1 && !revealedNotes.has(note.id) ? 'blur(6px)' : 'none',
                              }}
                            >
                                {note.taskTitle && note.taskTitle.trim().length > 0 ? note.taskTitle : (
                                    <div className='flex items-center'>
                                        <WarningIcon className='mr-2' style={{ color: "#c2c00b" }} />
                                        <p>No Title Available</p>
                                    </div>
                                )}
                            </h3>
                            <p
                              className="text-sm text-gray-500 dark:text-gray-400 mb-2"
                              style={{ filter: note.isPrivate === 1 && !revealedNotes.has(note.id) ? 'blur(6px)' : 'none' }}
                            >
                              {note.taskDesc}
                            </p>
                        </div>
                        <div className="flex">
                            <div className="rounded-[5px] p-2 w-[fit-content] h-[fit-content] mr-2" style={{ background: "blue", color: "#fff", cursor: "pointer" }}>
                                <EditIcon onClick={() => {
                                    console.log("Opening modal with note:", note);
                                    // setSelectedNote(note);
                                    // openModal();
                                }} />
                            </div>
                            <div className="rounded-[5px] p-2 w-[fit-content] h-[fit-content]" style={{ background: "red", color: "#fff", cursor: "pointer" }}>
                                <DeleteIcon />
                            </div>
                        </div>
                    </div>
                ))
            )}
    {pinModalVisible && selectedNoteId !== null && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
          <PinCodeScreen
            onSuccess={() => {
              setRevealedNotes(prev => new Set(prev).add(selectedNoteId));
              setPinModalVisible(false);
              setSelectedNoteId(null);
            }}
            onCancel={() => {
              setPinModalVisible(false);
              setSelectedNoteId(null);
            }}
          />
        </div>
      </div>
    )}
    </div>
  )
}