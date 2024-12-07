"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Coffee, Users, Link as LinkIcon } from "lucide-react";
import { createAvatar } from "@dicebear/core";
import { personas } from "@dicebear/collection";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Contract, formatEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants/contract";
import { provider } from "@/constants/readOnlyProvider";
import { toast } from "react-toastify";



// Static Mock Data
// const MOCK_SUPPORTERS = [
// 	{
// 		address: "0x1234...5678",
// 		name: "Alice Johnson",
// 		message: "Love your work! Keep creating amazing content!",
// 		amount: 0.005,
// 		timestamp: 1699824000,
// 	},
// 	{
// 		address: "0x9876...4321",
// 		name: "Bob Smith",
// 		message: "Your tutorials have been super helpful!",
// 		amount: 0.002,
// 		timestamp: 1699737600,
// 	},
// 	{
// 		address: "0xABCD...EFGH",
// 		name: "Charlie Brown",
// 		message: "Thanks for the awesome resources!",
// 		amount: 0.01,
// 		timestamp: 1699651200,
// 	},
// 	{
// 		address: "0xABCD...EFGH",
// 		name: "Charlie Brown",
// 		message: "Thanks for the awesome resources!",
// 		amount: 0.01,
// 		timestamp: 1699651200,
// 	},
// ];

const SupportersSection = () => {
	const [supporters, setSupporters] = useState([]);
	const [loading, setLoading] = useState(true);
console.log({supporters})
	const memoAdded = useCallback((from, timestamp, name, amount, message) => {

		setSupporters((prevSupporters) => [

			{
				address: from,
				name,
				message,
				amount: Number(formatEther(amount)).toFixed(4),
				timestamp: new Date(Number(timestamp) * 1000).toLocaleDateString()
			},

			...prevSupporters
		])

	}, []);


	useEffect(() => {

		const contract = new Contract(
			CONTRACT_ADDRESS,
			CONTRACT_ABI,
			provider
		);

		contract.on("NewMemo", memoAdded);
		return () => {
			contract.off("NewMemo", memoAdded)
		}
	}, [memoAdded])



	useEffect(() => {
		const getMemos = async () => {

			try {

				const contract = new Contract(
					CONTRACT_ADDRESS,
					CONTRACT_ABI,
					provider
				);

				const memos = await contract.getMemos()
				const formattedMemos = memos.map((memo) => ({
					address: memo.from,
					name: memo.name,
					message: memo.message,
					amount: Number(formatEther(memo.amount)).toFixed(4),
					timeStamp: new Date(
						Number(memo.timestamp) * 1000
					).toLocaleDateString()
				}))
					.reverse();

				console.log({ formattedMemos })

				setSupporters(formattedMemos)

			} catch (error) {

				console.log(error);
				toast.error("Error fetching supporters")

			} finally {
				setLoading(false)
			}

		}

		getMemos();


	}, [])
	const generateAvatar = (seed) => {
		return createAvatar(personas, {
			seed,
			scale: 90,
			radius: 50,
			backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
		}).toDataUri();
	};
	return (
		<section>
			<div className="flex items-center gap-3 mb-6">
				<Users className="w-7 h-7 text-orange-500" />
				<h2 className="text-2xl font-semibold text-gray-800">
					Recent Supporters
				</h2>
			</div>
			{
				!loading && setSupporters.length === 0 ? (
					<p className="text-gray-500"> No supporters found</p>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{supporters?.map((supporter, index) => (
							<Card
								key={index}
								className="hover:shadow-lg transition-all duration-300 border-2 border-orange-50"
							>
								<CardContent className="p-6 space-y-4">
									<div className="flex items-center gap-4">
										<Image
											src={generateAvatar(supporter.name)}
											alt={supporter.name}
											width={60}
											height={60}
											className="rounded-full"
										/>
										<div>
											<h3 className="font-semibold text-gray-800">
												{supporter.name}
											</h3>
											<div className="text-sm text-gray-500 flex items-center gap-1">
												<LinkIcon className="w-4 h-4" />
												{supporter.address.slice(0, 6)}...
												{supporter.address.slice(-4)}
											</div>
										</div>
									</div>
									<p className="text-gray-600 italic">
										&quot;{supporter.message}&quot;
									</p>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-500">
											{supporter.timeStamp}
										</span>
										<div className="flex items-center gap-1 text-orange-500">
											<Coffee className="w-4 h-4" />
											<span className="font-semibold">{supporter.amount} XFI</span>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)
			}


		</section>
	);
};

export default SupportersSection;
