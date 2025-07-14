import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import PATHS from "../routes"

const GuestRoute = ({ children }) => {
    const isAuthorized = useSelector((state) => state.auth.isAuthorized)
    return isAuthorized ? <Navigate to={PATHS.MAIN} replace /> : children
}

export default GuestRoute