import { Navigate } from "react-router-dom";

function SellerRoute({ children }) {
    const token =
        localStorage.getItem("accessToken");

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    try {
        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );

        if (payload.role !== "seller") {
            return (
                <Navigate
                    to="/products"
                    replace
                />
            );
        }

        return children;

    } catch (error) {
        console.error(
            "SELLER ROUTE ERROR:",
            error
        );

        localStorage.removeItem(
            "accessToken"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }
}

export default SellerRoute;