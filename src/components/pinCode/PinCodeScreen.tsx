import { useState, useEffect } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PinCodeScreenProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function PinCodeScreen({ onSuccess, onCancel }: PinCodeScreenProps) {
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (pin.length === 6) {
            onSuccess();
        }
    }, [pin]);

    const handleNumberClick = (num: number) => {
        if (pin.length < 6) {
            setPin((prev) => prev + num.toString());
        }
    };

    const handleBack = () => {
        setPin('');
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-semibold text-center mb-6">Enter Pin Code</h1>
                <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                        {[...Array(6)].map((_, idx) => (
                            <div key={idx} className="w-4 h-4 rounded-full border-2 border-blue-400">
                                {pin[idx] ? <div className="w-full h-full bg-blue-400 rounded-full"></div> : null}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center text-gray-600 mb-4">
                    Entered Pin: <span className="font-mono text-lg">{pin || 'None'}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumberClick(num)}
                            className="text-2xl py-4 bg-blue-100 hover:bg-blue-200 rounded-lg"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleBack}
                        className="py-4 bg-gray-200 hover:bg-gray-300 rounded-lg flex justify-center items-center"
                    >
                        <ArrowBackIcon />
                    </button>
                    <button
                        onClick={() => handleNumberClick(0)}
                        className="text-2xl py-4 bg-blue-100 hover:bg-blue-200 rounded-lg"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="py-4 bg-red-100 hover:bg-red-200 rounded-lg flex justify-center items-center"
                    >
                        <BackspaceIcon />
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={onCancel}
                        className="text-sm text-blue-500 underline hover:text-blue-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
