import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import * as Babel from "@babel/standalone";

const CodeExecutor = () => {
  const [code, setCode] = useState(
    "// Write your JS code here\nconsole.log('Hello, world!');"
  );
  const [output, setOutput] = useState(""); // 실행 결과 저장
  const [error, setError] = useState(""); // 에러 메시지 저장

  const executeCode = (codeToRun) => {
    const capturedOutput = [];
    const originalLog = console.log; // 기존 console.log 백업

    // console.log 재정의
    console.log = (...args) => {
      capturedOutput.push(args.join(" "));
    };

    try {
      // Babel로 코드 변환
      const transformedCode = Babel.transform(codeToRun, {
        presets: ["env"],
      }).code;

      // 변환된 코드 실행
      new Function(transformedCode)();

      setOutput(capturedOutput.join("\n")); // 실행 결과를 화면에 표시
      setError(""); // 에러 초기화
    } catch (e) {
      setOutput(""); // 출력 초기화
      setError(e.message); // 에러 메시지 저장
    } finally {
      console.log = originalLog; // 원래 console.log 복구
    }
  };

  useEffect(() => {
    executeCode(code); // 초기 실행 및 코드 변경 시 실행
  }, [code]);

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "Arial",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>JavaScript Code Executor</h2>

      {/* 코드 입력 공간 */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#1e1e1e",
          overflow: "hidden",
          marginBottom: "1rem",
          textAlign: "left", // 좌측 정렬
        }}
      >
        <CodeMirror
          value={code}
          height="200px"
          extensions={[javascript()]}
          theme="dark"
          onChange={(value) => setCode(value)}
          style={{
            fontFamily: "monospace",
            fontSize: "16px",
            lineHeight: "1.5", // 줄 간격 조정
          }}
          options={{
            lineNumbers: true, // 줄 번호 유지
            indentWithTabs: false,
            tabSize: 2,
            smartIndent: true,
            padding: 0, // 패딩 제거
          }}
        />
      </div>

      {/* 실행 결과 출력 */}
      <div
        style={{
          marginTop: "1rem",
          backgroundColor: "#1e1e1e",
          padding: "1rem",
          borderRadius: "5px",
          height: "150px", // 고정 높이 설정
          overflowY: "auto", // 세로 스크롤 활성화
          overflowX: "hidden", // 가로 스크롤 비활성화
        }}
      >
        <h3 style={{ color: "#ffffff" }}>Output:</h3>
        {error ? (
          <pre
            style={{
              color: "#ff6347",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            Error: {error}
          </pre>
        ) : (
          <pre
            style={{
              color: "#00ff00",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
            }}
          >
            {output || "Output will appear here..."}
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodeExecutor;
