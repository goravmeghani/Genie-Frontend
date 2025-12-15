import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Plus, Send, PanelLeft, Github as GithubIcon, FileCode2, BookOpenText, MonitorPlay, Rocket } from "lucide-react";

type Chat = { id: string; title: string };
type Message = { id: string; role: "user" | "assistant"; content: string };

export const GenieApp: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = React.useState(true);
	const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
	const [chats, setChats] = React.useState<Chat[]>([
		{ id: "1", title: "Onboarding Flow" },
		{ id: "2", title: "Bug: API Timeout" },
		{ id: "3", title: "Refactor UI" },
	]);

	const [messages, setMessages] = React.useState<Message[]>([
		{ id: "m1", role: "assistant", content: "Hi, I'm Genie. How can I help?" },
	]);
	const [composer, setComposer] = React.useState("");

	const [tab, setTab] = React.useState("code");

	function handleSend() {
		if (!composer.trim()) return;
		const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: composer.trim() };
		setMessages((prev) => [...prev, userMessage, { id: crypto.randomUUID(), role: "assistant", content: "(AI response placeholder)" }]);
		setComposer("");
	}

	function startNewChat() {
		const id = crypto.randomUUID();
		setChats((c) => [{ id, title: "Untitled Chat" }, ...c]);
		setActiveChatId(id);
		setMessages([{ id: crypto.randomUUID(), role: "assistant", content: "New chat started. What shall we build?" }]);
	}

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
					<div
						key={`connection-${i}`}
						className="neural-connection"
						style={{
							left: `${30 + Math.random() * 40}%`,
							bottom: `${15 + Math.random() * 70}%`,
							width: `${20 + Math.random() * 40}px`,
							animationDelay: `${Math.random() * 8}s`,
						}}
					/>
				))}
				
				{/* Data Streams */}
				{Array.from({ length: 12 }, (_, i) => (
					<div
						key={`data-${i}`}
						className="data-stream"
						style={{
							left: `${42 + Math.random() * 16}%`,
							animationDelay: `${Math.random() * 10}s`,
							animationDuration: `${8 + Math.random() * 6}s`,
						}}
					/>
				))}
			</div>
			
			{/* Enhanced Golden Sparks around Lamp */}
			{Array.from({ length: 35 }, (_, i) => (
				<div
					key={`spark-${i}`}
					className="ai-spark"
					style={{
						left: `${25 + Math.random() * 50}%`,
						bottom: `${5 + Math.random() * 90}%`,
						animationDelay: `${Math.random() * 15}s`,
						animationDuration: `${12 + Math.random() * 10}s`,
					}}
				/>
			))}
			
			{/* Magical Fireflies */}
			{Array.from({ length: 25 }, (_, i) => (
				<div
					key={`firefly-${i}`}
					className="firefly-particle"
					style={{
						left: `${20 + Math.random() * 60}%`,
						bottom: `${5 + Math.random() * 95}%`,
						animationDelay: `${Math.random() * 12}s`,
						animationDuration: `${10 + Math.random() * 8}s`,
					}}
				/>
			))}
			
			{/* 3D Particle System with Parallax Depth */}
			{Array.from({ length: 30 }, (_, i) => {
				const depth = i % 3; // 0=near, 1=mid, 2=far
				const depthClass = depth === 0 ? 'near' : depth === 1 ? 'mid' : 'far';
				const size = depth === 0 ? 2 + Math.random() * 2 : depth === 1 ? 1.5 + Math.random() * 1.5 : 1 + Math.random() * 1;
				
				return (
					<div
						key={`particle3d-${i}`}
						className={`particle-3d ${depthClass}`}
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							width: `${size}px`,
							height: `${size}px`,
							background: depth === 0 
								? 'radial-gradient(circle, #00d4ff, #0891b2)' 
								: depth === 1 
								? 'radial-gradient(circle, #9333ea, #7c3aed)'
								: 'radial-gradient(circle, #06b6d4, #0e7490)',
							animationDelay: `${Math.random() * 20}s`,
							animationDuration: `${15 + Math.random() * 10}s`,
						}}
					/>
				);
			})}
			
			{/* Enhanced Starfield with Parallax */}
			{Array.from({ length: 40 }, (_, i) => {
				const depth = Math.floor(Math.random() * 3);
				const opacity = depth === 0 ? 0.6 + Math.random() * 0.4 : depth === 1 ? 0.4 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2;
				
				return (
					<div
						key={`star3d-${i}`}
						className="absolute bg-white rounded-full star-twinkle"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							width: `${0.5 + Math.random() * (depth === 0 ? 1.5 : depth === 1 ? 1 : 0.5)}px`,
							height: `${0.5 + Math.random() * (depth === 0 ? 1.5 : depth === 1 ? 1 : 0.5)}px`,
							animationDelay: `${Math.random() * 3}s`,
							opacity,
							zIndex: depth === 0 ? 2 : depth === 1 ? 1 : 0,
							filter: depth === 2 ? 'blur(0.5px)' : 'none',
						}}
					/>
				);
			})}
			
			{/* Smoke Particles Behind Panels for Immersion */}
			{Array.from({ length: 15 }, (_, i) => (
				<div
					key={`smoke-behind-${i}`}
					className="smoke-particle smoke-behind-panel"
					style={{
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${5 + Math.random() * 8}px`,
						height: `${5 + Math.random() * 8}px`,
						background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2), transparent)',
						animationDelay: `${Math.random() * 15}s`,
						animationDuration: `${20 + Math.random() * 15}s`,
					}}
				/>
			))}
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

				{/* Sidebar - only shown when no active chat */}
				{showSidebar && (
					<>
						{/* Mobile Overlay */}
						<div 
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
							onClick={() => setSidebarOpen(false)}
						/>
						
						<aside className="w-72 holographic-panel immersive-panel border-r border-white/30 p-4 flex flex-col fixed md:relative z-50 h-full md:h-auto transition-all duration-500 ease-in-out floating-depth">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold flex items-center gap-3 text-white">
								<img src="/genie-lamp.svg" alt="Genie Lamp" className="h-7 w-7 animate-float-gentle premium-glow" />
								<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
									Genie
								</span>
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
						
						<Button
							className="mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 holographic-panel rounded-full py-3 px-6 font-semibold neon-glow hover:neon-purple-glow relative overflow-hidden"
							onClick={startNewChat}
						>
							<Plus className="h-5 w-5 mr-2" />
							New Chat
						</Button>
						
						<ScrollArea className="flex-1">
							<div className="space-y-3">
								{chats.map((c) => (
									<button
										key={c.id}
										onClick={() => setActiveChatId(c.id)}
										className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-500 hover:scale-105 group glassmorphism relative ${
											activeChatId === c.id 
												? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/60 active-glow' 
												: 'hover:bg-white/10 border border-white/10 hover:border-white/30 hover:active-glow'
										}`}
									>
										{/* Glowing left accent bar for active state */}
										{activeChatId === c.id && (
											<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-l-xl premium-glow"></div>
										)}
										<span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-300 flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full ${activeChatId === c.id ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
											{c.title}
										</span>
									</button>
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
								<Button 
									variant="ghost" 
									size="sm" 
									onClick={() => setActiveChatId(null)}
									className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
								>
									<PanelLeft className="h-4 w-4 mr-2" /> 
									All Chats
								</Button>
								<Badge className="gradient-blue text-white border-0 glow-blue">Chat</Badge>
							</div>
							<div className="flex items-center gap-2">
								<Button 
									variant="outline" 
									size="sm" 
									onClick={() => setSidebarOpen((v) => !v)}
									className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 hidden md:block"
								>
									{showSidebar ? "Collapse" : "Expand"}
								</Button>
								
								{/* Mobile Workbench Toggle */}
								<Button 
									variant="outline" 
									size="sm" 
									onClick={() => setTab(tab === "code" ? "docs" : "code")}
									className="border-white/20 text-white hover:bg-white/10 transition-all duration-300 lg:hidden"
								>
									<FileCode2 className="h-4 w-4 mr-1" />
									Workbench
								</Button>
							</div>
						</div>
						<Separator className="bg-white/10" />
						<ScrollArea className="flex-1">
							<div className="p-4 space-y-6">
								{messages.map((m, index) => (
									<div 
										key={m.id} 
										className={`max-w-[85%] rounded-2xl p-5 shadow-2xl transition-all duration-700 holographic-panel floating-depth group ${
											m.role === "user" 
												? "ml-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" 
												: "mr-auto text-white border border-white/30"
										}`}
										style={{ 
											animation: `chatBubbleFloat 0.6s ease-out ${index * 150}ms both${m.role === "assistant" ? ', aiPulse 3s ease-in-out infinite' : ''}`,
											boxShadow: m.role === "assistant" 
												? '0 0 20px rgba(147, 51, 234, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)' 
												: '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(0, 0, 0, 0.4)',
										}}
									>
										<div className="flex items-start gap-3">
											<div className={`w-8 h-8 rounded-full flex items-center justify-center ${
												m.role === "user" 
													? "bg-blue-500/20 border border-blue-400/50" 
													: "bg-purple-500/20 border border-purple-400/50"
											}`}>
												{m.role === "user" ? (
													<span className="text-blue-200 font-bold text-sm">U</span>
												) : (
													<img src="/genie-lamp.svg" alt="Genie" className="h-4 w-4" />
												)}
											</div>
											<div className="flex-1">
												<p className="text-sm leading-relaxed mb-3">{m.content}</p>
										{m.role === "assistant" && (
													<div className="mt-4 flex items-center gap-3 flex-wrap">
														<Button 
															size="sm" 
															className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:scale-110 transition-all duration-300 neon-glow hover:neon-cyan-glow rounded-full px-4 py-2 text-xs font-medium holographic-panel relative overflow-hidden"
														>
															<FileCode2 className="h-3.5 w-3.5 mr-2" /> 
															Generate Code
														</Button>
														<Button 
															size="sm" 
															className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-110 transition-all duration-300 neon-purple-glow hover:neon-glow rounded-full px-4 py-2 text-xs font-medium holographic-panel relative overflow-hidden"
														>
															<BookOpenText className="h-3.5 w-3.5 mr-2" /> 
															Explain
														</Button>
														<Button 
															size="sm" 
															className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:scale-110 transition-all duration-300 neon-green-glow hover:neon-cyan-glow rounded-full px-4 py-2 text-xs font-medium holographic-panel relative overflow-hidden"
														>
															<Rocket className="h-3.5 w-3.5 mr-2" /> 
															Fix Bug
														</Button>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
						<Separator className="bg-white/10" />
						<div className="p-4 border-t border-white/20">
							<div className="flex items-center gap-3">
								<Input
									placeholder="Message Genie..."
									value={composer}
									onChange={(e) => setComposer(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleSend();
										}
									}}
									className="flex-1 premium-card border-white/20 text-white placeholder:text-white/50 focus:premium-glow focus:border-blue-400 transition-all duration-500 rounded-xl py-3 px-4"
								/>
								<Button 
									onClick={handleSend}
									className="gradient-blue text-white border-0 hover:scale-110 transition-all duration-300 premium-glow rounded-xl py-3 px-6 font-semibold"
								>
									<Send className="h-4 w-4 mr-2" /> 
									Send
								</Button>
							</div>
						</div>
					</section>

					{/* Right: Workbench - Desktop */}
					<section className="flex flex-col holographic-panel immersive-panel hidden lg:flex floating-depth">
						<div className="p-4 border-b border-white/10">
							<Tabs value={tab} onValueChange={setTab}>
								<TabsList className="glassmorphism border-white/20">
									<TabsTrigger 
										value="code"
										className="data-[state=active]:gradient-blue data-[state=active]:text-white data-[state=active]:glow-blue transition-all duration-300"
									>
										<FileCode2 className="h-4 w-4 mr-2" /> 
										Code
									</TabsTrigger>
									<TabsTrigger 
										value="docs"
										className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:glow-purple transition-all duration-300"
									>
										<BookOpenText className="h-4 w-4 mr-2" /> 
										Docs
									</TabsTrigger>
									<TabsTrigger 
										value="preview"
										className="data-[state=active]:gradient-green data-[state=active]:text-white transition-all duration-300"
									>
										<MonitorPlay className="h-4 w-4 mr-2" /> 
										Output/Preview
									</TabsTrigger>
									<TabsTrigger 
										value="github"
										className="data-[state=active]:gradient-pink data-[state=active]:text-white transition-all duration-300"
									>
										<GithubIcon className="h-4 w-4 mr-2" /> 
										GitHub
									</TabsTrigger>
									<TabsTrigger 
										value="deploy"
										className="data-[state=active]:gradient-blue data-[state=active]:text-white data-[state=active]:glow-blue transition-all duration-300"
									>
										<Rocket className="h-4 w-4 mr-2" /> 
										Deploy
									</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
						<div className="flex-1 overflow-hidden">
							{tab === "code" && <CodeTab />}
							{tab === "docs" && <DocsTab />}
							{tab === "preview" && <PreviewTab />}
							{tab === "github" && <GithubTab />}
							{tab === "deploy" && <DeployTab />}
						</div>
					</section>
				</main>
				
				{/* Mobile Workbench - Shows below chat on mobile */}
				<section className="flex flex-col holographic-panel immersive-panel lg:hidden floating-depth">
					<div className="p-4 border-t border-white/10">
						<Tabs value={tab} onValueChange={setTab}>
							<TabsList className="glassmorphism border-white/20 w-full">
								<TabsTrigger 
									value="code"
									className="data-[state=active]:gradient-blue data-[state=active]:text-white data-[state=active]:glow-blue transition-all duration-300 flex-1"
								>
									<FileCode2 className="h-4 w-4 mr-1" /> 
									Code
								</TabsTrigger>
								<TabsTrigger 
									value="docs"
									className="data-[state=active]:gradient-purple data-[state=active]:text-white data-[state=active]:glow-purple transition-all duration-300 flex-1"
								>
									<BookOpenText className="h-4 w-4 mr-1" /> 
									Docs
								</TabsTrigger>
								<TabsTrigger 
									value="preview"
									className="data-[state=active]:gradient-green data-[state=active]:text-white transition-all duration-300 flex-1"
								>
									<MonitorPlay className="h-4 w-4 mr-1" /> 
									Preview
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<div className="flex-1 overflow-hidden">
						{tab === "code" && <CodeTab />}
						{tab === "docs" && <DocsTab />}
						{tab === "preview" && <PreviewTab />}
					</div>
				</section>
			</div>
		</div>
	);
};

const PanelContainer: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
	<div className={["rounded-md border border-white/10 bg-gray-800/50 shadow-sm", className].join(" ")}>{children}</div>
);

const CodeTab: React.FC = () => {
	return (
		<div className="h-full grid grid-rows-[1fr_auto] gap-4 p-4">
			<div className="grid grid-cols-[1fr_320px] gap-4 min-h-0">
				{/* Code Editor */}
				<PanelContainer className="floating-glass border-white/30 shadow-2xl floating-depth neon-glow">
					<div className="h-full flex flex-col">
						<div className="flex items-center justify-between border-b border-white/20 p-4">
							<h3 className="text-sm font-semibold text-white flex items-center gap-2">
								<FileCode2 className="h-4 w-4 text-cyan-400 neon-cyan-glow" />
								Editor
							</h3>
							<Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 neon-cyan-glow">TypeScript</Badge>
						</div>
						<ScrollArea className="flex-1">
							<div className="bg-[#0a0a0a] p-4 font-mono text-sm relative border border-cyan-400/20">
								{/* Line numbers */}
								<div className="flex">
									<div className="text-gray-600 mr-6 select-none text-xs">
										{Array.from({ length: 15 }, (_, i) => (
											<div key={i} className="leading-6">{i + 1}</div>
										))}
									</div>
									<div className="flex-1 text-gray-200 relative">
										{/* Active line highlight with neon glow */}
										<div className="absolute left-0 right-0 h-6 bg-cyan-500/20 border-l-2 border-cyan-400 -ml-2 pl-2 neon-cyan-glow"></div>
										
										<div className="leading-6">
											<span className="text-cyan-400 font-semibold neon-text">function</span>{" "}
											<span className="text-yellow-300 font-semibold neon-text">hello</span>
											<span className="text-white">()</span>{" "}
											<span className="text-white">{`{`}</span>
										</div>
										<div className="leading-6 ml-4">
											<span className="text-gray-400">console</span>
											<span className="text-white">.</span>
											<span className="text-yellow-300 font-semibold neon-text">log</span>
											<span className="text-white">(</span>
											<span className="text-green-400 neon-text">'Hello Genie'</span>
											<span className="text-white">);</span>
											<span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-typing-cursor neon-cyan-glow"></span>
										</div>
										<div className="leading-6">
											<span className="text-white">{`}`}</span>
										</div>
										
										{/* Additional code lines with enhanced syntax highlighting */}
										<div className="leading-6 mt-4">
											<span className="text-purple-400 font-semibold">const</span>{" "}
											<span className="text-yellow-300 font-semibold">message</span>
											<span className="text-white"> = </span>
											<span className="text-green-400">"Welcome to Genie"</span>
											<span className="text-white">;</span>
										</div>
										<div className="leading-6">
											<span className="text-gray-400">// AI-powered development</span>
										</div>
										<div className="leading-6 mt-2">
											<span className="text-blue-400 font-semibold">interface</span>{" "}
											<span className="text-yellow-300 font-semibold">GenieResponse</span>{" "}
											<span className="text-white">{`{`}</span>
										</div>
										<div className="leading-6 ml-4">
											<span className="text-cyan-400">code</span>
											<span className="text-white">: </span>
											<span className="text-green-400">string</span>
											<span className="text-white">;</span>
										</div>
										<div className="leading-6">
											<span className="text-white">{`}`}</span>
										</div>
									</div>
								</div>
								
								{/* Enhanced editor glow effects */}
								<div className="absolute inset-0 pointer-events-none">
									<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
									<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
									<div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
								</div>
							</div>
						</ScrollArea>
					</div>
				</PanelContainer>
				
				{/* Versions Panel */}
				<PanelContainer className="floating-glass border-white/30 shadow-2xl floating-depth neon-purple-glow">
					<div className="h-full flex flex-col">
						<div className="flex items-center justify-between border-b border-white/20 p-4">
							<h3 className="text-sm font-semibold text-white flex items-center gap-2">
								<BookOpenText className="h-4 w-4 text-purple-400 neon-purple-glow" />
								Versions
							</h3>
							<Button 
								size="sm" 
								className="bg-gradient-to-r from-blue-500 to-pink-500 text-white border-0 hover:scale-110 transition-all duration-300 neon-glow hover:neon-purple-glow rounded-full px-4 py-2"
							>
								Compare
							</Button>
						</div>
						<ScrollArea className="flex-1">
							<div className="p-4 space-y-4">
								<div className="floating-glass border border-white/20 rounded-xl p-4 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 cursor-pointer group hover:neon-glow floating-depth">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
												<FileCode2 className="h-4 w-4 text-blue-400" />
											</div>
											<div>
												<span className="text-sm font-semibold text-white">v1 - Initial</span>
												<div className="text-xs text-gray-400">2 hours ago</div>
											</div>
										</div>
										<Button 
											size="sm" 
											variant="ghost"
											className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full hover:scale-110"
										>
											Restore
										</Button>
									</div>
								</div>
								
								<div className="floating-glass border border-white/20 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 cursor-pointer group hover:neon-purple-glow floating-depth">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center">
												<Rocket className="h-4 w-4 text-purple-400" />
											</div>
											<div>
												<span className="text-sm font-semibold text-white">v2 - Add feature</span>
												<div className="text-xs text-gray-400">1 hour ago</div>
											</div>
										</div>
										<Button 
											size="sm" 
											variant="ghost"
											className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full hover:scale-110"
										>
											Restore
										</Button>
									</div>
								</div>
								
								<div className="floating-glass border border-white/20 rounded-xl p-4 hover:border-green-400/50 transition-all duration-500 hover:scale-105 cursor-pointer group hover:neon-green-glow floating-depth">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-400/50 flex items-center justify-center">
												<MonitorPlay className="h-4 w-4 text-green-400" />
											</div>
											<div>
												<span className="text-sm font-semibold text-white">v3 - Bug fixes</span>
												<div className="text-xs text-gray-400">30 minutes ago</div>
											</div>
										</div>
										<Button 
											size="sm" 
											variant="ghost"
											className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-full hover:scale-110"
										>
											Restore
										</Button>
									</div>
								</div>
							</div>
						</ScrollArea>
					</div>
				</PanelContainer>
			</div>
			
			{/* Output Panel */}
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl min-h-0 floating-panel">
				<div className="h-48 p-4">
					<div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
						<MonitorPlay className="h-3 w-3" />
						Output logs / run results...
					</div>
					<ScrollArea className="h-full">
						<div className="bg-[#0a0a0a] rounded-lg p-4 font-mono text-xs relative overflow-hidden border border-purple-400/30 neon-purple-glow">
							{/* Enhanced neon grid background */}
							<div className="absolute inset-0 opacity-10">
								<div className="grid grid-cols-20 gap-1 h-full">
									{Array.from({ length: 200 }, (_, i) => (
										<div key={i} className="w-full h-full bg-purple-400 animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
									))}
								</div>
							</div>
							
							{/* Glowing purple top border */}
							<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/80 to-transparent neon-purple-glow"></div>
							
							<div className="relative z-10 space-y-1">
								<div className="text-green-400 neon-text animate-fade-up">$ yarn dev</div>
								<div className="text-white animate-fade-up" style={{ animationDelay: '100ms' }}>Server started...</div>
								<div className="text-cyan-400 neon-text animate-fade-up" style={{ animationDelay: '200ms' }}>✓ Ready in 312ms</div>
								<div className="text-gray-400 animate-fade-up" style={{ animationDelay: '300ms' }}>➜ Local: http://localhost:5173/</div>
								<div className="text-yellow-400 neon-text animate-fade-up" style={{ animationDelay: '400ms' }}>⚠ Hot reload enabled</div>
								<div className="text-blue-400 animate-fade-up" style={{ animationDelay: '500ms' }}>📦 Building modules...</div>
								<div className="text-purple-400 neon-text animate-fade-up" style={{ animationDelay: '600ms' }}>🎯 Target: modern browsers</div>
								<div className="text-emerald-400 animate-fade-up" style={{ animationDelay: '700ms' }}>✨ Optimizing assets</div>
								<div className="text-pink-400 neon-text animate-fade-up" style={{ animationDelay: '800ms' }}>🚀 Development server ready</div>
								<div className="text-cyan-300 animate-fade-up" style={{ animationDelay: '900ms' }}>⚡ Fast refresh enabled</div>
								<div className="text-green-300 neon-text animate-fade-up" style={{ animationDelay: '1000ms' }}>🔧 TypeScript checking...</div>
							</div>
							
							{/* Enhanced animated scan lines */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
								<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/60 to-transparent animate-pulse delay-1000"></div>
								<div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent animate-pulse delay-500"></div>
							</div>
						</div>
					</ScrollArea>
				</div>
			</PanelContainer>
		</div>
	);
};

const DocsTab: React.FC = () => {
	return (
		<div className="h-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
			<PanelContainer className="premium-card border-white/20 shadow-2xl hover:scale-105 transition-all duration-500 hover:premium-glow">
				<div className="p-4 space-y-4">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2">
						<BookOpenText className="h-4 w-4 text-purple-400" />
						README
					</h3>
					<div className="text-sm text-gray-300 leading-relaxed">
						Project overview and setup instructions for the Genie AI Development Assistant...
					</div>
					<Button className="gradient-purple text-white border-0 hover:scale-110 transition-all duration-300 premium-glow rounded-full px-4 py-2">
						View Full Docs
					</Button>
				</div>
			</PanelContainer>
			
			<PanelContainer className="premium-card border-white/20 shadow-2xl hover:scale-105 transition-all duration-500 hover:premium-glow">
				<div className="p-4 space-y-4">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2">
						<BookOpenText className="h-4 w-4 text-blue-400" />
						User Manual
					</h3>
					<div className="text-sm text-gray-300 leading-relaxed">
						How to use Genie for your development workflows and best practices...
					</div>
					<Button className="gradient-blue text-white border-0 hover:scale-110 transition-all duration-300 premium-glow rounded-full px-4 py-2">
						Get Started
					</Button>
				</div>
			</PanelContainer>
			
			<PanelContainer className="lg:col-span-2 premium-card border-white/20 shadow-2xl">
				<div className="p-4">
					<h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
						<MonitorPlay className="h-4 w-4 text-green-400" />
						Workflow Diagram
					</h3>
					<div className="h-56 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
						{/* Animated background pattern */}
						<div className="absolute inset-0 opacity-10">
							<div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float-gentle"></div>
							<div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-gentle delay-1000"></div>
							<div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-gentle delay-500"></div>
						</div>
						<div className="text-center text-gray-400 relative z-10">
							<MonitorPlay className="h-12 w-12 mx-auto mb-2 opacity-50 animate-float-gentle" />
							<p className="text-sm">Interactive workflow diagram</p>
						</div>
					</div>
				</div>
			</PanelContainer>
		</div>
	);
};

const PreviewTab: React.FC = () => {
	return (
		<div className="h-full p-4 grid grid-rows-[1fr_240px] gap-4">
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl">
				<div className="h-full">
					<div className="flex items-center justify-between border-b border-white/10 p-3">
						<h3 className="text-sm font-semibold text-white flex items-center gap-2">
							<MonitorPlay className="h-4 w-4 text-green-400" />
							Live Preview
						</h3>
						<Badge className="gradient-green text-white border-0">Running</Badge>
					</div>
					<iframe 
						title="preview" 
						className="w-full h-full rounded-b-lg" 
						srcDoc="<html><body style='font-family:system-ui;padding:16px;background:linear-gradient(135deg,#1e1b4b,#0f0f23);color:white'>Live preview of your application</body></html>" 
					/>
				</div>
			</PanelContainer>
			
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl">
				<div className="h-full p-3">
					<div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
						<h3 className="text-sm font-semibold text-white flex items-center gap-2">
							<MonitorPlay className="h-4 w-4 text-blue-400" />
							Terminal Output
						</h3>
						<Badge className="gradient-blue text-white border-0 glow-blue">Active</Badge>
					</div>
					<ScrollArea className="h-full">
						<div className="bg-[#1e1e1e] rounded-lg p-3 font-mono text-xs">
							<div className="text-green-400">$ npm run dev</div>
							<div className="text-white">✓ Vite server started</div>
							<div className="text-blue-400">➜ Local: http://localhost:5173/</div>
							<div className="text-gray-400">✓ Ready in 312ms</div>
							<div className="text-yellow-400">⚠ Hot reload enabled</div>
						</div>
					</ScrollArea>
				</div>
			</PanelContainer>
		</div>
	);
};

const GithubTab: React.FC = () => {
	return (
		<div className="h-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
				<div className="p-4">
					<h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
					<GithubIcon className="h-4 w-4 text-pink-400" />
					Repo Status
					</h3>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
							<span className="text-sm text-white">Main branch</span>
						</div>
						<div className="text-sm text-gray-300">12 commits ahead</div>
						<Button className="gradient-pink text-white border-0 hover:scale-105 transition-all duration-300 mt-3">
							View on GitHub
						</Button>
					</div>
				</div>
			</PanelContainer>
			
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl hover:scale-105 transition-all duration-300">
				<div className="p-4">
					<h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
						<FileCode2 className="h-4 w-4 text-blue-400" />
						Recent Commits
					</h3>
					<div className="space-y-3">
						<div className="glassmorphism border border-white/10 rounded-lg p-3">
							<div className="text-sm text-white font-medium">feat: initial layout</div>
							<div className="text-xs text-gray-400">2 hours ago</div>
						</div>
						<div className="glassmorphism border border-white/10 rounded-lg p-3">
							<div className="text-sm text-white font-medium">chore: tooling setup</div>
							<div className="text-xs text-gray-400">3 hours ago</div>
						</div>
					</div>
				</div>
			</PanelContainer>
		</div>
	);
};

const DeployTab: React.FC = () => {
	return (
		<div className="h-full p-4 grid gap-4">
			<PanelContainer className="glassmorphism border-white/20 shadow-2xl">
				<div className="p-4 space-y-4">
					<h3 className="text-sm font-semibold text-white flex items-center gap-2">
						<Rocket className="h-4 w-4 text-blue-400" />
						Deployment Status
					</h3>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-white">Progress: 70%</span>
							<div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
								<div className="w-3/4 h-full gradient-blue rounded-full animate-pulse-glow"></div>
							</div>
						</div>
						<div className="text-xs text-gray-400">Deploying to production...</div>
						<Button 
							size="sm" 
							className="gradient-blue text-white border-0 hover:scale-105 transition-all duration-300 glow-blue"
						>
							Open Deployed App
						</Button>
					</div>
				</div>
			</PanelContainer>
		</div>
	);
};

export default GenieApp;



