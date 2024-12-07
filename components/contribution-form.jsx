
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Coffee, Gift } from "lucide-react";
import { useState } from "react";
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { toast } from "react-toastify";
const ContributionForm = () => {
	const [amount, setAmount] = useState(0.001);
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");
	const { walletProvider } = useAppKitProvider("eip155");
// console.log({walletProvider})
	const handleBuyCoffee = async (e) => {
		e.preventDefault();
		try {
			const provider = new BrowserProvider(walletProvider);
			console.log({ provider })
			const signer = await provider.getSigner();
			const contract = new Contract(
				CONTRACT_ADDRESS,
				CONTRACT_ABI,
				signer
			);

			const value = BigInt(amount * 1e18);
			console.log({ name, message })
			const tx = await contract.buyCoffee(name, message, { value });
			await tx.wait(1, 40000);
			toast.success("Coffee bought successfully!");

		} catch (error) {

			console.error("Error buying coffee:", error.reason);
			toast.error("Error buying coffee. Please try again.");
		}
	}
	return (
		<Card className="shadow-xl border-2 border-orange-100">
			<CardHeader className="bg-orange-50 border-b border-orange-100">
				<CardTitle className="flex items-center gap-2">
					<Gift className="w-6 h-6 text-orange-500" />
					Send Your Support
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 p-6">

				<form onSubmit={handleBuyCoffee} className="space-y-4 p-6">
					<div className="grid md:grid-cols-2 gap-4">
						<Input
							placeholder="Your Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border-orange-200 focus:ring-orange-300"
						/>


						<Input
							placeholder="Amount (XFI)"
							type="number"
							value={amount}
							className="border-orange-200 focus:ring-orange-300"
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<Textarea
						placeholder="Write a supportive message..."
						onChange={(e) => setMessage(e.target.value)}
						value={message}
						className="border-orange-200 focus:ring-orange-300 min-h-[120px]"
					/>
					<div className="flex items-center gap-3">
						<Button className="w-full bg-orange-500 hover:bg-orange-600">
							<Coffee className="mr-2 h-4 w-4" /> Buy Coffee ({amount} XFI)
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default ContributionForm;
