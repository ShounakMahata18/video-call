import { useState } from "react";

export default function CopyUrlButton({ url }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // reset after 2s
        } catch (err) {
            console.error("Failed to copy URL:", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
            {copied ? "Copied!" : "Copy URL"}
        </button>
    );
}
