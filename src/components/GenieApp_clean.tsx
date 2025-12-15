import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Plus, Send, PanelLeft, Github as GithubIcon, FileCode2, BookOpenText, MonitorPlay, Rocket } from "lucide-react";

type Chat = { id: string; title: string };

const GenieApp: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = React.useState(true);
	const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
	const [tab, setTab] = React.useState("code");

	const chats: Chat[] = [
		{ id: "1", title: "React Components" },
		{ id: "2", title: "API Integration" },
		{ id: "3", title: "State Management" },
		{ id: "4", title: "Styling with CSS" },
		{ id: "5", title: "Testing Strategies" },
	];

	const showSidebar = sidebarOpen && !activeChatId;

	return (
		<div className="h-screen w-screen text-white relative overflow-hidden">
		{/* Immersive AI-Genie Background */}
		<div className="fixed inset-0 overflow-hidden pointer-events-none" style={{zIndex: -5}}>
			{/* Integrated Genie Lamp at Bottom Center */}
			<div className="genie-lamp-integrated">
				<svg viewBox="0 0 200 120" className="w-full h-full opacity-30">
					{/* Main Lamp Body - Semi-transparent */}
					<defs>
						<radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="rgba(251, 191, 36, 0.4)" />
							<stop offset="70%" stopColor="rgba(251, 191, 36, 0.2)" />
							<stop offset="100%" stopColor="rgba(251, 191, 36, 0.05)" />
						</radialGradient>
					</defs>
					<path
						d="M40 90 Q40 75 55 75 L85 75 Q100 70 115 75 L145 75 Q160 75 160 90 L152 105 Q145 112 130 112 L70 112 Q55 112 48 105 Z"
						fill="url(#lampGlow)"
						stroke="rgba(251, 191, 36, 0.3)"
						strokeWidth="2"
					/>
					{/* Lamp Spout */}
					<path
						d="M92 75 Q92 60 107 52 Q115 45 122 52 Q130 60 122 67 Q115 75 107 75 Z"
						fill="url(#lampGlow)"
						stroke="rgba(251, 191, 36, 0.3)"
						strokeWidth="2"
					/>
					{/* Lamp Handle */}
					<path
						d="M107 52 Q107 37 115 30 Q122 22 130 30 Q137 37 130 45 Q122 52 115 52 Z"
						fill="url(#lampGlow)"
						stroke="rgba(251, 191, 36, 0.3)"
						strokeWidth="2"
					/>
				</svg>
			</div>
			
			{/* AI-Infused Smoke Waves flowing upward diagonally */}
			<div className="ai-smoke-container">
				{/* Flowing Neon Lines */}
				{Array.from({ length: 12 }, (_, i) => (
					<div
						key={`neon-line-${i}`}
						className="neon-flow-line"
						style={{
							left: `${45 + Math.random() * 10}%`,
							animationDelay: `${i * 0.8}s`,
							animationDuration: `${8 + Math.random() * 4}s`,
						}}
					/>
				))}
				
				{/* Circuit-like Connections */}
				{Array.from({ length: 8 }, (_, i) => (
					<div
						key={`circuit-${i}`}
						className="circuit-connection"
						style={{
							left: `${40 + Math.random() * 20}%`,
							bottom: `${10 + Math.random() * 80}%`,
							animationDelay: `${i * 1.2}s`,
						}}
					/>
				))}
				
				{/* Binary Digits in Smoke */}
				{Array.from({ length: 20 }, (_, i) => {
					const binaryChars = ['0', '1', '01', '10', '101', '010'];
					return (
						<div
							key={`binary-smoke-${i}`}
							className="binary-in-smoke"
							style={{
								left: `${35 + Math.random() * 30}%`,
								animationDelay: `${Math.random() * 10}s`,
								animationDuration: `${12 + Math.random() * 8}s`,
							}}
						>
							{binaryChars[Math.floor(Math.random() * binaryChars.length)]}
						</div>
					);
				})}
				
				{/* Neural Network Glowing Nodes */}
				{Array.from({ length: 15 }, (_, i) => (
					<div
						key={`neural-node-${i}`}
						className="neural-glow-node"
						style={{
							left: `${35 + Math.random() * 30}%`,
							bottom: `${15 + Math.random() * 70}%`,
							animationDelay: `${Math.random() * 15}s`,
						}}
					/>
				))}
				
				{/* Particle Streams with Parallax */}
				{Array.from({ length: 25 }, (_, i) => (
					<div
						key={`particle-${i}`}
						className="ai-particle-stream"
						style={{
							left: `${40 + Math.random() * 20}%`,
							animationDelay: `${Math.random() * 12}s`,
							animationDuration: `${10 + Math.random() * 8}s`,
							transform: `translateZ(${Math.random() * 50}px)`, // Parallax depth
						}}
					/>
				))}
			</div>
		</div>
			
			<div className="flex h-full relative z-10">
				{/* Mobile Menu Button */}
				{!showSidebar && (
					<Button 
						variant="ghost" 
						size="sm" 
						onClick={() => setSidebarOpen(true)}
						className="fixed top-4 left-4 z-50 glassmorphism text-white hover:bg-white/10 transition-all duration-300 md:hidden"
					>
						<PanelLeft className="h-4 w-4" />
					</Button>
				)}

				{/* Sidebar */}
				{showSidebar && (
					<>
					<aside className="w-80 border-r border-white/30 flex flex-col glassmorphism floating-panel glow-border">
						<div className="flex items-center justify-between p-4">
							<h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-float">
								Genie
							</h2>
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={() => setSidebarOpen(false)}
								className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full p-2 hover:scale-110"
							>
								<PanelLeft className="h-4 w-4" />
							</Button>
						</div>
						<Separator className="bg-white/10" />
						<ScrollArea className="flex-1 p-4">
							<div className="space-y-2">
								<Button 
									variant="ghost" 
									className="w-full justify-start text-white/90 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 premium-glow"
									onClick={() => setActiveChatId(null)}
								>
									<Plus className="mr-2 h-4 w-4" />
									New Chat
								</Button>
								{chats.map(chat => (
									<div key={chat.id} className="relative group">
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										<Button
											variant="ghost"
											className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 pl-4"
											onClick={() => setActiveChatId(chat.id)}
										>
											{chat.title}
										</Button>
									</div>
								))}
							</div>
						</ScrollArea>
					</aside>
					</>
				)}

				{/* Main Area */}
				<main className="flex-1 grid grid-cols-1 lg:grid-cols-[35%_65%] h-full">
					{/* Left: Chat */}
					<section className="border-r border-white/30 flex flex-col holographic-panel immersive-panel floating-depth ambient-glow">
						<div className="flex items-center justify-between p-4">
							<div className="flex items-center gap-3">
								{activeChatId && (
									<Button 
										variant="ghost" 
										size="sm" 
										onClick={() => setActiveChatId(null)}
										className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
									>
										<PanelLeft className="h-4 w-4 mr-2" /> 
										All Chats
									</Button>
								)}
								<h3 className="text-lg font-semibold text-white/90">
									{activeChatId ? `Chat ${activeChatId}` : "New Chat"}
								</h3>
							</div>
							<Button 
								variant="ghost" 
								size="sm" 
								onClick={() => setSidebarOpen((v) => !v)}
								className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 lg:hidden"
							>
								<PanelLeft className="h-4 w-4" />
							</Button>
						</div>
						
						<Separator className="bg-white/10" />
						
						<ScrollArea className="flex-1 p-4">
							<div className="space-y-4">
								{/* Sample Messages */}
								<div className="space-y-4">
									<div className="flex justify-end">
										<div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 max-w-[80%] animate-fade-up">
											<p className="text-white/90">How can I build a React component?</p>
										</div>
									</div>
									
									<div className="flex justify-start">
										<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 max-w-[85%] animate-fade-up floating-glass neon-glow">
											<div className="flex items-center gap-2 mb-2">
												<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
													G
												</div>
												<span className="text-white/70 text-sm">Genie Assistant</span>
											</div>
											<p className="text-white/90 mb-3">I'll help you build a React component! Here's a step-by-step approach:</p>
											
											<div className="flex flex-wrap gap-2">
												<Button size="sm" className="gradient-blue text-xs hover:scale-105 transition-transform">
													Generate Code
												</Button>
												<Button size="sm" className="gradient-purple text-xs hover:scale-105 transition-transform">
													Explain
												</Button>
												<Button size="sm" className="gradient-pink text-xs hover:scale-105 transition-transform">
													Fix Bug
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</ScrollArea>
						
						<div className="p-4 border-t border-white/10">
							<div className="flex gap-2">
								<Input 
									placeholder="Ask Genie anything..." 
									className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
								/>
								<Button className="gradient-blue hover:scale-105 transition-transform">
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</section>

					{/* Right: Workbench - Desktop */}
					<section className="flex flex-col holographic-panel immersive-panel hidden lg:flex floating-depth">
						<div className="p-4 border-b border-white/10">
							<Tabs value={tab} onValueChange={setTab}>
								<TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10">
									<TabsTrigger value="code" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300">
										<FileCode2 className="h-4 w-4 mr-2" />
										Code
									</TabsTrigger>
									<TabsTrigger value="docs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300">
										<BookOpenText className="h-4 w-4 mr-2" />
										Docs
									</TabsTrigger>
									<TabsTrigger value="preview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300">
										<MonitorPlay className="h-4 w-4 mr-2" />
										Preview
									</TabsTrigger>
									<TabsTrigger value="github" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300">
										<GithubIcon className="h-4 w-4 mr-2" />
										GitHub
									</TabsTrigger>
									<TabsTrigger value="deploy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300">
										<Rocket className="h-4 w-4 mr-2" />
										Deploy
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
						
						<div className="flex-1 flex flex-col">
							<CodeTab isActive={tab === "code"} />
							<DocsTab isActive={tab === "docs"} />
							<PreviewTab isActive={tab === "preview"} />
							<GithubTab isActive={tab === "github"} />
							<DeployTab isActive={tab === "deploy"} />
						</div>
					</section>
				</main>

				{/* Mobile Workbench */}
				<div className="lg:hidden">
					<div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
						<Tabs value={tab} onValueChange={setTab}>
							<TabsList className="grid w-full grid-cols-5 bg-white/5 border border-white/10">
								<TabsTrigger value="code" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300 text-xs">
									<FileCode2 className="h-3 w-3" />
								</TabsTrigger>
								<TabsTrigger value="docs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300 text-xs">
									<BookOpenText className="h-3 w-3" />
								</TabsTrigger>
								<TabsTrigger value="preview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300 text-xs">
									<MonitorPlay className="h-3 w-3" />
								</TabsTrigger>
								<TabsTrigger value="github" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300 text-xs">
									<GithubIcon className="h-3 w-3" />
								</TabsTrigger>
								<TabsTrigger value="deploy" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-purple-500/30 text-white/70 data-[state=active]:text-white transition-all duration-300 text-xs">
									<Rocket className="h-3 w-3" />
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					
					<div className="h-64">
						<CodeTab isActive={tab === "code"} />
						<DocsTab isActive={tab === "docs"} />
						<PreviewTab isActive={tab === "preview"} />
						<GithubTab isActive={tab === "github"} />
						<DeployTab isActive={tab === "deploy"} />
					</div>
				</div>
			</div>
		</div>
	);
}

