import { PageData } from "@/types/audiobook";
import React, { createContext, useContext, useState } from "react";

type StoryContextType = {
  pages: PageData[];
  setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
  audioBookEditionId: string;
  setAudioBookEditionId: React.Dispatch<React.SetStateAction<string>>;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pages, setPages] = useState<PageData[]>([
    { text: "", layout: "imageTopTextBottom", pageNum: 1 },
  ]);
  const [audioBookEditionId, setAudioBookEditionId] = useState<string>("");

  return (
    <StoryContext.Provider
      value={{ pages, setPages, audioBookEditionId, setAudioBookEditionId }}
    >
      {children}
    </StoryContext.Provider>
  );
};
export const useStory = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
};
