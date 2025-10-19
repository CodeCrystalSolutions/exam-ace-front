import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { examsApi } from "@/api/exams";
import { questionsApi } from "@/api/questions";
import { attemptsApi, SubmitAnswerRequest } from "@/api/attempts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

export default function TakeExam() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: exam } = useQuery({
    queryKey: ["exam", id],
    queryFn: () => examsApi.getById(id!),
    enabled: !!id,
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => questionsApi.getByExam(id!),
    enabled: !!id,
  });

  const startMutation = useMutation({
    mutationFn: attemptsApi.start,
    onSuccess: (data) => {
      setAttemptId(data.id);
      toast.success("Exam started!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to start exam");
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ attemptId, data }: { attemptId: string; data: SubmitAnswerRequest }) =>
      attemptsApi.submitAnswer(attemptId, data),
    onSuccess: () => {
      toast.success("Answer saved");
    },
  });

  const submitMutation = useMutation({
    mutationFn: attemptsApi.submit,
    onSuccess: () => {
      toast.success("Exam submitted successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to submit exam");
    },
  });

  useEffect(() => {
    if (id && !attemptId) {
      startMutation.mutate({ exam_id: id });
    }
  }, [id]);

  if (!exam || !questions || !attemptId) {
    return <div className="text-center py-8">Loading exam...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSaveAnswer = () => {
    const answerText = answers[currentQuestion.id];
    if (answerText) {
      answerMutation.mutate({
        attemptId,
        data: {
          question_id: currentQuestion.id,
          answer_text: answerText,
        },
      });
    }
  };

  const handleNext = () => {
    handleSaveAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      if (!confirm(`You have only answered ${answeredCount} out of ${questions.length} questions. Submit anyway?`)) {
        return;
      }
    }
    handleSaveAnswer();
    setTimeout(() => {
      submitMutation.mutate(attemptId);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Question {currentIndex + 1} of {questions.length} • {answeredCount} answered
          </p>
        </div>
        <Badge variant="secondary">{currentQuestion.points} points</Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-start gap-3">
            <Badge variant="outline" className="mt-1">{currentIndex + 1}</Badge>
            <span>{currentQuestion.question_text}</span>
          </CardTitle>
          <CardDescription>
            Type: {currentQuestion.question_type.replace("_", " ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.question_type === "MCQ" && currentQuestion.options ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswerChange}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : currentQuestion.question_type === "TRUE_FALSE" ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswerChange}
            >
              {["True", "False"].map((option) => (
                <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Textarea
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={currentQuestion.question_type === "ESSAY" ? 10 : 4}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              <Send className="mr-2 h-4 w-4" />
              {submitMutation.isPending ? "Submitting..." : "Submit Exam"}
            </Button>
          )}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Your answers are automatically saved as you progress. You can navigate between questions using the Previous and Next buttons.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
