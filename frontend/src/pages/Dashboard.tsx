import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/trpc/client";
import logger from "@/common/pino";
import { isTokenValid } from "@/utils/utils";
import { toast } from "react-toastify";

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (isTokenValid(token)) {
            navigate("/");
        }
    }, []);

    const [libraryVersion, setLibraryVersion] = useState<"v1" | "v2">("v1");
    const [deviceState, setDeviceState] = useState({
        connect: "Connected",
        disconnect: "Disconnect",
        isConnected: false,
        battery: 0,
    });

    const dataMutation = trpc.mock.callMethod.useMutation({
        onSuccess: (data: any) => {
            setDeviceState({
                connect: data.connection,
                disconnect: data.disconnect || 0,
                isConnected: data.isConnected || false,
                battery: data.batteryStatus || 0,
            });
        },
        onError: (error: any) => {
            logger.error(error);
            toast.error(error.msg);
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
    };

    const toggleConnection = () => {
        if (libraryVersion === "v1") {
            if (!deviceState.isConnected) {
                logger.info("V1 connected")
            } else {
                logger.info("V1 disconnected")
            }
            setDeviceState({ ...deviceState, isConnected: !deviceState.isConnected, battery: Math.floor(Math.random() * 100) });
        } else {
            if (!deviceState.isConnected) {
                logger.info("V2 connected")
            } else {
                logger.info("V2 disconnected")
            }
            setDeviceState({ ...deviceState, isConnected: !deviceState.isConnected, battery: Math.floor(Math.random() * 100) });
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
                    <p>Connection: <span className="font-semibold">{deviceState.isConnected ? deviceState.connect : deviceState.disconnect}</span></p>
                    <p>Battery status: <span className="font-semibold">{deviceState.battery}%</span></p>
                </div>

                {/* Connect/Disconnect Button */}
                <Button className="w-full mt-4 bg-black text-white" onClick={toggleConnection}>
                    Connect/Disconnect
                </Button>
            </div>
        </div>
    );
}