// Component Tab implementations
const CodeTab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	if (!isActive) return null;
	return (
		<div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg m-4">
			<div className="p-4">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-white/90 font-semibold">Code Editor</h3>
					<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
						Ready
					</Badge>
				</div>
				<div className="bg-gray-950/80 rounded-lg p-4 font-mono text-sm">
					<div className="text-gray-400 mb-2">// React Component</div>
					<div className="text-blue-400">import</div> <div className="text-white">React</div> <div className="text-blue-400">from</div> <div className="text-green-400">'react'</div><div className="text-white">;</div>
					<br />
					<div className="text-blue-400">export default function</div> <div className="text-yellow-400">MyComponent</div><div className="text-white">() {</div>
					<div className="ml-4 text-blue-400">return</div> <div className="text-white">(</div>
					<div className="ml-8 text-white">&lt;</div><div className="text-red-400">div</div><div className="text-white">&gt;</div>
					<div className="ml-12 text-white">Hello World!</div>
					<div className="ml-8 text-white">&lt;/</div><div className="text-red-400">div</div><div className="text-white">&gt;</div>
					<div className="ml-4 text-white">);</div>
					<div className="text-white">}</div>
				</div>
			</div>
		</div>
	);
};

const DocsTab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	if (!isActive) return null;
	return (
		<div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg m-4">
			<div className="p-4">
				<h3 className="text-white/90 font-semibold mb-4">Documentation</h3>
				<div className="space-y-4 text-white/70">
					<div>
						<h4 className="text-white/90 font-medium mb-2">Getting Started</h4>
						<p>Learn how to build amazing React components with Genie AI assistance.</p>
					</div>
					<div>
						<h4 className="text-white/90 font-medium mb-2">Best Practices</h4>
						<p>Follow these guidelines for clean, maintainable code.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const PreviewTab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	if (!isActive) return null;
	return (
		<div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg m-4">
			<div className="p-4">
				<h3 className="text-white/90 font-semibold mb-4">Live Preview</h3>
				<div className="bg-white rounded-lg p-8 text-center">
					<div className="text-gray-800 text-xl font-bold">Hello World!</div>
					<p className="text-gray-600 mt-2">Your component preview appears here</p>
				</div>
			</div>
		</div>
	);
};

const GithubTab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	if (!isActive) return null;
	return (
		<div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg m-4">
			<div className="p-4">
				<h3 className="text-white/90 font-semibold mb-4">GitHub Integration</h3>
				<div className="space-y-4">
					<Button className="w-full gradient-blue">
						<GithubIcon className="h-4 w-4 mr-2" />
						Connect Repository
					</Button>
					<div className="text-white/70 text-sm">
						Connect your GitHub account to sync your projects.
					</div>
				</div>
			</div>
		</div>
	);
};

const DeployTab: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	if (!isActive) return null;
	return (
		<div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-lg m-4">
			<div className="p-4">
				<h3 className="text-white/90 font-semibold mb-4">Deploy</h3>
				<div className="space-y-4">
					<Button className="w-full gradient-purple">
						<Rocket className="h-4 w-4 mr-2" />
						Deploy to Vercel
					</Button>
					<div className="text-white/70 text-sm">
						Deploy your application with one click.
					</div>
				</div>
			</div>
		</div>
	);
};

export default GenieApp;

