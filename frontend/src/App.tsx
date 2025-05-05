import { useState, useEffect } from 'react';
   import { Routes, Route, Navigate } from 'react-router-dom';
   import Navbar from './components/Navbar';
   import Home from './pages/Home';
   import Login from './pages/Login';
   import Register from './pages/Register';
   import ImageDetail from './pages/ImageDetail';
   import UploadImage from './pages/UploadImage';
   import { UserPayload } from './types';

   function App() {
     const [user, setUser] = useState<UserPayload | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       const checkAuthStatus = async () => {
         try {
           const response = await fetch('http://localhost:3000/api/auth/status', {
             method: 'GET',
             credentials: 'include',
           });
           if (response.ok) {
             const data = await response.json();
             setUser(data.user);
           }
         } catch (error) {
           // Silent
         } finally {
           setLoading(false);
         }
       };
       checkAuthStatus();
     }, []);

     const handleLogout = async () => {
       try {
         await fetch('http://localhost:3000/api/auth/signout', {
           method: 'POST',
           credentials: 'include',
         });
         setUser(null);
       } catch (error) {
         // Silent
       }
     };

     if (loading) {
       return <div className="text-center mt-10">Loading...</div>;
     }

     return (
       <div className="min-h-screen bg-gray-100">
         <Navbar user={user} onLogout={handleLogout} />
         <main className="container mx-auto p-4">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
             <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
             <Route path="/images/:id" element={<ImageDetail user={user} />} />
             <Route
               path="/upload"
               element={user ? <UploadImage user={user} /> : <Navigate to="/login" />}
             />
           </Routes>
         </main>
       </div>
     );
   }

   export default App;