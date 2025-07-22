import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./routes/auth/login/LoginPage";
import HomePage from "./routes/home/HomePage";
import useAuthStore from "./store/authStore";

interface ProtectedRouteProps {
	children: React.ReactNode;
}
function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated } = useAuthStore();
	console.log(isAuthenticated);
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	return <>{children}</>;
}
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<Navigate to="/login" />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
