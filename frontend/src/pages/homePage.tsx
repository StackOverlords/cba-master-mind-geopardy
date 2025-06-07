import { useAuthStore } from "../stores/authStore";

const HomePage = () => {
    const user = useAuthStore((state) => state.user);
    return (
        <main>
            <h1>Hello world {user?.displayName}</h1>
        </main>
    );
}

export default HomePage;