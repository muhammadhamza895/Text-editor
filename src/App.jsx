import React, { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { diffWords } from "diff";

import "./App.css";

// Simple diff calculation (you can use a library like jsdiff for better results)

const data = `Lorem Ipsum`;

function App() {
  const [editorHtml, setEditorHtml] = useState("");
  const [initialText, setInitialText] = useState("");
  const [quill, setQuill] = useState(null);

  const highlightChanges = () => {
    const changes = getDiff();
    console.log({changes})
    if (!changes.length) return;

    // console.log({ initialText });
    // console.log({ editorHtml });
    // console.log({ changes });

    let currentIndex = 0;
    changes.forEach((change) => {
      if (change.added) {
        const newText = change.value.replace(/<[^>]*>/g, "");
        const currentTextPlain = editorHtml.replace(/<[^>]*>/g, "");
        const indexInCurrentText = currentTextPlain.indexOf(newText);

        if (indexInCurrentText !== -1) {
          const length = newText.length;
          quill.formatText(indexInCurrentText, length, {
            background: "yellow",
          });
          currentIndex = indexInCurrentText + length;
        }
      } else {
        currentIndex += change.value.length;
      }
    });
  };

  const getDiff = () => {
    const initialTextPlain = initialText;
    const currentTextPlain = editorHtml.replace(/<[^>]*>/g, "");
    return diffWords(initialTextPlain, currentTextPlain);
  };

  useEffect(() => {
    const q = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: false,
      },
      placeholder: "Type here...",
    });

    setInitialText(data);
    setQuill(q);

    q.setText(data);
    q.on("text-change", () => {
      const currentText = q.root.innerHTML;
      setEditorHtml(currentText);
    });
  }, []);

  useEffect(() => {
    highlightChanges();
  }, [editorHtml]);

  

  return (
    <>
      <h1>Type Here</h1>
      <div className="App">
        <div id="editor" style={{ height: "200px"}} />
      </div>
    </>
  );
}

export default App;
