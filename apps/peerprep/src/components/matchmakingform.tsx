import { Button } from "@peerprep/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@peerprep/ui/select";
import { useEffect, useState } from "react";  
import { useQuestions } from "@peerprep/utils/client";   
import type { Difficulty } from "@peerprep/schemas";  

interface MatchmakingFormProps {  
  onMatchmaking: (difficulty: Difficulty, tags: string[]) => void;  
}  

const MatchmakingForm: React.FC<MatchmakingFormProps> = ({ onMatchmaking }) => {  
  const { data: questions } = useQuestions();   
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);  
  const [availableTags, setAvailableTags] = useState<string[]>([]);  

  useEffect(() => {  
    if (questions) {  
      const tagsSet = new Set<string>();  
      questions.forEach(question => {  
        question.tags.forEach(tag => tagsSet.add(tag));  
      });  
      setAvailableTags(Array.from(tagsSet));  
    }  
  }, [questions]);  

  const toggleTag = (tag: string) => {  
    setSelectedTags((prevTags) =>  
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]  
    );  
  };  

  const handleSubmit = () => {  
    onMatchmaking(difficulty, selectedTags);   
  };  

  return (  
    <div>  
      <label>Select Difficulty:</label>  
      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>  
        <SelectTrigger>  
          <SelectValue placeholder="Select Difficulty" />  
        </SelectTrigger>  
        <SelectContent>  
          {["EASY", "MEDIUM", "HARD"].map((level) => (  
            <SelectItem key={level} value={level as Difficulty}>  
              {level}  
            </SelectItem>  
          ))}  
        </SelectContent>  
      </Select>   

      <div>  
        <label>Select Topics:</label>  
        <div>  
          {availableTags.map((tag) => (  
            <div key={tag}>  
              <input  
                type="checkbox"  
                id={tag}  
                value={tag}  
                checked={selectedTags.includes(tag)}  
                onChange={() => toggleTag(tag)}  
              />  
              <label htmlFor={tag}>{tag}</label>  
            </div>  
          ))}  
        </div>  
      </div>  

      <Button onClick={handleSubmit} variants={{variant: "primary" }}>Start Matching</Button>  
    </div>  
  );  
}  

export default MatchmakingForm;