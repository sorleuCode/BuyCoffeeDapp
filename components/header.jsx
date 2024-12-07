import { Coffee } from "lucide-react";

const Header = () => {
	return (
		<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
			<div className="max-w-4xl mx-auto flex justify-between items-center p-4">
				<div className="flex items-center gap-3">
					<Coffee className="w-8 h-8 text-orange-500" />
					<h1 className="text-2xl font-bold text-gray-800">Buy Me A Coffee</h1>
				</div>
				<div>
					<appkit-button />
				</div>
			</div>
		</header>
	);
};

export default Header