import ReactMarkdown from "react-markdown";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Plus,
	Send,
	MessageSquare,
	RefreshCw,
	Loader2,
	Sparkles,
	FileText,
	BookOpen,
	X,
	MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FuturisticBackground from "./FuturisticBackground";
import FloatingSparkles from "./FloatingSparkles";
import GlowOrbs from "./GlowOrbs";
import AuroraGradient from "./AuroraGradient";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "../contexts/AuthContext";
import type { UserPlan } from "../contexts/AuthContext";
import { usePricing } from "../hooks/usePricing";
type MessageRole = "user" | "assistant";
interface ApiMessage {
	role: MessageRole;
	content: string;
}
interface ChatMessage extends ApiMessage {
	id: string;
	pending?: boolean;
}
interface DocPreviewData {
	uploadId: string;
	fileName: string;
	readme: string;
	userManual: string;
	filesAnalyzed: number;
	previewFiles: string[];
	topLevel: string[];
	folderPath: string;
	readmePath?: string;
	userManualPath?: string;
	fallbackUsed?: boolean;
}
type UploadResponseDTO = {
	upload_id: string;
	file_name: string;
	total_files: number;
	top_level: string[];
	preview_files: string[];
	folder_path: string;
};
type DocsResponseDTO = {
	upload_id: string;
	status: string;
	readme?: string;
	user_manual?: string;
	files_analyzed?: number;
	folder_path?: string;
	readme_path?: string;
	user_manual_path?: string;
	fallback_used?: boolean;
};
type FileNodeType = "file" | "folder";

interface ProjectFileNode {
	type: FileNodeType;
	name: string;
	path: string;
	children?: ProjectFileNode[];
}

interface ProjectFileTreeResponse {
	project_id: string;
	files: ProjectFileNode[];
}
const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000";
const glassPanel =
	"bg-slate-900/70 border border-slate-700/40 backdrop-blur-2xl shadow-[0_18px_60px_rgba(8,11,34,0.55)]";
