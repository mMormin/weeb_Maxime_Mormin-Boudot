import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Undo2,
  Redo2,
  X,
  Check,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: boolean;
  ariaLabel: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  label,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active}
    className={`p-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? "bg-secondary/30 text-secondary"
        : "text-gray-300 hover:bg-white/10"
    }`}
  >
    {children}
  </button>
);

const Divider = () => (
  <span aria-hidden="true" className="w-px h-6 bg-white/10 mx-1" />
);

// Schémas autorisés dans le mark `link`. Defense-in-depth en complément de
// DOMPurify côté affichage : on bloque `javascript:`, `data:`, etc. dès
// l'insertion plutôt que de compter uniquement sur la sanitisation au rendu.
const SAFE_URL_PATTERN = /^(?:https?:\/\/|mailto:|\/|#)/i;

const isSafeUrl = (url: string): boolean => SAFE_URL_PATTERN.test(url.trim());

const RichTextEditor = ({
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  ariaLabel,
}: RichTextEditorProps) => {
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        // `validate` bloque les schémas dangereux générés par autolink
        // (collage d'URL) — la saisie manuelle passe déjà par `isSafeUrl`.
        validate: isSafeUrl,
        HTMLAttributes: {
          class: "text-secondary underline",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-secondary before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class:
          "min-h-48 px-4 py-3 outline-none text-left prose prose-invert prose-lg max-w-none focus:outline-none [&_p]:my-3 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:my-3 [&_ol]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:pl-4 [&_blockquote]:italic",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
    onBlur: () => onBlur?.(),
  });

  if (!editor) return null;

  const openLinkPopover = (ed: Editor) => {
    const previousUrl = (ed.getAttributes("link").href as string | undefined) ?? "";
    setLinkUrl(previousUrl);
    setLinkError("");
    setLinkPopoverOpen(true);
  };

  const closeLinkPopover = () => {
    setLinkPopoverOpen(false);
    setLinkUrl("");
    setLinkError("");
  };

  const applyLink = () => {
    const trimmed = linkUrl.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      closeLinkPopover();
      return;
    }
    if (!isSafeUrl(trimmed)) {
      setLinkError(
        "URL non valide. Utilisez http(s)://, mailto: ou un chemin relatif.",
      );
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: trimmed })
      .run();
    closeLinkPopover();
  };

  // Aligne l'apparence sur `getInputClass` : fond transparent, soulignement
  // `secondary` par défaut, bordure complète au focus, rouge en erreur.
  const borderClass = error
    ? "border-b-red-400"
    : "border-b-secondary focus-within:border-secondary";

  return (
    <div
      className={`border-2 border-transparent ${borderClass} bg-transparent transition-colors`}
    >
      <div
        role="toolbar"
        aria-label="Mise en forme"
        className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-secondary/30"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="Gras"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="Italique"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label="Barré"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          label="Code en ligne"
        >
          <Code size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          label="Titre niveau 2"
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          label="Titre niveau 3"
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Liste à puces"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Liste ordonnée"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Citation"
        >
          <Quote size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => openLinkPopover(editor)}
          active={editor.isActive("link")}
          label="Lien"
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          label="Annuler"
        >
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          label="Rétablir"
        >
          <Redo2 size={16} />
        </ToolbarButton>
      </div>

      {/* Popover inline pour saisir l'URL d'un lien — remplace window.prompt
          pour rester en accord avec la règle "feedback inline" du projet. */}
      {linkPopoverOpen && (
        <div className="flex flex-wrap items-center gap-2 px-2 py-2 border-b border-secondary/30 bg-white/5">
          <label className="sr-only" htmlFor="rte-link-url">
            URL du lien
          </label>
          <input
            id="rte-link-url"
            type="url"
            autoFocus
            value={linkUrl}
            onChange={(e) => {
              setLinkUrl(e.target.value);
              if (linkError) setLinkError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                e.preventDefault();
                closeLinkPopover();
              }
            }}
            placeholder="https://exemple.fr"
            className="flex-1 min-w-0 bg-transparent border border-secondary/50 rounded px-2 py-1 text-sm text-white outline-none focus:border-secondary"
          />
          <button
            type="button"
            onClick={applyLink}
            aria-label="Valider le lien"
            className="p-1.5 rounded text-secondary hover:bg-white/10"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            onClick={closeLinkPopover}
            aria-label="Annuler"
            className="p-1.5 rounded text-gray-300 hover:bg-white/10"
          >
            <X size={16} />
          </button>
          {linkError && (
            <p
              role="alert"
              className="basis-full text-xs text-red-400 px-1"
            >
              {linkError}
            </p>
          )}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
