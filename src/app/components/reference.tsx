// import React, { useState, useRef, useEffect } from 'react';
// import '../Reverse.css';
// import Navbar from '../Navbar';
// import axios from 'axios';
// import AceEditor from 'react-ace';
// import 'ace-builds';
// import 'ace-builds/webpack-resolver';
// import 'ace-builds/src-noconflict/mode-javascript'; // Import desired language modes
// import 'ace-builds/src-noconflict/mode-python';
// import 'ace-builds/src-noconflict/mode-java';
// import 'ace-builds/src-noconflict/mode-c_cpp';
// import 'ace-builds/src-noconflict/theme-monokai'; // Import desired theme
// import '../CodeEditor.css';
// import { auth, database } from '../firebase';
// import binary from '../images/binary.png';

// const javaBoilerplateCode = `public class Progman {
//   public static void main(String[] args) {
//     // Your code here
//   }
// }`;

// const javascriptBoilerplateCode = `function reverseString(str) {
//   // Your code here
// }

// const input = "hello";
// const output = reverseString(input);
// console.log(output);
// `;

// const pythonBoilerplateCode = `def reverse_string(string):
//   # Your code here
//   pass

// input = "hello"
// output = reverse_string(input)
// print(output)
// `;

// const cppBoilerplateCode = `#include <iostream>
// #include <string>

// std::string reverseString(std::string str) {
//   // Your code here
// }

// int main() {
//   std::string input = "hello";
//   std::string output = reverseString(input);
//   std::cout << output << std::endl;
//   return 0;
// }
// `;

// function BinaryTreeMax() {
//   const [terminalOpen, setTerminalOpen] = useState(false);
//   const [editorWidth, setEditorWidth] = useState('70vw');
//   const [isMatched, setIsMatched] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(localStorage.getItem('isSubmitted') === 'true' || false);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [apiKeyIndex, setApiKeyIndex] = useState(0);
//   const [isApiKeySwitched, setIsApiKeySwitched] = useState(false);

//   const apiKeys = [
//     'd68444bd69mshf49c989cdc81f1ep160149jsna5825b9f2fac',
//     '76e099974bmsh8974696818dba1ap1b8bb1jsnc17c27f0f4f5',
//     'dfaea4b969msh5d5107872611935p1dbe38jsn4619a79ae6a1',
//     'a254a1b6b8msha27d6d63cef01b4p1a4786jsn7fcaf27c3ffe',
//   ];

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setLoggedIn(true);
//       } else {
//         setLoggedIn(false);
//       }
//     });

//     return unsubscribe()
//   }, [auth]);

//   const getDefaultBoilerplateCode = (language) => {
//     if (language === 'java') {
//       return javaBoilerplateCode;
//     } else if (language === 'python') {
//       return pythonBoilerplateCode;
//     } else if (language === 'c_cpp') {
//       return cppBoilerplateCode;
//     } else {
//       return javascriptBoilerplateCode;
//     }
//   };

//   const handleTerminalClick = () => {
//     setTerminalOpen(!terminalOpen);
//   };

//   const handleResize = (event, { size }) => {
//     setEditorWidth(size.width + 'px');
//   };

//   const [selectedLanguage, setSelectedLanguage] = useState(() => {
//     const storedLanguage = localStorage.getItem('selectedLanguage');
//     return storedLanguage || 'javascript';
//   });

//   const [code, setCode] = useState(() => {
//     const storedCode = localStorage.getItem(`${selectedLanguage}_code`);
//     return storedCode || getDefaultBoilerplateCode(selectedLanguage);
//   });

//   const [output, setOutput] = useState('');
//   const [lanNumber, setLanNumber] = useState('17');
//   const editorRef = useRef(null);

//   useEffect(() => {
//     const handleClick = () => {
//       if (terminalOpen) {
//         setTerminalOpen(false);
//       }
//     };

//     // Add event listener to detect clicks inside the editor area
//     if (editorRef.current && editorRef.current.editor) {
//       editorRef.current.editor.container.addEventListener('click', handleClick);
//     }

//     return () => {
//       // Remove event listener on cleanup
//       if (editorRef.current && editorRef.current.editor) {
//         editorRef.current.editor.container.removeEventListener('click', handleClick);
//       }
//     };
//   }, [terminalOpen]);

