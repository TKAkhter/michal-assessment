import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/trpc/client";
import logger from "@/common/pino";

// MockLibrary v1
const MockLibraryV1 = {
    connection: () => console.log("Connected (v1)"),
    disconnection: () => console.log("Disconnected (v1)"),
    connected: () => true,
    readBatteryStatus: () => 40, // Mock battery %
};

// MockLibrary v2
const MockLibraryV2 = {
    connect: () => console.log("Connected (v2)"),
    disconnect: () => console.log("Disconnected (v2)"),
    isConnected: () => false,
    batteryStatus: () => 80, // Mock battery %
};

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [libraryVersion, setLibraryVersion] = useState<"v1" | "v2">("v1");
    const [connected, setConnected] = useState(false);
    const [battery, setBattery] = useState(0);

    const dataMutation = trpc.mock.callMethod.useMutation({
        onSuccess: (data: any) => {
            logger.info(data);
        },
    });


    useEffect(() => {
        dataMutation.mutate({
            version: "v2",
            method: "connect"
        })
    }, [libraryVersion])

    const handleLibraryChange = (version: "v1" | "v2") => {
        setLibraryVersion(version);
        setConnected(false); // Reset connection state
        setBattery(0);
    };

    const toggleConnection = () => {
        if (libraryVersion === "v1") {
            if (!connected) {
                MockLibraryV1.connection();
            } else {
                MockLibraryV1.disconnection();
            }
            setConnected(!connected);
            setBattery(MockLibraryV1.readBatteryStatus());
        } else {
            if (!connected) {
                MockLibraryV2.connect();
            } else {
                MockLibraryV2.disconnect();
            }
            setConnected(!connected);
            setBattery(MockLibraryV2.batteryStatus());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Welcome, Arthur!</h2>
                    <Button variant="outline" onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login")
                    }}>
                        Log out
                    </Button>
                </div>

                {/* Library Version Dropdown */}
                <label className="block text-sm font-medium text-gray-700">Library version:</label>
                <Select onValueChange={(val) => handleLibraryChange(val as "v1" | "v2")}>
                    <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={libraryVersion} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="v1">v1</SelectItem>
                        <SelectItem value="v2">v2</SelectItem>
                    </SelectContent>
                </Select>

                {/* Connection & Battery Status */}
                <div className="mt-4 text-gray-700">
                    <p>Connection: <span className="font-semibold">{connected ? "Connected" : "Disconnected"}</span></p>
                    <p>Battery status: <span className="font-semibold">{battery}%</span></p>
                </div>

                {/* Connect/Disconnect Button */}
                <Button className="w-full mt-4 bg-black text-white" onClick={toggleConnection}>
                    {connected ? "Disconnect" : "Connect"}
                </Button>
            </div>
        </div>
    );
}