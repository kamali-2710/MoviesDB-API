import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Movie from "./Movie";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/movie" element={<Movie />} />
      
    </Routes>
  );
}