//   useEffect(() => {
//     const storedLanguage = localStorage.getItem('selectedLanguage');
//     setSelectedLanguage(storedLanguage || 'javascript');
  
//     const languageMap = {
//       javascript: '17',
//       python: '5',
//       java: '4',
//       c_cpp: '7',
//     };
  
//     setLanNumber(languageMap[storedLanguage] || '17');
//   }, []);
  
//   useEffect(() => {
//     const storedCode = localStorage.getItem(`${selectedLanguage}_code`);
//     setCode(storedCode || getDefaultBoilerplateCode(selectedLanguage));
//   }, [selectedLanguage]);

//   const handleLanguageChange = (event) => {
//     const language = event.target.value;
//     setSelectedLanguage(language);
  
//     // Map language to language number
//     const languageMap = {
//       javascript: '17',
//       python: '5',
//       java: '4',
//       c_cpp: '7',
//     };
  
//     setLanNumber(languageMap[language] || '0');
  
//     const storedCode = localStorage.getItem(`${language}_code`);
//     if (storedCode) {
//       setCode(storedCode);
//     } else {
//       // If no stored code for the selected language, set it to the respective boilerplate code
//       setCode(getDefaultBoilerplateCode(language));
//       localStorage.setItem(`${language}_code`, getDefaultBoilerplateCode(language)); // Store the boilerplate code
//     }
  
//     localStorage.setItem('selectedLanguage', language); // Store language immediately
//   };
  
//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     localStorage.setItem(`${selectedLanguage}_code`, newCode);
//   };

//   const handleRun = async () => {
//     if (!terminalOpen) {
//       setTerminalOpen(!terminalOpen);
//     }
  
//     const apiKey = apiKeys[apiKeyIndex];
//     const encodedParams = new URLSearchParams();
//     encodedParams.set('LanguageChoice', lanNumber);
//     encodedParams.set('Program', code);
  
//     const options = {
//       method: 'POST',
//       url: 'https://code-compiler.p.rapidapi.com/v2',
//       headers: {
//         'content-type': 'application/x-www-form-urlencoded',
//         'X-RapidAPI-Key': apiKey,
//         'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com',
//       },
//       data: encodedParams,
//     };
  
//     try {
//       const response = await axios.request(options);
//       console.log(response.data);
//       if (response.data.Result) {
//         setOutput(response.data.Result);
  
//         const exampleOutput = '32\n';
  
//         if (response.data.Result === exampleOutput) {
//           console.log('Code is matched'); // Output matches the example's output
//           setIsMatched(true);
//           // Allow submission
//         } else {
//           console.log("Code doesn't match"); // Output doesn't match the example's output
//           setIsMatched(false);
//           // Prevent submission
//         }
//       } else if (response.data.Errors) {
//         setOutput(response.data.Errors);
//       } else {
//         setOutput('No output or errors available.');
//       }

//       if (response.data.Error && response.data.Error.Message === 'Rate limit exceeded') {
//         setApiKeyIndex((prevIndex) => (prevIndex + 1) % apiKeys.length);
//         console.log('Switched to the next API key.');
//       }

//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         console.log('Waiting for the response');
//         switchToNextApiKey(); // Call the function to switch to the next API key
//       } else {
//         console.error(error);
//         setOutput('Error occurred during code execution.');
//       }
//     }
    
//   };

//   useEffect(() => {
//     if (isApiKeySwitched) {
//       setIsApiKeySwitched(false);
//       handleRun();
//     }
//   }, [isApiKeySwitched]);

//   // Function to switch to the next API key
//   const switchToNextApiKey = () => {
//     setApiKeyIndex((prevIndex) => (prevIndex + 1) % apiKeys.length);
//     setIsApiKeySwitched(true);
//   };

//   const handleRefresh = () => {
//     localStorage.removeItem(`${selectedLanguage}_code`);
//     const defaultCode = getDefaultBoilerplateCode(selectedLanguage);
//     setCode(defaultCode);
//   };
  
//   const handleSubmit = () => {
//     if (!terminalOpen) {
//       setTerminalOpen(!terminalOpen);
//     }

