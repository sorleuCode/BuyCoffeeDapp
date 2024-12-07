import { JsonRpcProvider } from "ethers";

export const provider = new JsonRpcProvider(
    process.env.NEXT_PUBLIC_CROSSFI_RPC_URL
)