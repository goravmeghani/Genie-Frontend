import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import ChatDashboard from "./components/ChatDashboard";
import TestRoute from "./components/TestRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthCallback from "./pages/auth/callback";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
	return (
		<ErrorBoundary>
			<AuthProvider>
				<Router>
					<Routes>
						{/* Test route for debugging */}
						<Route path="/test" element={<TestRoute />} />
						
						{/* Home page - accessible to everyone */}
						<Route path="/home" element={<Home />} />
						
						{/* Dashboard - protected route, allows guest access */}
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute allowGuest={true}>
									<ChatDashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin"
							element={
								<ProtectedRoute allowGuest={false}>
									<AdminDashboard />
								</ProtectedRoute>
							}
						/>

						{/* OAuth callback route */}
						<Route path="/auth/callback" element={<AuthCallback />} />
						
						{/* Root redirect to home */}
						<Route path="/" element={<Navigate to="/home" replace />} />
						
						{/* Catch all - redirect to home */}
						<Route path="*" element={<Navigate to="/home" replace />} />
					</Routes>
			</Router>
		</AuthProvider>
	</ErrorBoundary>
	);
}
