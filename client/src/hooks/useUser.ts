import { useContext } from 'react';
import { UserContext } from '../context/login';

export default function useUser() {
  const context = useContext<loginContext | null>(UserContext);
  if (context === null) {
    throw new Error('Algo de errado em UserContext');
  }
  return context;
}