import React, { createContext, useState } from "react";

const useLoading = () => {
    const [loading, setLoading] = useState(false);
    return { loading, setLoading };
}

const LoadingContext = createContext();

const LoadingProvider = ({children}) => {
    return (
        <LoadingContext.Provider value={useLoading()}>
            {children}
        </LoadingContext.Provider>
    );
}

export { LoadingProvider, LoadingContext };