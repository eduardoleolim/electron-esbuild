import React, { useState } from "react";

export function Counter(): React.JSX.Element {
    const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const reset = () => setCount(0);

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-blue-600">Counter</h1>
      <div className="text-5xl font-bold mb-6">{count}</div>
      <div className="flex space-x-4">
        <button
          onClick={increment}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        >
          Increment
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </>
  );
}