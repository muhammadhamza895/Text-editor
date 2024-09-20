import React, { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { diffChars, diffWords } from "diff";

// Simple diff calculation (you can use a library like jsdiff for better results)

const data = `Lorem Ipsum`;

function InputIndex() {
  const [initialText, setInitialText] = useState(data);
  const quillRef = useRef(null)

  const highlightChanges = () => {
    const plainInitialText = initialText;
    let plainCurrentText = quillRef.current.getText();
    const textLength = quillRef.current.getLength();


    if (plainCurrentText.endsWith('\n')) {
      plainCurrentText = plainCurrentText.slice(0, -1);
    }

    console.log({plainCurrentText})

    const {addedParts, removedParts} = getNewCharactersWithIndices(plainInitialText,plainCurrentText)
    console.log({addedParts})
    addedParts?.forEach(newChar=>{
      quillRef.current.formatText(newChar?.index, newChar?.char.length, { background: '#90EE90' });
    })
    setInitialText(plainCurrentText)
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

    q.setText(data);
    q.on("text-change", () => {
      highlightChanges()
    });
  }, []);


  function getNewCharactersWithIndices  (initialText, currentText)  {
    const diffArray = diffChars(initialText, currentText);

    const addedPartsWithIndices = [];
    const removedPartsWithIndices = []
    let currentIndex = 0;
  
    diffArray.forEach((change) => {
      if (!change.added && !change.removed) {
        currentIndex += change.value.length;
      }
      else if (change.added) {
        addedPartsWithIndices.push({
          added : change?.added,
          removed : change?.removed,
          char: change.value,      
          index: currentIndex      
        });
        currentIndex += change.value.length;  
      }
      else if ( change?.removed) {
        removedPartsWithIndices.push({
          added : change?.added,
          removed : change?.removed,
          char: change.value,      
          index: currentIndex      
        });
        currentIndex += change.value.length;
      }
    });

    return {addedParts : addedPartsWithIndices, removedParts : removedPartsWithIndices};
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
