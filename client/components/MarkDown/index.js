import React from "react";
import { marked } from "marked"; 
import DOMPurify from "dompurify";

const MarkdownRenderer = ({ markdown }) => {
 
  if(
    typeof markdown === "undefined" ||
    markdown === null ||
    markdown === "" || 
    typeof markdown!== "string"
  ){
    return null;
  }
  const rawHtml = marked(markdown);

  const sanitizedHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div
    style={{overflow:"hidden"}}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default MarkdownRenderer;
