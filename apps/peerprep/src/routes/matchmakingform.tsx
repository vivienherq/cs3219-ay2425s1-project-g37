// src/components/MatchmakingForm.tsx  
import { useEffect, useState } from "react";  
import { useQuestions } from "@peerprep/utils/client";   

interface MatchmakingFormProps {  
  onMatchmaking: (difficulty: string, tags: string[]) => void; // Callback to handle matchmaking  
}  

function MatchmakingForm({ onMatchmaking }: MatchmakingFormProps) {  
  const { data: questions } = useQuestions();  // Fetch questions  
  const [difficulty, setDifficulty] = useState("EASY"); // Default difficulty  
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Selected tags  
  const [availableTags, setAvailableTags] = useState<string[]>([]); // Tags sourced from questions  

  // Extracting tags and unique difficulty levels based on questions  
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
    setDifficulty(e.target.value);  
  };  

  const toggleTag = (tag: string) => {  
    setSelectedTags((prevTags) =>  
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]  
    );  
  };  

  const handleSubmit = () => {  
    onMatchmaking(difficulty, selectedTags); // Pass user preferences to parent  
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
          {availableTags.map((tag) => (  // Use available tags from fetched questions  
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