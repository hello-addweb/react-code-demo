export interface QuestionsListDataType {
  title?: string;
  questionList: {
    id: string;
    question: string;
  }[];
  questionAnswerSet?: {
    id: string;
    question: string;
    answer: string;
  }[];
}
