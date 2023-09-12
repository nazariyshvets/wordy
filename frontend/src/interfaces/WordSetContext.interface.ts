import { Dispatch, SetStateAction } from "react";
import WordRecord from "./WordRecord.interface";

interface WordSetContext {
  records: WordRecord[];
  setCurrentModeId: Dispatch<SetStateAction<string>>;
  setAreConfettiEnabled: Dispatch<SetStateAction<boolean>>;
}

export default WordSetContext;
