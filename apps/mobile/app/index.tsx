import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";

export default function RootIndex() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		router.replace("/(tabs)");
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.brand}>Gas Mobil</Text>
				<Text style={styles.subtitle}>
					Order gas, track deliveries, and stay powered up.
				</Text>
				<TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
					<Text style={styles.buttonText}>Get Started</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#070b14",
		justifyContent: "center",
		padding: 24,
	},
	content: {
		alignItems: "center",
		gap: 20,
	},
	brand: {
		color: "#ffffff",
		fontSize: 48,
		fontWeight: "900",
		textAlign: "center",
	},
	subtitle: {
		color: "#9ca3af",
		fontSize: 16,
		lineHeight: 24,
		textAlign: "center",
		maxWidth: 320,
	},
	button: {
		marginTop: 32,
		backgroundColor: "#2563eb",
		paddingVertical: 18,
		paddingHorizontal: 42,
		borderRadius: 20,
		shadowColor: "#2563eb",
		shadowOpacity: 0.25,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 10 },
	},
	buttonText: {
		color: "#fff",
		fontWeight: "800",
		fontSize: 16,
	},
});
