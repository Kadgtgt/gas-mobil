import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";

export default function RegisterScreen() {
	const router = useRouter();
	const { isAuthenticated, register } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	if (isAuthenticated) {
		router.replace("/(tabs)");
		return null;
	}

	const handleRegister = async () => {
		if (!name || !email || !phone || !password) {
			Alert.alert("Missing fields", "Please fill all fields to create your account.");
			return;
		}

		setLoading(true);
		try {
			await register({ name, email, phone, password });
			Alert.alert("Account created", "Please login with your new credentials.");
			router.replace("/login");
		} catch (error: any) {
			Alert.alert("Registration failed", error?.message || "Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>
			<Text style={styles.subtitle}>Sign up to order and track your deliveries.</Text>

			<TextInput
				style={styles.input}
				placeholder="Full name"
				placeholderTextColor="#8492a6"
				value={name}
				onChangeText={setName}
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				placeholderTextColor="#8492a6"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
			/>
			<TextInput
				style={styles.input}
				placeholder="Phone"
				placeholderTextColor="#8492a6"
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				placeholderTextColor="#8492a6"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
				<Text style={styles.buttonText}>{loading ? "Creating account..." : "Sign Up"}</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => router.push("/login")}>
				<Text style={styles.link}>Already have an account? Login</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#070b14",
		padding: 24,
		justifyContent: "center",
	},
	title: {
		color: "#fff",
		fontSize: 34,
		fontWeight: "800",
		marginBottom: 10,
	},
	subtitle: {
		color: "#d1d5db",
		fontSize: 16,
		marginBottom: 32,
	},
	input: {
		backgroundColor: "#0f172a",
		color: "#fff",
		borderRadius: 16,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#1e293b",
	},
	button: {
		backgroundColor: "#2563eb",
		paddingVertical: 16,
		borderRadius: 16,
		alignItems: "center",
		marginTop: 8,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
	},
	link: {
		color: "#60a5fa",
		textAlign: "center",
		marginTop: 22,
		fontWeight: "600",
	},
});
