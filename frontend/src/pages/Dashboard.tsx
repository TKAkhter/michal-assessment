import { useState } from "react";
import { trpc } from "../trpc/client";

export const Dashboard: React.FC = () => {
    const [version, setVersion] = useState<"v1" | "v2" | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const { mutate: selectVersion } = trpc.mock.useVersion.useMutation({
        onSuccess: (data) => console.log("Using version:", data),
    });

    const { mutate: callMethod } = trpc.mock.callMethod.useMutation({
        onSuccess: (data) => console.log("Method result:", data),
    });

    const handleVersionChange = (ver: "v1" | "v2") => {
        setVersion(ver);
        selectVersion({ version: ver });
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-4">MockLibrary Home</h1>
            <div className="mb-4">
                <button className="bg-green-500 text-white px-4 py-2 mx-2" onClick={() => handleVersionChange("v1")}>Use Version 1</button>
                <button className="bg-red-500 text-white px-4 py-2 mx-2" onClick={() => handleVersionChange("v2")}>Use Version 2</button>
            </div>

            {version && (
                <div>
                    <h2 className="text-xl mb-2">Methods</h2>
                    <button className="border p-2 m-1" onClick={() => setSelectedMethod(version === "v1" ? "connection" : "connect")}>Connect</button>
                    <button className="border p-2 m-1" onClick={() => setSelectedMethod(version === "v1" ? "disconnection" : "disconnect")}>Disconnect</button>
                    <button className="border p-2 m-1" onClick={() => setSelectedMethod(version === "v1" ? "readBatteryStatus" : "batteryStatus")}>Battery Status</button>
                </div>
            )}

            {selectedMethod && (
                <button className="mt-4 bg-blue-500 text-white px-4 py-2" onClick={() => version && callMethod({ version, method: selectedMethod })}>
                    Call `{selectedMethod}`
                </button>
            )}
        </div>
    );
}