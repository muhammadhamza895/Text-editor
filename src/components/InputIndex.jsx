import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { diffChars, diffWords } from "diff";

// Simple diff calculation (you can use a library like jsdiff for better results)

const data = `Lorem Ipsum`;

function InputIndex() {
  const [editorHtml, setEditorHtml] = useState("");
  const [initialText, setInitialText] = useState(data);
  const [quill, setQuill] = useState(null);
  const quillRef = useRef(null)

  const findInsertionIndex = (currentText, newText, currentIndex) => {
    const remainingText = currentText.slice(currentIndex);
    return remainingText.indexOf(newText) !== -1
      ? currentIndex + remainingText.indexOf(newText)
      : -1;
  };

  const handleTextChange = () => {
    const currentText = quillRef.current.root.innerHTML.replace(/<[^>]*>/g, "");
    highlightChanges(currentText);
  };


  const highlightChanges = (currentText) => {
    // const changes = getDiff();
    // console.log({changes})
    // if (!changes.length) return;

    // console.log({ initialText });
    // console.log({ editorHtml });
    // console.log({ changes });

    // let currentIndex = 0;
    // changes.forEach((change) => {
    //   if (change.added) {
    //     // console.log({changes})
    //     const newText = change.value.replace(/<[^>]*>/g, "");
    //     const currentTextPlain = editorHtml.replace(/<[^>]*>/g, "");
    //     const indexInCurrentText = findInsertionIndex(currentTextPlain, newText, currentIndex);

    //     if (indexInCurrentText !== -1) {
    //       const length = newText.length;
    //       quill.formatText(indexInCurrentText, length, {
    //         background: "yellow",
    //       });
    //       currentIndex = indexInCurrentText + length;
    //     }
    //   } else {
    //     currentIndex += change.value.length;
    //   }
    // });

     // Temporarily disable the 'text-change' event to prevent an infinite loop
     quillRef.current.off('text-change');
    const addedCharacters = getNewCharactersWithIndices(initialText,currentText)
    addedCharacters?.forEach(newChar=>{
      // quillRef.current.insertText(newChar?.index, newChar?.char, { background: 'green' });
      quillRef.current.formatText(newChar?.index, newChar?.char.length, { background: '#90EE90' });
    })

    // Re-enable the 'text-change' event after making changes programmatically
    quillRef.current.on('text-change', handleTextChange);

  };

  const getDiff = () => {
    const initialTextPlain = initialText;
    const currentTextPlain = editorHtml.replace(/<[^>]*>/g, "");
    
    const diffArray =  diffWords(initialTextPlain, currentTextPlain);

    const addedParts = diffArray
    .filter((change) => change.added)

    return addedParts
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
    quillRef.current = q;
    setQuill(q);

    q.setText(data);
    q.on("text-change", () => {
      const currentText = q.root.innerHTML;
      // setEditorHtml(currentText);
      highlightChanges(currentText?.replace(/<[^>]*>/g, ""))
    });
  }, []);

  // useEffect(() => {
  //   highlightChanges();
  // }, [editorHtml]);

  function getNewCharactersWithIndices  (initialText, currentText)  {
    const diffArray = diffChars(initialText, currentText);
  
    const addedPartsWithIndices = [];
    let currentIndex = 0;
  
    diffArray.forEach((change) => {
      if (!change.added && !change.removed) {
        // Move the current index forward by the length of unchanged text
        currentIndex += change.value.length;
      }
      if (change.added) {
        // For each added character or text, push the value and its index
        addedPartsWithIndices.push({
          char: change.value,       // Newly added character(s)
          index: currentIndex       // Index where the new text starts
        });
        currentIndex += change.value.length;  // Move index forward by the added text length
      }
    });
  
    return addedPartsWithIndices;
  };

  

  return (
    <>
      <h1>Type Here</h1>
      <div className="App">
        <div id="editor" style={{ height: "200px"}} />
      </div>
    </>
  );
}

export default InputIndex;
