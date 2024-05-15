

import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { Home, ProblemList, Problem, Profile, Sign } from './pages';
import { useUserState } from './hooks/useUserState';
import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const App = () => {
  const { user } = useUserState();
  const { isLoggedIn } = useMemo(() => user, [user, user.isLoggedIn]);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProblemList />} />
          {!isLoggedIn && <Route path="/signup" element={<Sign />} />}
          {!isLoggedIn && <Route path="/signin" element={<Sign />} />}
          <Route path="/problems" element={<ProblemList />} />
          {isLoggedIn ? (
            <Route path="/problem/:version/:id" element={<Problem />} />
          ) : (
            <Route path="/problem/:version/:id" element={<Sign />} />
          )}
          {isLoggedIn ? (
            <Route
              path="/problem/:version/:id/:roomNumber"
              element={<Problem />}
            />
          ) : (
              <Route path="/problem/:version/:id/:roomNumber" element={<Sign />} />
                  )}
                  {isLoggedIn && <Route path="/profile" element={<Profile />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;