import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
 
import { useEdgeStore } from "@/lib/edgestore";


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
  

  return (
    <div>
      <BlockNoteView
        editor={editor}
        onChange={() => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
          }}

      />
    </div>
  )
}

export default Editor;
