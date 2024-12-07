"use client";
import ContributionForm from "@/components/contribution-form";
import Header from "@/components/header";
import OwnerCard from "@/components/owner-card";
import SupportersSection from "@/components/supporters-section";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { provider } from "@/constants/readOnlyProvider";
import { useAppKitAccount } from "@reown/appkit/react";
import { Contract, ethers, JsonRpcProvider } from "ethers";
import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";



export default function Home() {
  const {address, status} = useAppKitAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  console.log({ address, status, balance });



useEffect(() => {
	if(!address) return;
	const getOwnerInfo =  async () => {
		console.log("..........................")
		try {

			setIsFetching(true);

			const contract = new Contract(
				CONTRACT_ADDRESS,
				CONTRACT_ABI,
				provider
			);

			
			const owner = await contract.owner();

			console.log({owner});

			if(owner.toLowerCase() === address.toLowerCase()) {
				setIsOwner(true);
			}else {
				setIsOwner(false);
			}

			const contractBalance = await provider.getBalance(CONTRACT_ADDRESS);

			setBalance(Number(ethers.formatEther(contractBalance)));

			
		} catch (error) {
			console.log(error);
		}finally {
			setIsFetching(false);
		};
	}

	getOwnerInfo();
}, [address])  


	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
			<Header />
			<div className="max-w-4xl mx-auto space-y-8 p-4 sm:px-6 lg:px-8 ">
				<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto space-y-8">
						<div className="text-center space-y-4">
							<div className="flex justify-center items-center gap-3">
								<Coffee className="w-10 h-10 text-orange-500" />
								<h1 className="text-4xl font-bold text-gray-800">
									Buy Me A Coffee
								</h1>
							</div>
							<p className="text-gray-600 max-w-xl mx-auto">
							Help fuel my blockchain journey with a virtual coffee. Every
							contribution helps fuel creativity!
							</p>
						</div>
						{status === "connecting" || isFetching ? (<div className="flex justify-center items-center">
								<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
							</div>) : isOwner ? (<OwnerCard balance={balance} setBalance={setBalance}/>)  : (<ContributionForm/>)}
						<SupportersSection />
					</div>
				</div>
			</div>
		</div>
	);
}
