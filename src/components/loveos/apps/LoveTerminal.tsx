import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface CommandResponse {
  [key: string]: string | string[];
}

interface LoveTerminalProps {
  customData?: { project: any; analytics: any[]; quiz: any[]; terminal: any[] };
}

const LoveTerminal = ({ customData }: LoveTerminalProps) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
  const [commands, setCommands] = useState<CommandResponse>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customData?.terminal?.length) {
      const cmds: CommandResponse = {
        help: "Available commands: help, " + customData.terminal.map((t: any) => t.command).join(", ") + ", clear",
      };
      customData.terminal.forEach((t: any) => { cmds[t.command] = t.output; });
      setCommands(cmds);
    } else {
      fetch("/data/commands.json")
        .then((res) => res.json())
        .then((data) => setCommands(data.commands))
        .catch(() => setCommands({
          help: "Available commands: help, pickup, kiss, hug, compliment, poem, quote, song, fortune, stats, mood, weather, heart, clear",
          pickup: ["Are you a magician? Because whenever I look at you, everyone else disappears. ✨"],
          kiss: "💋 *sending virtual kisses* 💋\nMwah! Mwah! Mwah!",
          hug: "🤗 *wrapping you in the warmest virtual hug*",
          heart: "    💕💕💕   💕💕💕\n  💕     💕💕     💕\n 💕                 💕\n  💕   I LOVE YOU  💕\n   💕             💕\n     💕         💕\n       💕     💕\n         💕 💕\n           💕",
        }));
    }

    setHistory([{ command: "", output: `💕 Welcome to the Terminal of Love 💕\nType 'help' to see available commands.\n\nReady to spread some love? Type a command below...` }]);
    inputRef.current?.focus();
  }, [customData]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [history]);

  const getResponse = (cmd: string): string => {
    const response = commands[cmd];
    if (!response) return `Command not found: ${cmd}\nType 'help' to see available commands.`;
    if (Array.isArray(response)) return response[Math.floor(Math.random() * response.length)];
    return response;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.toLowerCase().trim();
    if (cmd === "clear") { setHistory([]); setInput(""); return; }
    setHistory([...history, { command: input, output: getResponse(cmd) }]);
    setInput("");
  };

  return (
    <div className="h-full bg-background/80 backdrop-blur-sm font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div ref={terminalRef} className="h-full overflow-auto p-4 md:p-6 scrollbar-hide">
        {history.map((entry, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            {entry.command && (
              <div className="flex items-center gap-2 text-primary">
                <span className="text-love-coral">❤️</span>
                <span className="text-muted-foreground">love@os:~$</span>
                <span>{entry.command}</span>
              </div>
            )}
            <pre className="whitespace-pre-wrap text-foreground mt-1 ml-6">{entry.output}</pre>
          </motion.div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-love-coral">❤️</span>
          <span className="text-muted-foreground">love@os:~$</span>
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent outline-none text-foreground caret-primary" autoFocus autoComplete="off" spellCheck={false} />
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-5 bg-primary" />
        </form>
      </div>
    </div>
  );
};

export default LoveTerminal;
