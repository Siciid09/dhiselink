"use client";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useState } from 'react';

interface RichTextEditorProps {
  name: string;
  required?: boolean;
}

// This component wraps the text editor and handles its state.
export default function RichTextEditor({ name, required }: RichTextEditorProps) {
  const [value, setValue] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div>
      {/* A hidden input to pass the HTML content to the Server Action */}
      <input type="hidden" name={name} value={value} required={required} />
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue}
        modules={modules}
        className="bg-white"
      />
    </div>
  );
}