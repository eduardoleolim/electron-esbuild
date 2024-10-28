import React, { useRef } from "react";
import { Counter } from "./Counter";

export function App(): React.JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Counter/>   
        </div>
    );
}