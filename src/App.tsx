import { useState } from "react";
import generateJsonWithAI from "./lib/google";

function App() {
    const [jsonSchemaInput, setJsonSchemaInput] = useState<string>('');
    const [recordCount, setRecordCount] = useState<number>(10);
    const [jsonData, setJsonData] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);

    // Function to show a custom message box
    const showMessageBox = (msg: string) => {
        setMessage(msg);
    };

    // Function to hide the custom message box
    const closeMessageBox = () => {
        setMessage(null);
    };

    const handleGenerate = async () => {
        if (!jsonSchemaInput.trim()) {
            showMessageBox("Please enter a description for the JSON data.");
            return;
        }
        if (recordCount <= 0 || isNaN(recordCount)) {
            showMessageBox("Please enter a valid number of records greater than 0.");
            setRecordCount(10); // Reset to default
            return;
        }

        setIsLoading(true);
        setJsonData(''); // Clear previous data

        try {
            // Removed JSON.parse validation here, as input is now a vague description
            const generatedData = await generateJsonWithAI({ schema: jsonSchemaInput, count: recordCount });
            setJsonData(generatedData || "");
        } catch (error: unknown) {
            if (error instanceof Error) {
                showMessageBox(`Error: ${error.message}. Please try again with a clearer description.`);
            } else {
                showMessageBox('An unexpected error occurred. Please try again.');
            }
            console.error("Generation error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (jsonData) {
            try {
                await navigator.clipboard.writeText(jsonData);
                showMessageBox('JSON data copied to clipboard!');
            } catch (err) {
                showMessageBox('Failed to copy JSON data. Please copy manually.');
                console.error('Failed to copy text:', err);
            }
        } else {
            showMessageBox('No JSON data to copy.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="container bg-white shadow-lg rounded-lg p-8 space-y-6 max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">AI-Powered Dummy JSON Generator</h1>

                {/* Input Section */}
                <div className="space-y-4">
                    <label htmlFor="jsonSchemaInput" className="block text-lg font-medium text-gray-700">
                        Describe the JSON Data You Need (e.g., "id: integer, name: string, rollNum: number")
                    </label>
                    <textarea
                        id="jsonSchemaInput"
                        rows={10}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-mono"
                        placeholder='Example: "id: integer, name: string, email: email, isActive: boolean, address: object with street and city, tags: array of strings and numbers."'
                        value={jsonSchemaInput}
                        onChange={(e) => setJsonSchemaInput(e.target.value)}
                    ></textarea>

                    <label htmlFor="recordCountInput" className="block text-lg font-medium text-gray-700">
                        Number of Records (default: 10)
                    </label>
                    <input
                        type="number"
                        id="recordCountInput"
                        value={recordCount}
                        min={1}
                        onChange={(e) => setRecordCount(Number(e.target.value))}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    />

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate Dummy JSON with AI'}
                    </button>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <label htmlFor="jsonOutput" className="block text-lg font-medium text-gray-700">
                        Generated JSON Data
                    </label>
                    <textarea
                        id="jsonOutput"
                        rows={10}
                        readOnly
                        value={jsonData}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-800 font-mono"
                    ></textarea>
                    <button
                        onClick={handleCopy}
                        disabled={!jsonData}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Copy to Clipboard
                    </button>
                </div>

                {/* Message Box */}
                {message && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
                            <p className="text-lg font-medium text-gray-800 mb-4">{message}</p>
                            <button
                                onClick={closeMessageBox}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center text-white">
                            <div className="spinner border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full w-12 h-12 animate-spin mb-3"></div>
                            <p className="text-lg">Generating data with AI...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
