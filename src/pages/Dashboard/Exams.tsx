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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Pencil, Search, Clock, Target, Eye, Play, FileText } from "lucide-react";

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
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">
            {isStudent ? "Available Exams" : "Exams Management"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isStudent ? "Take exams and track your progress" : "Create, manage, and organize your exams"}
          </p>
        </div>
        {canManage && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create New Exam</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new exam for your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="create-title" className="text-base">
                      Exam Title <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="create-title" 
                      name="title" 
                      placeholder="e.g., Mathematics Final Exam"
                      required 
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-description" className="text-base">
                      Description
                    </Label>
                    <Textarea 
                      id="create-description" 
                      name="description"
                      placeholder="Provide a brief description of the exam..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-duration" className="text-base">
                        Duration (minutes) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="create-duration"
                        name="duration_minutes"
                        type="number"
                        min="1"
                        placeholder="60"
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-passing" className="text-base">
                        Passing Score (%) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="create-passing"
                        name="passing_score"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="70"
                        required
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Exam"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Main Content Card */}
      <Card className="border-2">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">
                {isStudent ? "Your Exams" : "All Exams"}
              </CardTitle>
              <CardDescription className="text-base">
                {filteredExams?.length || 0} exam{filteredExams?.length !== 1 ? "s" : ""} available
              </CardDescription>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by exam title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 border rounded-lg p-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          ) : filteredExams && filteredExams.length > 0 ? (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Exam Details</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Passing Score</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id} className="group">
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-semibold text-base group-hover:text-primary transition-colors">
                              {exam.title}
                            </div>
                            {exam.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1 max-w-[300px]">
                                {exam.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{exam.duration_minutes} min</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">{exam.passing_score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={exam.active || exam.status === "PUBLISHED" ? "default" : "secondary"}
                          className="font-medium"
                        >
                          {exam.status || (exam.active ? "PUBLISHED" : "DRAFT")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isStudent ? (
                            (exam.active || exam.status === "PUBLISHED") && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/dashboard/exams/${exam.id}/take`)}
                                className="gap-2"
                              >
                                <Play className="h-4 w-4" />
                                Start Exam
                              </Button>
                            )
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/dashboard/exams/${exam.id}`)}
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedExam(exam);
                                  setIsEditOpen(true);
                                }}
                                className="gap-2"
                              >
                                <Pencil className="h-4 w-4" />
                                Edit
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {search ? "No exams found" : "No exams yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                {search 
                  ? "Try adjusting your search terms to find what you're looking for."
                  : canManage 
                    ? "Get started by creating your first exam."
                    : "No exams are available at the moment."
                }
              </p>
              {canManage && !search && (
                <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Exam
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="text-2xl">Edit Exam</DialogTitle>
              <DialogDescription>
                Update the exam details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-base">
                  Exam Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={selectedExam?.title}
                  placeholder="e.g., Mathematics Final Exam"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={selectedExam?.description}
                  placeholder="Provide a brief description of the exam..."
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration" className="text-base">
                    Duration (minutes) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-duration"
                    name="duration_minutes"
                    type="number"
                    min="1"
                    defaultValue={selectedExam?.duration_minutes}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-passing" className="text-base">
                    Passing Score (%) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-passing"
                    name="passing_score"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={selectedExam?.passing_score}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedExam(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