//     const exampleOutput = '32\n';
//     if (output === exampleOutput) {
//       // Submit the code
//       setOutput('Code submitted!🎉🎉🎉');
//       setIsSubmitted(true);
//       localStorage.setItem('isSubmitted', 'true');
//       const questionTitle = 'Binary Tree Maximum Path Sum'; // Replace with the actual question title
//       const userId = auth.currentUser.uid;
//       const questionLanguage = selectedLanguage;
//       const questionCode = code;
  
//       const userRef = database.ref('users').child(auth.currentUser.uid);
//       userRef.transaction((userData) => {
//         if (userData) {
//           if (!userData.questionsCount) {
//             userData.questionsCount = 1;
//           } else {
//             userData.questionsCount += 1;
//           }
//         }
//         return userData;
//       })
//       .then(() => {
  
//       // Save the question solved details to the Firebase Realtime Database with the user UID
//       const questionRef = database.ref('users').child(userId).child('questions').push();
//       questionRef.set({
//         title: questionTitle,
//         language: questionLanguage,
//         code: questionCode,
//         timestamp: Date.now(),
//       })
//       .then(() => {
//         console.log('Question solved details added to the user database');
//       })
//       .catch((error) => {
//         console.error('Error adding question solved details to the user database:', error);
//       });
//     }).catch((error) => {
//       console.error('Error updating user question count:', error);
//     });
//     } else {
//       // Output doesn't match the example's output
//       setOutput("Result is not matched with the test case.");
//     }
//   };
  
//   return (
//     <div className='reverse'>
//       <Navbar />
//       {loggedIn ? (
//       <div className='reverse-container'>
//         <div className={`reverse-desc ${isSubmitted ? 'submitted' : ''}`}>
//           <h3>Binary Tree Maximum Path Sum</h3>
//           <p>Given a binary tree, find the maximum path sum. A path is defined as any sequence of nodes from some starting node to any node in the tree along the parent-child connections.</p>
//           <div className='examples'>
//             <div className='reverse-exm'>
//               <h4>Test Case : </h4>
//               <img src={binary} />
//               <div className={`in-out ${isMatched ? 'matched' : ''}`}>
//                 <h5>Input : <span className='weak'>tree = [1, 2, 3, 11, 12, 14, 5]</span></h5>
//                 <h5>Output : <span className='weak'>32</span></h5>
//                 <h5>Explanation : <span className='weak'>The optimal path for this is 12-2-1-3-14 with a path sum of 32.</span></h5>
//               </div>
//             </div>
//             <p></p>
//             <br />
//           </div>
//         </div>
//         <div className='reverse-editor'>
//           <div className='code-container'>
//             <div className='code-editor'>
//               <div className='custom-select'>
//                 <select
//                   value={selectedLanguage}
//                   onChange={handleLanguageChange}
//                   className='lan_options'
//                 >
//                   <option value='javascript' className='opt'>
//                     JavaScript
//                   </option>
//                   <option value='python' className='opt'>
//                     Python
//                   </option>
//                   <option value='java' className='opt'>
//                     Java
//                   </option>
//                   <option value='c_cpp' className='opt'>
//                     C++
//                   </option>
//                 </select>
//                 <div className='refresh-button'>
//                   <button onClick={handleRefresh}>Reset</button>
//                 </div>
//               </div>

//               <AceEditor
//                 mode={selectedLanguage}
//                 theme='monokai'
//                 name='code-editor'
//                 editorProps={{ $blockScrolling: true }}
//                 style={{ height: '63vh', width: '70vw', borderRadius: '5px' }}
//                 showPrintMargin={false}
//                 onChange={handleCodeChange}
//                 value={code}
//                 fontSize='14px'
//                 ref={editorRef}
//               />
//             </div>

//             <div className={`reverse-terminal ${terminalOpen ? 'open' : ''}`}>
//               <p onClick={handleTerminalClick}>Output </p>
//               <button className='run' onClick={handleRun}>
//                 Run
//               </button>
//               <button className='submit' onClick={handleSubmit}>Submit</button>
//               {terminalOpen && (
//                 <div className='output-container'>
//                   <pre className='output'>{output}</pre>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       ): (
//         <div className='please'>
//           <h2>Please sign up/login to see this page</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// export default BinaryTreeMax;