import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import ApiKeyPage from "./pages/ApiKeyPage";
import HistoryPage from "./pages/HistoryPage";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import ApiErrorNavigator from "./api/ApiErrorNavigator";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import { ThemeProvider } from "./theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ApiErrorNavigator />
          <Routes>
            <Route element={<RootLayout />}>
              <Route index element={<MainPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="api-key" element={<ApiKeyPage />} />
                <Route path="history" element={<HistoryPage />} />
              </Route>
              <Route path="forbidden" element={<ErrorPage status={403} />} />
              <Route path="server-error" element={<ErrorPage status={500} />} />
              <Route path="*" element={<ErrorPage status={404} />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
