import { Slot } from "expo-router";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthContext";

export default function Layout() {
	return (
		<AuthProvider>
			<CartProvider>
				<Slot />
			</CartProvider>
		</AuthProvider>
	);
}
