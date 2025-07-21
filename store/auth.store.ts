import { getCurrentUser, signOut } from '@/lib/appwrite';
import { User } from '@/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type AuthStore = {
   isAuthenticated: boolean;
   user: User | null;
   isLoading: boolean;

   setIsAuthenticated: (value: boolean) => void;
   setUser: (value: User | null) => void;
   setIsLoading: (loading: boolean) => void;

   fetchAuthenticatedUser: () => Promise<void>;
   logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
   persist(
      (set) => ({
         isAuthenticated: false,
         user: null,
         isLoading: false,

         setIsAuthenticated: (value) => set({ isAuthenticated: value }),
         setUser: (value) => set({ user: value }),
         setIsLoading: (value) => set({ isLoading: value }),

         fetchAuthenticatedUser: async () => {
            set({ isLoading: true });
            try {
               const user = await getCurrentUser();
               if (user) set({ isAuthenticated: true, user: user as User });
               else set({ isAuthenticated: false, user: null });
            } catch (error) {
               console.log("Fetch authenticatedUser error", error);
               set({ isAuthenticated: false, user: null });
            } finally {
               set({ isLoading: false });
            }
         },

         logout: async () => {
            try {
               await signOut();
               await AsyncStorage.removeItem('auth');
               set({ isAuthenticated: false, user: null });
            } catch (error) {
               console.log("Sign out error", error);
            }
         }
      }),
      {
         name: 'auth',
         storage: createJSONStorage(() => AsyncStorage),
         partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
         onRehydrateStorage: () => {
            console.log("Hydration started");
            return (state, error) => {
               if (error) console.log("Hydration error", error);
               else console.log("Hydration finished", state);
            };
         },
      }
   )
);

export default useAuthStore;