import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Wallet } from "lucide-react";
import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { toast } from "react-toastify";
// import { useState } from "react";
const OwnerCard = ({balance, setBalance}) => {
	const {walletProvider} = useAppKitProvider("eip155");

	const handleWithdraw = async () => {
		try {
			
			const provider = new BrowserProvider(walletProvider);
			const signer = await provider.getSigner();
			const contract = new Contract(
				CONTRACT_ADDRESS,
				CONTRACT_ABI,
				signer

			);

			const tx = await contract.withdrawTips();

			await tx.wait(1, 40000);
			setBalance(0);

			toast.success("Withdrawal successful");
		} catch (error) {
			
			console.log(error)
			toast.error("Failed to Withdraw: Something went wrong");
		}
	}
    
	return (
		<Card className="shadow-xl border-2 border-orange-100">
			<CardHeader className="bg-orange-50 border-b border-orange-100">
				<CardTitle className="flex items-center gap-2">
					<Wallet className="w-6 h-6 text-orange-500" />
					Get Your Coffee
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 p-6">
				<div className="flex justify-between">
					<h2 className="text-3xl font-semibold">Coffee Balance: </h2>
                    <h3 className="text-4xl font-bold">{balance} XFI</h3>
				</div>
				<div className="flex items-center gap-3">
					<Button onClick={handleWithdraw} className="w-full bg-orange-500 hover:bg-orange-600">
						<Coffee className="mr-2 h-4 w-4" /> Withdraw Balance
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default OwnerCard;
