import { Slot } from "expo-router";
import { CartProvider } from "./CartContext";

export default function Layout() {
	return (
		<CartProvider>
			<Slot />
		</CartProvider>
	);
}
