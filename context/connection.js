"use client";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";

// import { sepolia } from "@reown/appkit/networks";
console.log(process.env.NEXT_PUBLIC_CROSSFI_EXPLORER_URL);
const crossFiTestnet = defineChain({
	id: 4157,
	caipNetworkId: "eip155:4157",
	chainNamespace: "eip155",
	name: "CrossFi Testnet",
	nativeCurrency: {
		decimals: 18,
		name: "XFI",
		symbol: "XFI",
	},
	rpcUrls: {
		default: {
			http: [process.env.NEXT_PUBLIC_CROSSFI_RPC_URL],
		},
	},
	blockExplorers: {
		default: {
			name: "XFI Scan",
			url: process.env.NEXT_PUBLIC_CROSSFI_EXPLORER_URL,
		},
	},
	contracts: {
		// Add the contracts here
	},
});

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID;

// 2. Set the networks
// const networks = [crossFiTestnet, sepolia];

// 3. Create a metadata object - optional
const metadata = {
	name: "My Website",
	description: "My Website description",
	url: "https://mywebsite.com", // origin must match your domain & subdomain
	icons: ["https://avatars.mywebsite.com/"],
};

// 4. Create a AppKit instance
export const appkit = createAppKit({
	adapters: [new EthersAdapter()],
	networks: [crossFiTestnet],
	chainImages: {
		[crossFiTestnet.id]:
			"https://s2.coinmarketcap.com/static/img/coins/64x64/26202.png",
	},
	metadata,
	projectId,
	allowUnsupportedChain: false,
	allWallets: "SHOW",
	defaultNetwork: crossFiTestnet,
	enableEIP6963: true,
	features: {
		analytics: true,
		allWallets: true,
		email: false,
		socials: [],
	},
});

export function AppKitProvider({ children }) {
	return <>{children}</>;
}
