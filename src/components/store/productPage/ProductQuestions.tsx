import { MessageCircleMore, MessageCircleQuestion } from "lucide-react";

interface Questions {
  id: string;
  question: string;
  answer: string;
}

interface ProductQuestionsProps {
  questions: Questions[];
}

const ProductQuestions = ({ questions }: ProductQuestionsProps) => {
  return (
    <div>
      {/* Title */}

      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">
          Question & Answer ({questions.length})
        </h2>
      </div>
      {/* List of Questions and Answers */}
      <div className="mt-2">
        <ul className="space-y-5">
          {questions.map((qa) => (
            <li key={qa.id} className="relative mb-1">
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <MessageCircleQuestion className="w-4" />
                  <p className="text-sm font-bold leading-5">{qa.question}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <MessageCircleMore className="w-4" />
                  <p className="text-sm  leading-5">{qa.answer}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductQuestions;
