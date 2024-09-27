import { Button } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";
import { Tags } from "lucide-react";

import { useQuestions, addQuestion } from "~/lib/questions";

import { useState, useRef } from "react"; 
import type { NewQuestion } from "@peerprep/schemas";  
import toast from "react-hot-toast";

export default function QuestionsPage() {
  const { data: questions } = useQuestions();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    if (event.target.files) {  
      setSelectedFile(event.target.files[0]); 
      setIsAddingQuestion(true); 
    }  
  };  

  const handleAddQuestion = async () => {  
    if (!selectedFile) {  
      fileInputRef.current?.click();  
      return;  
    }  

    try {  
      if (selectedFile.type !== 'application/json') {  
        toast.error('Please select a valid JSON file.');  
        return;  
      }  
  
      const json = await selectedFile.text();  
      const newQuestion: NewQuestion = JSON.parse(json);  
      await addQuestion(newQuestion);   
      setIsAddingQuestion(false);  
      setSelectedFile(null);  
      toast.success('Succesfully added the new questions!');
    } catch (error) {  
      toast.error('Failed to add new question.');  
      console.error(error);  
    }   
  }; 

  if (!questions) return null;
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Questions Page</h1>
        <div>    
          <Button onClick={handleAddQuestion} variants={{ variant: "primary" }}>  
            Add Questions  
          </Button>  
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {isAddingQuestion && (
            <div>
              {selectedFile && (
                <div>
                  Selected file: {selectedFile.name}
                </div>
              )}
              <Button onClick={handleAddQuestion} variants={{ variant: "primary"}}>
                Upload Question
              </Button>
            </div>
          )}
        </div> 
      </div>
      <div>
        {questions.map(question => (
          <div
            key={question.id}
            className="bg-main-900 my-4 flex items-center justify-between rounded-lg p-4"
          >
            <div>
              <span className="flex-grow truncate">{question.title}</span>
              <div className="flex items-center">
                <div
                  className={`inline-flex items-center justify-center px-2 py-1 text-sm text-white`}
                >
                  {question.difficulty}
                </div>
                <div className="ml-4 flex items-center">
                  <div className="text-sm">
                    <Tags />
                  </div>
                  <div className="ml-2 text-sm">{question.tags.join(", ")}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 space-x-2">
              <Link href={`/questions/${question.id}`}>
                <Button variants={{ variant: "primary" }} className="w-24">
                  View
                </Button>
              </Link>
              <Button variants={{ variant: "primary" }} className="w-24">
                Edit
              </Button>
              <Button variants={{ variant: "primary" }} className="w-24">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