const ChatDashboard: React.FC = () => {
	const { user, session, signOut, signIn, loading } = useAuth();
	const navigate = useNavigate();
	const { pricing } = usePricing();
	const userId = user?.id ?? null;
	const userPlan: UserPlan = user?.plan ?? "free";
	const githubAccessToken = user?.githubAccessToken ?? null;
	const authHeaders = useMemo(() => {
		const headers: Record<string, string> = {};
		if (session?.access_token) {
			headers.Authorization = `Bearer ${session.access_token}`;
		}
		if (githubAccessToken) {
			headers["X-Github-Token"] = githubAccessToken;
		}
		return headers;
	}, [githubAccessToken, session]);
	const [threads, setThreads] = useState<string[]>([]);
	const [currentThread, setCurrentThread] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [loadingThreads, setLoadingThreads] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [docPreview, setDocPreview] = useState<DocPreviewData | null>(null);
	const [activeDocTab, setActiveDocTab] = useState<"readme" | "user_manual">("readme");
	const [generatingDocs, setGeneratingDocs] = useState(false);
	const [atBottom, setAtBottom] = useState(true);
	const [showUpgradeModal, setShowUpgradeModal] = useState(false);
	const [upgradeLoading, setUpgradeLoading] = useState(false);
	const [upgradeError, setUpgradeError] = useState<string | null>(null);
	const [codeExplorerOpen, setCodeExplorerOpen] = useState(false);
	const [codeExplorerProjectId, setCodeExplorerProjectId] = useState<string | null>(null);
	const [codeTree, setCodeTree] = useState<ProjectFileNode[] | null>(null);
	const [codeTreeLoading, setCodeTreeLoading] = useState(false);
	const [codeTreeError, setCodeTreeError] = useState<string | null>(null);
	const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
	const [selectedFileContent, setSelectedFileContent] = useState<string>("");
	const [selectedFileLoading, setSelectedFileLoading] = useState(false);
	const [reconnectingGithub, setReconnectingGithub] = useState(false);
	const [showAccountPanel, setShowAccountPanel] = useState(false);
	const githubTokenMissing = !githubAccessToken;
	const avatarUrl =
		(user?.user_metadata?.avatar_url as string | undefined) ?? undefined;
	const deriveInitials = (value?: string | null) => {
		if (!value) return "";
		return value
			.split(" ")
			.filter(Boolean)
			.map((part) => part[0])
			.join("")
			.toUpperCase();
	};
	const userInitials =
		deriveInitials(user?.user_metadata?.full_name) ||
		user?.email?.[0]?.toUpperCase() ||
		"U";
	const userDisplayName =
		user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Genie user";
	const userEmail = user?.email ?? "No email available";
	const githubUsername =
		user?.user_metadata?.user_name ||
		user?.user_metadata?.preferred_username ||
		user?.user_metadata?.nickname ||
		"";
	const githubAccountLabel = githubUsername
		? `@${githubUsername}`
		: "Not connected";
	const githubStatusText = githubTokenMissing
		? "Reconnect GitHub so Genie can push commits, deploy, and manage repositories for you."
		: "Connected. Genie can push commits, deploy code, and run GitHub automations.";
	const handleReconnectGithub = useCallback(async () => {
		setReconnectingGithub(true);
		try {
			await signIn("github");
		} catch (err) {
			console.error("GitHub reconnect failed", err);
		} finally {
			setReconnectingGithub(false);
		}
	}, [signIn]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const composerFormRef = useRef<HTMLFormElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const accountButtonRef = useRef<HTMLButtonElement | null>(null);
	const accountPanelRef = useRef<HTMLDivElement | null>(null);
	const pendingAssistantId = useRef<string | null>(null);
	const latestThreadIdRef = useRef<string | null>(null);
	const wasAtBottomRef = useRef(true);
	const appendAssistantMessage = useCallback(
		(content: string) => {
			setMessages((prev) => [
				...prev.filter((msg) => msg.id !== pendingAssistantId.current),
				{
					id: `assistant-error-${Date.now()}`,
					role: "assistant",
					content,
				},
			]);
		},
		[]
	);
	const scrollToBottom = useCallback(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		viewport.scrollTop = viewport.scrollHeight;
		setAtBottom(true);
		wasAtBottomRef.current = true;
	}, []);
	const adjustComposerHeight = useCallback(
		(element?: HTMLTextAreaElement | null) => {
			const textarea = element ?? textAreaRef.current;
			if (!textarea) return;
			const baseHeight = 3 * 16; // ~3rem default height
			const maxHeight = 6 * 24; // cap at ~6 lines assuming 1.5rem line height
			textarea.style.height = "auto";
			const contentHeight = textarea.scrollHeight;
			const newHeight = Math.min(Math.max(contentHeight, baseHeight), maxHeight);
			textarea.style.height = `${newHeight}px`;
			textarea.style.overflowY =
				contentHeight > newHeight ? "auto" : "hidden";
			if (contentHeight > maxHeight) {
				textarea.scrollTop = textarea.scrollHeight;
			}
		},
		[]
	);
	useEffect(() => {
		if (wasAtBottomRef.current) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]);
	useEffect(() => {
		adjustComposerHeight();
	}, [input, adjustComposerHeight]);
	useEffect(() => {
		if (!loading && !user) {
			navigate("/");
		}
	}, [loading, navigate, user]);
	useEffect(() => {
		const viewport = viewportRef.current;
		if (!viewport) return;
		const handleScroll = () => {
			const nearBottom =
				viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop < 72;
			setAtBottom(nearBottom);
			wasAtBottomRef.current = nearBottom;
		};
		handleScroll();
		viewport.addEventListener("scroll", handleScroll);
		return () => {
			viewport.removeEventListener("scroll", handleScroll);
		};
	}, []);
	useEffect(() => {
		if (!showAccountPanel) {
			return;
		}
		const handlePointerDown = (event: MouseEvent) => {
			const target = event.target as Node;
			const panel = accountPanelRef.current;
			const trigger = accountButtonRef.current;
			if (
				panel &&
				!panel.contains(target) &&
				(!trigger || !trigger.contains(target))
			) {
				setShowAccountPanel(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setShowAccountPanel(false);
			}
		};
		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [showAccountPanel]);
	useEffect(() => {
		if (!user) {
			setShowAccountPanel(false);
		}
	}, [user]);
	const handleComposerChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInput(event.target.value);
			adjustComposerHeight(event.target);
		},
		[adjustComposerHeight]
	);
	const handleComposerKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (
				event.key === "Enter" &&
				!event.shiftKey &&
				!event.ctrlKey &&
				!event.metaKey &&
				!event.altKey
			) {
				event.preventDefault();
				if (!input.trim() || sending) return;
				composerFormRef.current?.requestSubmit();
			}
		},
		[input, sending]
	);
	const handleUpgradeClick = useCallback(() => {
		if (!userId) {
			setError("You must be logged in to manage billing.");
			return;
		}
		setUpgradeError(null);
		setShowUpgradeModal(true);
	}, [userId, setError]);

	const closeUpgradeModal = useCallback(() => {
		if (upgradeLoading) return;
		setShowUpgradeModal(false);
		setUpgradeError(null);
	}, [upgradeLoading]);

	const startCheckout = useCallback(async () => {
		if (!userId) {
			setUpgradeError("Please sign in first.");
			return;
		}
		setUpgradeError(null);
		setUpgradeLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/billing/create-checkout-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...authHeaders,
				},
				body: JSON.stringify({ user_id: userId }),
			});
			if (!response.ok) {
				let detail = `Unable to start checkout (${response.status})`;
				try {
					const data = await response.json();
					if (data?.detail) {
						detail = data.detail;
					}
				} catch {
					// ignore json parse errors
				}
				throw new Error(detail);
			}
			const data = await response.json();
			if (data?.url) {
				window.location.href = data.url;
				return;
			}
			throw new Error("Checkout URL was not returned.");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unable to start checkout.";
			setUpgradeError(message);
		} finally {
			setUpgradeLoading(false);
		}
	}, [authHeaders, userId]);
	const fetchThreads = useCallback(async () => {
		if (!userId) {
			return [];
		}
		setLoadingThreads(true);
		setError(null);
		try {
			const response = await fetch(
				`${API_BASE_URL}/threads?user_id=${encodeURIComponent(userId)}`,
				{
					headers: {
						...authHeaders,
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Unable to load threads (${response.status})`);
			}
			type ThreadListItemDTO = { thread_id: string; title: string; message_count: number };
			const data: { threads: ThreadListItemDTO[] } = await response.json();
			const ids = data.threads.map((t) => t.thread_id);
			const ordered = [...ids].sort((a, b) => (a < b ? 1 : -1));
			setThreads(ordered);
			return ordered;
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unexpected error while loading threads";
			setError(message);
			return [];
		} finally {
			setLoadingThreads(false);
		}
	}, [authHeaders, userId]);
	const ensureThread = useCallback(async () => {
		if (currentThread) {
			latestThreadIdRef.current = currentThread;
			return currentThread;
		}
		try {
			const response = await fetch(`${API_BASE_URL}/threads`, {
				method: "POST",
				headers: {
					...authHeaders,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to create a new thread");
			}
			const data: { thread_id: string } = await response.json();
			setThreads((prev) => [data.thread_id, ...prev]);
			setCurrentThread(data.thread_id);
			latestThreadIdRef.current = data.thread_id;
			return data.thread_id;
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unexpected error while creating thread";
			setError(message);
			throw err;
		}
	}, [authHeaders, currentThread]);
	const fetchMessages = useCallback(
		async (threadId: string) => {
			if (!userId) {
				return;
			}
			setLoadingMessages(true);
			setError(null);
			try {
				const response = await fetch(
					`${API_BASE_URL}/threads/${threadId}/messages?user_id=${encodeURIComponent(
						userId
					)}`,
					{
						headers: {
							...authHeaders,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`Unable to load conversation (${response.status})`);
				}
				const data: { thread_id: string; messages: ApiMessage[] } =
					await response.json();
				const chatMessages: ChatMessage[] = data.messages.map((msg, index) => ({
					...msg,
					id: `${msg.role}-${index}-${data.thread_id}`,
				}));
				setMessages(chatMessages);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: "Unexpected error while loading conversation";
				setError(message);
			} finally {
				setLoadingMessages(false);
			}
		},
		[authHeaders, userId]
	);
	useEffect(() => {
		if (!userId) {
			setThreads([]);
			setCurrentThread(null);
			setMessages([]);
			return;
		}
		let cancelled = false;
		const loadThreads = async () => {
			const availableThreads = await fetchThreads();
			if (cancelled) return;
			if (availableThreads.length === 0) {
				try {
					const response = await fetch(`${API_BASE_URL}/threads`, {
						method: "POST",
						headers: {
							...authHeaders,
						},
					});
					if (!response.ok) {
						throw new Error("Unable to initialise chat thread");
					}
					const { thread_id } = await response.json();
					if (cancelled) return;
					setThreads([thread_id]);
					setCurrentThread(thread_id);
				} catch (err) {
					if (!cancelled) {
						const message =
							err instanceof Error
								? err.message
								: "Unexpected error while initialising chat";
						setError(message);
					}
				}
				return;
			}
			setCurrentThread((previous) => {
				if (previous && availableThreads.includes(previous)) {
					return previous;
				}
				return availableThreads[0];
			});
		};
		loadThreads();
		return () => {
			cancelled = true;
		};
	}, [authHeaders, fetchThreads, userId]);
	useEffect(() => {
		if (!currentThread || !userId) {
			return;
		}
		fetchMessages(currentThread);
	}, [currentThread, fetchMessages, userId]);
	useEffect(() => {
		latestThreadIdRef.current = currentThread;
	}, [currentThread]);
	const handleSelectThread = (threadId: string) => {
		if (threadId === currentThread) return;
		setCurrentThread(threadId);
	};
	const handleNewChat = async () => {
		setError(null);
		try {
			const response = await fetch(`${API_BASE_URL}/threads`, {
				method: "POST",
				headers: {
					...authHeaders,
				},
			});
			if (!response.ok) {
				throw new Error("Unable to start a new conversation");
			}
			const { thread_id } = await response.json();
			setThreads((prev) => [thread_id, ...prev]);
			setCurrentThread(thread_id);
			setMessages([]);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unexpected error while starting chat";
			setError(message);
		}
	};
	const handleRefreshThreads = () => {
		fetchThreads();
	};
	const handleOpenFilePicker = () => {
		fileInputRef.current?.click();
	};
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		// Reset input so the same file can be chosen again later
		event.target.value = "";
		if (!selectedFile) {
			return;
		}
		if (!selectedFile.name.toLowerCase().endsWith(".zip")) {
			setError("Please upload a .zip archive.");
			return;
		}
		setError(null);
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			const uploadResponse = await fetch(`${API_BASE_URL}/uploads`, {
				method: "POST",
				headers: {
					...authHeaders,
				},
				body: formData,
			});
			if (!uploadResponse.ok) {
				let detail = `Upload failed (${uploadResponse.status})`;
				try {
					const data = await uploadResponse.json();
					if (data?.detail) {
						detail = data.detail;
					}
				} catch {
					// ignore JSON parsing errors
				}
				throw new Error(detail);
			}
    		const uploadData: UploadResponseDTO = await uploadResponse.json();
			const infoMessage: ChatMessage = {
				id: `assistant-upload-${Date.now()}`,
				role: "assistant",
				content: `Upload successful. ID: ${uploadData.upload_id}`,
			};
			setMessages((prev) => [...prev, infoMessage]);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Unexpected error while processing the project archive.";
			setError(message);
			setDocPreview(null);
		} finally {
			setUploading(false);
			setGeneratingDocs(false);
		}
	};
	// const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	const trimmed = input.trim();
	// 	if (!trimmed) {
	// 		return;
	// 	}
	// 	setError(null);
	// 	setInput("");
	// 	setSending(true);
	// 	let threadId: string;
	// 	try {
	// 		threadId = await ensureThread();
	// 	} catch {
	// 		setSending(false);
	// 		return;
	// 	}
	// 	const createdAt = Date.now();
	// 	const userMessage: ChatMessage = {
	// 		id: `user-${createdAt}`,
	// 		role: "user",
	// 		content: trimmed,
	// 	};
	// 	const assistantPlaceholder: ChatMessage = {
	// 		id: `assistant-pending-${createdAt}`,
	// 		role: "assistant",
	// 		content: "",
	// 		pending: true,
	// 	};
	// 	pendingAssistantId.current = assistantPlaceholder.id;
	// 	setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
	// 	try {
	// 		const response = await fetch(`${API_BASE_URL}/chat`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({
	// 				message: trimmed,
	// 				thread_id: threadId,
	// 			}),
	// 		});
	// 		if (!response.ok) {
	// 			throw new Error(`Chat request failed (${response.status})`);
	// 		}
	// 		const data: { thread_id: string; reply: string; messages: ApiMessage[] } =
	// 			await response.json();
	// 		const chatMessages: ChatMessage[] = data.messages.map((msg, index) => ({
	// 			...msg,
	// 			id: `${msg.role}-${index}-${data.thread_id}`,
	// 		}));
	// 		setMessages(chatMessages);
	// 		setCurrentThread(data.thread_id);
	// 		setThreads((prev) => {
	// 			const filtered = prev.filter((id) => id !== data.thread_id);
	// 			return [data.thread_id, ...filtered];
	// 		});
	// 	} catch (err) {
	// 		const message =
	// 			err instanceof Error ? err.message : "Unexpected error during chat";
	// 		setError(message);
	// 		setMessages((prev) =>
	// 			prev.filter((msg) => msg.id !== pendingAssistantId.current)
	// 		);
	// 	} finally {
	// 		pendingAssistantId.current = null;
	// 		setSending(false);
	// 	}
	// };
	const findFirstFilePath = useCallback((nodes: ProjectFileNode[]): string | null => {
		for (const node of nodes) {
			if (node.type === "file") {
				return node.path;
			}
			if (node.children?.length) {
				const childPath = findFirstFilePath(node.children);
				if (childPath) {
					return childPath;
				}
			}
		}
		return null;
	}, []);

	const fetchFileContent = useCallback(
		async (projectId: string, filePath: string) => {
			const activeThreadId = currentThread ?? latestThreadIdRef.current;
			if (!userId || !activeThreadId) {
				setError("User or thread missing; cannot load file content.");
				return;
			}
			setSelectedFilePath(filePath);
			setSelectedFileContent("");
			setSelectedFileLoading(true);
			try {
				const response = await fetch(
					`${API_BASE_URL}/projects/${encodeURIComponent(
						projectId
					)}/file-content?user_id=${encodeURIComponent(userId)}&thread_id=${encodeURIComponent(
						activeThreadId
					)}&path=${encodeURIComponent(filePath)}`,
					{
						headers: {
							...authHeaders,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`Status ${response.status}`);
				}
				const data: { content?: string } = await response.json();
				setSelectedFileContent(data.content ?? "");
			} catch (err) {
				const message = err instanceof Error ? err.message : "Unable to load file content.";
				setSelectedFileContent(`// Error: ${message}`);
			} finally {
				setSelectedFileLoading(false);
			}
		},
		[authHeaders, currentThread, userId]
	);

	const openProjectCodeExplorer = useCallback(
		async (projectId: string) => {
			const activeThreadId = currentThread ?? latestThreadIdRef.current;
			if (!userId || !activeThreadId) {
				setError("User or thread missing; cannot load project files.");
				return;
			}
			setCodeExplorerOpen(true);
			setCodeExplorerProjectId(projectId);
			setCodeTree(null);
			setSelectedFilePath(null);
			setSelectedFileContent("");
			setSelectedFileLoading(false);
			setCodeTreeLoading(true);
			setCodeTreeError(null);
			try {
				const response = await fetch(
					`${API_BASE_URL}/projects/${encodeURIComponent(
						projectId
					)}/file-tree?user_id=${encodeURIComponent(userId)}&thread_id=${encodeURIComponent(
						activeThreadId
					)}`,
					{
						headers: {
							...authHeaders,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`Status ${response.status}`);
				}
				const data: ProjectFileTreeResponse = await response.json();
				const files = data.files || [];
				setCodeTree(files);
				const firstFilePath = findFirstFilePath(files);
				if (firstFilePath) {
					fetchFileContent(projectId, firstFilePath);
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Unable to load project file tree.";
				setCodeTreeError(`Unable to load project file tree (${message})`);
			} finally {
				setCodeTreeLoading(false);
			}
		},
		[authHeaders, currentThread, fetchFileContent, findFirstFilePath, userId]
	);

	const closeCodeExplorer = useCallback(() => {
		setCodeExplorerOpen(false);
		setCodeExplorerProjectId(null);
		setCodeTree(null);
		setCodeTreeError(null);
		setSelectedFilePath(null);
		setSelectedFileContent("");
		setSelectedFileLoading(false);
	}, []);
	const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmed = input.trim();
		if (!trimmed) {
			return;
		}
		if (!userId) {
			setError("You must be logged in to chat.");
			return;
		}
		// 🔹 1. Handle local "show project <id> code" command BEFORE talking to LLM
		const showProjectMatch = trimmed.match(/show\s+project\s+(\S+)\s+code/i);
		if (showProjectMatch) {
			const projectId = showProjectMatch[1];

			// Optional: keep the user's command visible in the chat history
			const createdAt = Date.now();
			const userMessage: ChatMessage = {
				id: `user-${createdAt}`,
				role: "user",
				content: trimmed,
			};
			setMessages((prev) => [...prev, userMessage]);

			// Clear input
			setInput("");

			// Open the code explorer (no LLM involved)
			openProjectCodeExplorer(projectId);

			// ❗ IMPORTANT: do NOT call the LLM, just return
			return;
		}
		setError(null);
		setInput("");
		setSending(true);

		let threadId: string;
		try {
			threadId = await ensureThread();
		} catch {
			setSending(false);
			return;
		}
		
		const createdAt = Date.now();

		const userMessage: ChatMessage = {
			id: `user-${createdAt}`,
			role: "user",
			content: trimmed,
		};

		const assistantPlaceholder: ChatMessage = {
			id: `assistant-pending-${createdAt}`,
			role: "assistant",
			content: "",
			pending: true,
		};

		pendingAssistantId.current = assistantPlaceholder.id;

		// Add user message + empty assistant bubble
		setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

		try {
			const response = await fetch(`${API_BASE_URL}/chat/stream`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...authHeaders,
				},
				body: JSON.stringify({
					message: trimmed,
					thread_id: threadId,
					user_id: userId,
				}),
			});
			if (!response.ok) {
				const friendly = `Sorry, I hit a server error (${response.status}). Please try again or adjust your request.`;
				appendAssistantMessage(friendly);
				setError(friendly);

				// stop listening to stream & clear pending bubble
				pendingAssistantId.current = null;
				setSending(false);
				return; // IMPORTANT: don't continue to read the stream
			}
			if (!response.body) {
				throw new Error("Streaming not supported by this browser/response.");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				// NDJSON: split by newline
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (!line.trim()) continue;

					let evt: any;
					try {
						evt = JSON.parse(line);
					} catch {
						console.warn("Failed to parse stream line:", line);
						continue;
					}

					if (evt.event === "token") {
						const chunkText: string = evt.content || "";

						// Append chunk to the pending assistant bubble
						setMessages((prev) =>
							prev.map((msg) =>
								msg.id === pendingAssistantId.current
									? { ...msg, content: (msg.content || "") + chunkText }
									: msg
							)
						);
					} else if (evt.event === "end") {
						const {
							thread_id,
							messages: apiMessages,
							title,
							reply,
						} = evt as {
							thread_id: string;
							messages: ApiMessage[];
							title: string;
							reply: string;
						};

						// Replace local messages with the authoritative history from backend
						const chatMessages: ChatMessage[] = apiMessages.map(
							(msg, index) => ({
								...msg,
								id: `${msg.role}-${index}-${thread_id}`,
							})
						);

						setMessages(chatMessages);
						setCurrentThread(thread_id);

						// Move this thread to top of list
						setThreads((prev) => {
							const filtered = prev.filter((id) => id !== thread_id);
							return [thread_id, ...filtered];
						});
					} else if (evt.event === "error") {
						const friendly =
							evt.message ||
							"Oops, I hit a server error while processing this. Please try again or adjust your request.";
						setError(friendly);
						appendAssistantMessage(friendly);
					}

				}
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Unexpected error during chat";
			setError(message);

			// Remove the pending assistant bubble if something exploded
			appendAssistantMessage(
				"Oops, something went wrong while processing your request. Please try again."
			);
		} finally {
			pendingAssistantId.current = null;
			setSending(false);
		}
	};
	const renderFileNode = (
		node: ProjectFileNode,
		projectId: string,
		depth = 0
	): React.ReactNode => {
		const isFile = node.type === "file";
		const isActive = selectedFilePath === node.path;
		const paddingLeft = 8 + depth * 12;
		return (
			<div key={node.path || `${node.name}-${depth}`}>
				<button
					type="button"
					onClick={() => (isFile ? fetchFileContent(projectId, node.path) : undefined)}
					style={{ paddingLeft }}
					className={`flex w-full items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-sm transition-colors ${
						isFile
							? isActive
								? "border-cyan-500/60 bg-cyan-500/10 text-white"
								: "border-transparent text-slate-200 hover:border-slate-600/40 hover:bg-slate-900/50"
							: "border-transparent font-semibold text-slate-100 hover:border-slate-600/40 hover:bg-slate-900/40"
					}`}
				>
					<span className="text-xs text-cyan-300">{isFile ? "•" : "▾"}</span>
					<span className="truncate">{node.name}</span>
				</button>
				{node.children?.length ? (
					<div className="space-y-1">{node.children.map((child) => renderFileNode(child, projectId, depth + 1))}</div>
				) : null}
			</div>
		);
	};

	const activeThreadDisplay = useMemo(() => {
		if (!currentThread) return "No thread";
		return `#${currentThread.slice(0, 8)}`;
	}, [currentThread]);
	const truncatedProjectId = useMemo(() => {
		if (!codeExplorerProjectId) return "";
		const prefix = codeExplorerProjectId.slice(0, 12);
		return codeExplorerProjectId.length > 12 ? `${prefix}…` : prefix;
	}, [codeExplorerProjectId]);
	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center text-slate-300">
				Loading your workspace...
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const pricingLabel =
		pricing?.monthly_price_label ?? "Premium pricing";
	const pricingDescription =
		pricing?.description ??
			"Premium unlocks GitHub automation, AWS deployments, and priority execution.";

	return (
		<div className="relative flex h-dvh flex-col overflow-hidden bg-gradient-to-br from-[#040714] via-[#091125] to-[#1d1a4d] text-slate-100">
			<AuroraGradient className="-z-40 opacity-55 mix-blend-screen" />
			<GlowOrbs className="-z-30 opacity-45 mix-blend-screen" />
			<FuturisticBackground className="-z-20 opacity-[0.4]" />
			<FloatingSparkles count={22} className="-z-10 opacity-70 mix-blend-screen" />
			<div className="absolute top-4 right-4 z-50 flex flex-col items-end space-y-3">
				<button
					type="button"
					ref={accountButtonRef}
					onClick={() => setShowAccountPanel((prev) => !prev)}
					className="rounded-full border border-slate-700/60 bg-slate-900/70 p-2 text-slate-200 shadow-lg shadow-slate-900/40 transition hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
					aria-label="Toggle account panel"
				>
					<MoreHorizontal className="h-5 w-5" />
				</button>
				<AnimatePresence>
					{showAccountPanel && (
						<motion.div
							ref={accountPanelRef}
							initial={{ opacity: 0, y: -8, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="w-[320px] rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 shadow-xl shadow-slate-900/50 backdrop-blur-xl"
						>
							<div className="space-y-4">
								<div className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4">
									<div className="flex items-center gap-4">
										{avatarUrl ? (
											<img
												src={avatarUrl}
												alt={userDisplayName}
												className="h-12 w-12 rounded-full border border-slate-700/60 object-cover"
											/>
										) : (
											<div className="h-12 w-12 rounded-full border border-slate-700/60 bg-slate-800/70 text-lg font-semibold text-white flex items-center justify-center">
												{userInitials}
											</div>
										)}
										<div>
											<p className="text-xs uppercase tracking-wide text-slate-400">
												Logged in as
											</p>
											<p className="text-base font-semibold text-white">{userDisplayName}</p>
											<p className="text-sm text-slate-400">{userEmail}</p>
										</div>
									</div>
									<Button
										variant="ghost"
										className="rounded-xl border border-slate-700/50 bg-slate-900/70 text-sm font-semibold"
										onClick={async () => {
											await signOut();
											navigate("/");
										}}
									>
										Logout
									</Button>
								</div>
								<div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4">
									<p className="text-xs uppercase tracking-wide text-slate-400">
										Your connected GitHub account
									</p>
									<p className="mt-1 text-base font-semibold text-white">{githubAccountLabel}</p>
									<p className="mt-2 text-sm text-slate-400">{githubStatusText}</p>
									{githubTokenMissing && (
										<Button
											variant="outline"
											className="mt-3 rounded-xl border border-cyan-500/60 text-sm text-cyan-100 hover:text-white"
											onClick={handleReconnectGithub}
											disabled={reconnectingGithub}
										>
											{reconnectingGithub ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Reconnecting...
												</>
											) : (
												"Reconnect GitHub"
											)}
										</Button>
									)}
								</div>
								<div className="space-y-3 border-t border-slate-800/60 pt-4">
									{userPlan === "free" ? (
										<Button
											onClick={handleUpgradeClick}
											className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/50 bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-violet-500"
										>
											<Sparkles className="icon text-white" />
											Upgrade
										</Button>
									) : (
										<div className="flex items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
											<Sparkles className="icon text-emerald-300" />
											Premium Active
										</div>
									)}
									{user?.role === "admin" && (
										<Button
											onClick={() => navigate("/admin")}
											variant="ghost"
											className="w-full rounded-xl border border-slate-700/50 bg-slate-900/70 text-xs font-semibold"
										>
											Admin
										</Button>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden gap-6 px-4 py-6 lg:flex-row lg:items-stretch lg:overflow-visible box-border">
				<motion.aside
					className={`flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-3xl ${glassPanel} p-5 lg:h-full lg:w-80 lg:flex-none`}
					initial={{ opacity: 0, x: -24 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Logo size="md" />
							<div className="flex flex-col leading-tight">
								<span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
									Genie
								</span>
								<span className="text-sm font-semibold text-white">
									Conversation Threads
								</span>
							</div>
						</div>
					</div>
					<Button
						className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-violet-500"
						onClick={handleNewChat}
					>
						<Plus className="icon mr-2" />
						New Chat
					</Button>
					<div className="mt-6 flex-1 overflow-hidden min-h-0">
						<ScrollArea
							heightClass="h-full"
							viewportClassName="flex flex-col space-y-3 pr-1"
						>
							{threads.length === 0 && !loadingThreads ? (
								<div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 px-4 py-6 text-center text-sm text-slate-400">
									No conversations yet. Start a new chat to begin.
								</div>
							) : loadingThreads && threads.length === 0 ? (
								<div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700/40 bg-slate-900/60 px-4 py-6 text-sm text-slate-300">
									<Loader2 className="icon animate-spin text-cyan-300" />
									Loading threads
								</div>
							) : (
								threads.map((threadId) => {
									const isActive = threadId === currentThread;
									return (
										<motion.button
											key={threadId}
											onClick={() => handleSelectThread(threadId)}
											className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
												isActive
													? "border-cyan-500/70 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/25"
													: "border-slate-700/40 bg-slate-900/40 text-slate-300 hover:border-slate-600/60 hover:bg-slate-900/70"
											}`}
											whileHover={{ scale: 1.01 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-900/70">
												<MessageSquare className="icon text-cyan-300" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-semibold">
													{threadId.slice(0, 8)}
												</span>
												<span className="text-xs text-slate-400">
													{threadId.slice(9, 21) || "Active conversation"}
												</span>
											</div>
										</motion.button>
									);
								})
							)}
						</ScrollArea>
					</div>
				</motion.aside>
				<motion.section
					className={`flex flex-1 min-h-0 flex-col overflow-hidden rounded-3xl ${glassPanel} p-6`}
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<header className="rounded-2xl border border-slate-700/40 bg-slate-900/60 px-5 py-4">
						<p className="text-xs uppercase tracking-wide text-slate-400">
							Active Thread
						</p>
						<p className="mt-1 text-lg font-semibold text-white">{activeThreadDisplay}</p>
					</header>
					<div className="relative mt-5 flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-b from-slate-950/55 via-[#0b1023]/60 to-indigo-950/55 overscroll-contain">
						<div className="relative flex-1 min-h-0 overflow-hidden">
							<ScrollArea
								heightClass="h-full"
								viewportRef={viewportRef}
								className="h-full"
								viewportClassName="flex min-h-full flex-col gap-4 px-6 pt-6 pb-32"
							>
								{loadingMessages && messages.length === 0 ? (
									<div className="flex flex-1 items-center justify-center text-slate-400">
										<Loader2 className="mr-3 h-5 w-5 animate-spin text-cyan-300" />
										Loading conversation...
									</div>
								) : messages.length === 0 ? (
									<div className="flex flex-1 flex-col items-center justify-center text-center text-slate-400">
										<MessageSquare className="mb-3 h-10 w-10 text-cyan-300" />
										<p className="text-sm">
											Ask the assistant anything about your repositories or tools.
										</p>
									</div>
								) : (
									<AnimatePresence initial={false}>
										{messages.map((message) => {
											const isUser = message.role === "user";
											return (
												<motion.div
													key={message.id}
													className={`flex w-full ${
														isUser ? "justify-end" : "justify-start"
													}`}
													initial={{ opacity: 0, y: 20, scale: 0.97 }}
													animate={{ opacity: 1, y: 0, scale: 1 }}
													exit={{ opacity: 0, y: 20, scale: 0.95 }}
													transition={{ duration: 0.2 }}
												>
													<div
														className={`max-w-xl rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-lg ${
															isUser
																? "border-cyan-500/40 bg-cyan-500/20 text-cyan-50"
																: "border-slate-700/50 bg-slate-900/70 text-slate-100"
														}`}
													>
														{message.pending ? (
															<div className="flex items-start gap-2 text-xs sm:text-sm text-white">
																<Loader2 className="icon mt-0.5 animate-spin text-cyan-300" />
																<div className="whitespace-pre-wrap">
																{message.content || "Thinking..."}
																</div>
															</div>
															) : (
															<div className="whitespace-pre-wrap">
																<ReactMarkdown>{message.content}</ReactMarkdown>
															</div>
															)}
													</div>
												</motion.div>
											);
										})}
									</AnimatePresence>
								)}
							</ScrollArea>
							{!atBottom && messages.length > 0 && (
								<button
									type="button"
									onClick={scrollToBottom}
									className="pointer-events-auto absolute right-5 bottom-1 z-30 rounded-full border border-cyan-500/40 bg-slate-900/80 px-3 py-2 text-xs font-medium text-cyan-100 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-slate-900/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
									aria-label="Scroll to bottom"
								>
									{"\u2193 New messages"}
								</button>
							)}
						</div>
						{error && (
							<div className="mx-4 mb-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
								{error}
							</div>
						)}
						{generatingDocs && (
							<div className="mx-4 mb-2 flex items-center gap-2 text-sm text-cyan-200">
								<Loader2 className="icon animate-spin text-cyan-300" />
								Generating documentation summary
							</div>
						)}
						{docPreview && (
							<motion.div
								className="mx-4 mb-4 rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-5 shadow-lg shadow-cyan-500/15"
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
						>
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<h3 className="text-lg font-semibold text-white">Documentation Preview</h3>
									<p className="text-sm text-slate-400">
										Archive <span className="text-slate-200">{docPreview.fileName}</span> - ID <span className="text-slate-200">{docPreview.uploadId}</span>
									</p>
									<p className="mt-1 break-all text-xs text-slate-500">
										Path: <span className="text-slate-300">{docPreview.folderPath}</span>
									</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-9 w-9 rounded-full border border-slate-700/60 bg-slate-900/60 text-cyan-300 hover:bg-slate-800/70"
									onClick={() => setDocPreview(null)}
								>
									<X className="icon text-cyan-300 group-disabled:opacity-100" />
								</Button>
							</div>
							<div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
								<div className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4 text-sm text-slate-300">
									<p>
										Files analysed: <span className="text-slate-100">{docPreview.filesAnalyzed}</span>
									</p>
									{docPreview.fallbackUsed && (
										<div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
											Fallback documentation was used because the LLM summarizer was unavailable. Consider updating the generated docs manually.
										</div>
									)}
									<div>
										<p className="font-medium text-slate-200">Top level entries</p>
										{docPreview.topLevel.length ? (
											<ul className="mt-2 space-y-1 text-xs text-slate-400">
												{docPreview.topLevel.slice(0, 6).map((entry) => (
													<li key={entry}>{entry}</li>
												))}
												{docPreview.topLevel.length > 6 && (
													<li className="text-slate-500">+{docPreview.topLevel.length - 6} more</li>
												)}
											</ul>
										) : (
											<p className="mt-1 text-xs text-slate-500">No folders detected</p>
										)}
									</div>
									<div>
										<p className="font-medium text-slate-200">Preview files</p>
										{docPreview.previewFiles.length ? (
											<ScrollArea
												heightClass="max-h-48"
												className="mt-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-xs text-slate-400"
											>
												<ul className="space-y-1">
													{docPreview.previewFiles.map((file) => (
														<li key={file}>{file}</li>
													))}
												</ul>
											</ScrollArea>
										) : (
											<p className="mt-1 text-xs text-slate-500">Preview not available.</p>
										)}
									</div>
									<div>
										<p className="font-medium text-slate-200">Generated docs</p>
										<ul className="mt-2 space-y-1 break-all text-xs text-slate-400">
											<li>
												README:{" "}
												{docPreview.readmePath ? (
													<span>{docPreview.readmePath}</span>
												) : (
													<span className="text-slate-500">not saved</span>
												)}
											</li>
											<li>
												User Manual:{" "}
												{docPreview.userManualPath ? (
													<span>{docPreview.userManualPath}</span>
												) : (
													<span className="text-slate-500">not saved</span>
												)}
											</li>
										</ul>
									</div>
								</div>
								<div className="rounded-2xl border border-slate-700/50 bg-slate-950/40 p-4">
									<div className="flex flex-wrap items-center gap-2">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setActiveDocTab("readme")}
											className={`rounded-2xl px-4 ${activeDocTab === "readme" ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-cyan-500/30" : "border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:bg-slate-800/70"}`}>
												<FileText className="icon mr-2 text-cyan-300 group-disabled:opacity-100" />
												README
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setActiveDocTab("user_manual")}
											className={`rounded-2xl px-4 ${activeDocTab === "user_manual" ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-cyan-500/30" : "border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:bg-slate-800/70"}`}>
												<BookOpen className="icon mr-2 text-cyan-300 group-disabled:opacity-100" />
												User Manual
										</Button>
									</div>
									<ScrollArea
										heightClass="max-h-72"
										className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200"
									>
										{activeDocTab === "readme" ? (
											docPreview.readme ? (
												<pre className="whitespace-pre-wrap">{docPreview.readme}</pre>
											) : (
												<p className="text-slate-400">README content unavailable.</p>
											)
										) : docPreview.userManual ? (
											<pre className="whitespace-pre-wrap">{docPreview.userManual}</pre>
										) : (
											<p className="text-slate-400">User manual content unavailable.</p>
										)}
									</ScrollArea>
								</div>
							</div>
							</motion.div>
						)}
						<form
							ref={composerFormRef}
							onSubmit={handleSend}
							className="sticky bottom-0 z-10 border-t border-slate-700/40 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60"
						>
							<div className="flex items-end gap-3 px-4 py-3">
								<input
									ref={fileInputRef}
									type="file"
									accept=".zip"
									className="hidden"
									onChange={handleFileUpload}
								/>
								<div className="flex-1 rounded-2xl border border-slate-700/40 bg-slate-900/60 px-4 py-2 focus-within:border-cyan-400/60 focus-within:bg-slate-900/80">
									<label htmlFor="chat-input" className="sr-only">
										Ask the assistant
									</label>
									<textarea
										ref={textAreaRef}
										id="chat-input"
										value={input}
										onChange={handleComposerChange}
										onKeyDown={handleComposerKeyDown}
										placeholder="Ask me to scaffold a repo, inspect files, or manage GitHub..."
										className="min-h-[3rem] max-h-36 w-full resize-none overflow-hidden border-none bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none leading-6 disabled:cursor-not-allowed disabled:opacity-60"
										rows={1}
										autoComplete="off"
										disabled={sending}
									/>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-12 w-12 rounded-2xl border border-slate-700/60 bg-slate-900/60 text-slate-200 hover:bg-slate-800/70 disabled:cursor-not-allowed disabled:opacity-60"
									onClick={handleOpenFilePicker}
									disabled={uploading}
								>
									{uploading ? (
										<Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
									) : (
										<>
											<p>+</p>
											<span className="sr-only">Upload project archive</span>
										</>
									)}
								</Button>
								<Button
									type="submit"
									className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
									disabled={sending || uploading}
								>
									{sending ? (
										<>
											<Loader2 className="icon mr-2 animate-spin text-white group-disabled:opacity-100" />
											Sending
										</>
									) : (
										<>
											Send
										</>
									)}
								</Button>
							</div>
							{uploading && (
								<div className="flex items-center gap-2 px-4 pb-3 text-xs text-slate-400">
									<Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
									Uploading archive...
								</div>
							)}
						</form>
					</div>
				</motion.section>
			</div>
			{codeExplorerOpen && codeExplorerProjectId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
					<div className="w-full max-w-5xl h-[80vh] rounded-3xl border border-slate-700/70 bg-slate-900/95 shadow-2xl flex flex-col overflow-hidden">
						<div className="flex items-start justify-between border-b border-slate-800/60 px-6 py-4">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Project Code</p>
								<p className="text-lg font-semibold text-white mt-1 break-all">
									{truncatedProjectId || codeExplorerProjectId.slice(0, 20)}
								</p>
							</div>
							<button
								type="button"
								onClick={closeCodeExplorer}
								className="rounded-full border border-slate-700/60 p-2 text-slate-400 hover:border-slate-500 hover:text-white"
								aria-label="Close code explorer"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="flex flex-1 min-h-0 divide-x divide-slate-800">
							<div className="w-64 bg-slate-950/60 flex flex-col">
								<div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-sm font-semibold text-slate-200">
									<span>Files</span>
									{codeTreeLoading && <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />}
								</div>
								<div className="flex-1 min-h-0">
									<ScrollArea heightClass="h-full" viewportClassName="pr-2 py-2 space-y-1">
										{codeTreeError ? (
											<div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
												{codeTreeError}
											</div>
										) : codeTreeLoading ? (
											<div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-2">
												<Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
												Loading file tree...
											</div>
										) : !codeTree || codeTree.length === 0 ? (
											<div className="text-xs text-slate-500 px-3 py-2">
												No files detected in this project.
											</div>
										) : (
											codeTree.map((node) => renderFileNode(node, codeExplorerProjectId))
										)}
									</ScrollArea>
								</div>
							</div>
							<div className="flex-1 bg-slate-950/40 flex flex-col">
								<div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 text-sm text-slate-300">
									<div className="flex flex-col">
										<span className="text-xs uppercase tracking-wide text-slate-500">Viewing file</span>
										<span className="text-sm text-slate-200 break-all">
											{selectedFilePath || "No file selected"}
										</span>
									</div>
									{selectedFileLoading && <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />}
								</div>
								<div className="flex-1 overflow-hidden p-4">
									{selectedFilePath ? (
										<ScrollArea heightClass="h-full" viewportClassName="h-full">
											<pre className="whitespace-pre text-xs leading-relaxed rounded-2xl bg-slate-950/80 border border-slate-800/70 p-4 text-slate-100 min-h-full">
												{selectedFileContent || (selectedFileLoading ? "// Loading..." : "// File is empty.")}
											</pre>
										</ScrollArea>
									) : (
										<div className="h-full flex items-center justify-center text-sm text-slate-400">
											Select a file from the left to view its content.
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{showUpgradeModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
					<div className="w-full max-w-lg rounded-3xl border border-slate-700/70 bg-slate-900/90 p-6 shadow-2xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upgrade</p>
								<h2 className="text-2xl font-semibold text-white">Unlock Premium Tools</h2>
								<p className="mt-2 text-sm text-slate-300">{pricingDescription}</p>
								<p className="mt-3 text-base font-semibold text-cyan-200">{pricingLabel}</p>
							</div>
							<button
								type="button"
								onClick={closeUpgradeModal}
								className="rounded-full border border-slate-700/60 p-2 text-slate-400 hover:border-slate-500 hover:text-white"
								aria-label="Close upgrade modal"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<ul className="mt-6 space-y-2 text-sm text-slate-200">
							<li className="flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-cyan-300" />
								Deploy to AWS from any project thread.
							</li>
							<li className="flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-violet-300" />
								Push generated code straight to GitHub.
							</li>
							<li className="flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-emerald-300" />
								Priority streaming + faster tool execution.
							</li>
						</ul>
						<p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
							Test mode · Stripe checkout
						</p>
						{upgradeError && (
							<div className="mt-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
								{upgradeError}
							</div>
						)}
						<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
							<Button
								onClick={startCheckout}
								disabled={upgradeLoading}
								className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-violet-500 disabled:opacity-60"
							>
								{upgradeLoading ? (
									<>
										<Loader2 className="icon mr-2 animate-spin" />
										Redirecting to Stripe...
									</>
								) : (
									<>
										<Sparkles className="icon mr-2" />
										Go to Stripe Checkout
									</>
								)}
							</Button>
							<button
								type="button"
								onClick={closeUpgradeModal}
								disabled={upgradeLoading}
								className="text-sm font-medium text-slate-400 hover:text-white disabled:cursor-not-allowed"
							>
								Maybe later
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default ChatDashboard;