import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
 
import { useEdgeStore } from "@/lib/edgestore";

import { useRef } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {

  const { edgestore } = useEdgeStore();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

 // @ts-ignore
  const editor = useCreateBlockNote({// @ts-ignore
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUpload
  });
  
  const handleEditorChange = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    }, 500); // Ajustez la durée du délai selon vos besoins
};
  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={handleEditorChange}

      />
    </div>
  )
}

export default Editor;
