import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsApi, Exam, CreateExamRequest, UpdateExamRequest } from "@/api/exams";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Search, Clock, Target, Eye, Play } from "lucide-react";

export default function Exams() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const canManage = user?.role === "admin" || user?.role === "teacher";
  const isStudent = user?.role === "student";

  const { data: exams, isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: examsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: examsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam created successfully");
      setIsCreateOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to create exam");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExamRequest }) =>
      examsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("Exam updated successfully");
      setIsEditOpen(false);
      setSelectedExam(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "Failed to update exam");
    },
  });

  const filteredExams = exams?.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: CreateExamRequest = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration_minutes: parseInt(formData.get("duration_minutes") as string),
      passing_score: parseFloat(formData.get("passing_score") as string),
    };
    createMutation.mutate(data);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedExam) return;
    const formData = new FormData(e.currentTarget);
    const data: UpdateExamRequest = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration_minutes: parseInt(formData.get("duration_minutes") as string),
      passing_score: parseFloat(formData.get("passing_score") as string),
    };
    updateMutation.mutate({ id: selectedExam.id, data });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{isStudent ? "Available Exams" : "Exams"}</h1>
          <p className="text-muted-foreground mt-2">
            {isStudent ? "Take exams and view your attempts" : "Create and manage exams"}
          </p>
        </div>
        {canManage && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>Add a new exam to your organization</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input id="create-title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea id="create-description" name="description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-duration">Duration (minutes)</Label>
                  <Input
                    id="create-duration"
                    name="duration_minutes"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-passing">Passing Score (%)</Label>
                  <Input
                    id="create-passing"
                    name="passing_score"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Exam"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exams</CardTitle>
          <CardDescription>A list of all exams in your organization</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Passing Score</TableHead>
                  <TableHead>Status</TableHead>
                  {!isStudent && <TableHead className="text-right">Actions</TableHead>}
                  {isStudent && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams?.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{exam.title}</div>
                        {exam.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {exam.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {exam.duration_minutes} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        {exam.passing_score}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={exam.active ? "default" : "secondary"}>
                        {exam.status || (exam.active ? "PUBLISHED" : "DRAFT")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {isStudent ? (
                        (exam.active || exam.status === "PUBLISHED") && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => navigate(`/dashboard/exams/${exam.id}/take`)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start Exam
                          </Button>
                        )
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/exams/${exam.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedExam(exam);
                              setIsEditOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Exam</DialogTitle>
              <DialogDescription>Update exam information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={selectedExam?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={selectedExam?.description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration (minutes)</Label>
                <Input
                  id="edit-duration"
                  name="duration_minutes"
                  type="number"
                  min="1"
                  defaultValue={selectedExam?.duration_minutes}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-passing">Passing Score (%)</Label>
                <Input
                  id="edit-passing"
                  name="passing_score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  defaultValue={selectedExam?.passing_score}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Exam"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
