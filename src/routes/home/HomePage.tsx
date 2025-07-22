import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useMutation";

function HomePage() {
	const { mutate: logoutUser, isPending: isLoggingOut } = useLogout();
	const handleLogout = () => {
		logoutUser(); // Call the logout mutation
	};
	return (
		<div className="grid place-items-center p-20">
			<h1 className="text-4xl font-bold text-blue-400">WELCOME</h1>
			<Button
				disabled={isLoggingOut}
				onClick={handleLogout}
				type="submit"
				className="w-full"
			>
				{isLoggingOut ? <Loader2Icon className="animate-spin" /> : "Logout"}
			</Button>
		</div>
	);
}

export default HomePage;
