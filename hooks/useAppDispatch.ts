import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
