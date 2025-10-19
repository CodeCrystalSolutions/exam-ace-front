import { useQuery } from "@tanstack/react-query";
import { attemptsApi } from "@/api/attempts";
import { resultsApi } from "@/api/results";
import { evaluationsApi } from "@/api/evaluations";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Results() {
  const { user } = useAuth();
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ["attempts"],
    queryFn: attemptsApi.getByStudent,
    enabled: user?.role === "student",
  });

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["results"],
    queryFn: resultsApi.getByStudent,
    enabled: user?.role === "student",
  });

  const { data: feedback } = useQuery({
    queryKey: ["feedback", selectedAttemptId],
    queryFn: () => evaluationsApi.getStudentFeedback(selectedAttemptId!),
    enabled: !!selectedAttemptId,
  });

  if (attemptsLoading || resultsLoading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  const evaluatedAttempts = attempts?.filter(a => a.status === "EVALUATED") || [];
  const averageScore = results && results.length > 0
    ? results.reduce((sum, r) => sum + (r.total_score / r.max_score) * 100, 0) / results.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Results</h1>
        <p className="text-muted-foreground mt-2">View your exam scores and feedback</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attempts?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {evaluatedAttempts.length} evaluated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {results?.length || 0} graded exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results && results.length > 0
                ? results.reduce((max, r) => 
                    (r.total_score / r.max_score) > max ? (r.total_score / r.max_score) : max, 0
                  ).toFixed(0) + "%"
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Highest achievement</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
          <CardDescription>Detailed scores and feedback for your attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {evaluatedAttempts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No evaluated exams yet. Complete an exam to see results here.
            </p>
          ) : (
            <div className="space-y-3">
              {evaluatedAttempts.map((attempt) => {
                const result = results?.find(r => r.attempt_id === attempt.id);
                const percentage = result 
                  ? ((result.total_score / result.max_score) * 100).toFixed(1)
                  : "0";

                return (
                  <Card key={attempt.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant={Number(percentage) >= 70 ? "default" : "secondary"}>
                              {result?.grade || "N/A"}
                            </Badge>
                            <div>
                              <p className="font-medium">Exam ID: {attempt.exam_id.slice(0, 8)}...</p>
                              <p className="text-sm text-muted-foreground">
                                Score: {result?.total_score || 0} / {result?.max_score || 0} ({percentage}%)
                              </p>
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedAttemptId(attempt.id)}
                            >
                              View Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Exam Feedback</DialogTitle>
                              <DialogDescription>
                                Detailed feedback and evaluation for your submission
                              </DialogDescription>
                            </DialogHeader>
                            {feedback && selectedAttemptId === attempt.id && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Overall Score</h4>
                                  <div className="flex items-center gap-3">
                                    <Badge variant="default" className="text-lg px-4 py-2">
                                      {feedback.total_score} points
                                    </Badge>
                                    <Badge variant="outline" className="text-lg px-4 py-2">
                                      {feedback.grade}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Student Feedback</h4>
                                  <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{feedback.student_feedback}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Teacher's Rationale</h4>
                                  <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{feedback.teacher_rationale}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
