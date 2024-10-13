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

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {  
    setDifficulty(e.target.value as Difficulty); // Ensure casting to Difficulty  
  };  

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
      <label>Difficulty</label>  
      <select value={difficulty} onChange={handleDifficultyChange}>  
        <option value="EASY">Easy</option>  
        <option value="MEDIUM">Medium</option>  
        <option value="HARD">Hard</option>  
      </select>  

      <div>  
        <label>Topics/Tags</label>  
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

      <button onClick={handleSubmit}>Start Matchmaking</button>  
    </div>  
  );  
}  

export default MatchmakingForm;