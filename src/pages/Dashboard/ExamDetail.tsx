import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi } from "@/api/exams";
import { questionsApi, CreateQuestionRequest } from "@/api/questions";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ExamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ["exam", id],
    queryFn: () => examsApi.getById(id!),
    enabled: !!id,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["questions", id],
    queryFn: () => questionsApi.getByExam(id!),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: questionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", id] });
      toast.success("Question created successfully");
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create question");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: questionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions", id] });
      toast.success("Question deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to delete question");
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionType = formData.get("question_type") as string;
    
    let options: string[] | undefined;
    if (questionType === "MCQ") {
      const optionsText = formData.get("options") as string;
      options = optionsText.split("\n").filter(opt => opt.trim());
    }

    const data: CreateQuestionRequest = {
      exam_id: id!,
      question_text: formData.get("question_text") as string,
      question_type: questionType as any,
      options,
      correct_answer: formData.get("correct_answer") as string || undefined,
      points: Number(formData.get("points")),
      rubric: formData.get("rubric") as string || undefined,
    };
    createMutation.mutate(data);
  };

  const handleDelete = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteMutation.mutate(questionId);
    }
  };

  if (examLoading || questionsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!exam) {
    return <div className="text-center py-8">Exam not found</div>;
  }

  const canManage = user?.role === "admin" || user?.role === "teacher";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/exams")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground mt-1">{exam.description}</p>
        </div>
        {canManage && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Question</DialogTitle>
                  <DialogDescription>Add a question to this exam</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="question_text">Question Text</Label>
                    <Textarea id="question_text" name="question_text" required rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="question_type">Question Type</Label>
                      <Select name="question_type" defaultValue="SHORT_ANSWER" required>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MCQ">Multiple Choice</SelectItem>
                          <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                          <SelectItem value="ESSAY">Essay</SelectItem>
                          <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="points">Points</Label>
                      <Input id="points" name="points" type="number" defaultValue={10} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="options">Options (for MCQ, one per line)</Label>
                    <Textarea id="options" name="options" rows={4} placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correct_answer">Correct Answer (optional)</Label>
                    <Input id="correct_answer" name="correct_answer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rubric">Rubric (optional)</Label>
                    <Textarea id="rubric" name="rubric" rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Question"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                {questions?.length || 0} questions • Total points: {questions?.reduce((sum, q) => sum + q.points, 0) || 0}
              </CardDescription>
            </div>
            <Badge variant={exam.status === "PUBLISHED" ? "default" : "secondary"}>
              {exam.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No questions yet. Add your first question above.</p>
          ) : (
            questions?.map((question, index) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                        <div className="flex-1">
                          <p className="font-medium">{question.question_text}</p>
                          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{question.question_type}</Badge>
                            <span>{question.points} points</span>
                          </div>
                          {question.options && question.options.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm">
                              {question.options.map((opt, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
