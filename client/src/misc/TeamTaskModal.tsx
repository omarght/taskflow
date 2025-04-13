import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { SelectChangeEvent } from '@mui/material';
import { getCategories, getProjects, createTask, getTaskById, updateTask } from '../services/TaskServices';
import { getAllTeamMembers } from '../services/TeamServices';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';
import { getTeamProjects } from '../services/ProjectServices';
import { StyledModal, ModalContent, FormRow, DateTimeRow, TagsBox, ActionButton } from './ModalComponents';

interface TeamTaskModalProps {
  open: boolean;
  handleClose: () => void;
  updateTasks: () => void;
  mode: {
    mode: 'create' | 'edit' | 'view';
    id: number;
  };
  teamId: string;
}

type Errors = {
  title: boolean;
  description: boolean;
  category: boolean;
  importance: boolean;
  start_date: boolean;
  due_date: boolean;
  project_id: boolean;
};

const TeamTaskModal: React.FC<TeamTaskModalProps> = ({ open, handleClose, updateTasks, mode, teamId }) => {
  const [task, setTask] = useState<{
    title: string;
    description: string;
    status: string;
    user_id: number | ''; // Use '' for no selection
    importance: number;
    start_date: Dayjs;
    due_date: Dayjs;
    category_id: number;
    project_id: number; // Make project_id optional with ?
    tags: string[];
  }>({
    title: '',
    description: '',
    status: 'scheduled',
    user_id: '', // Default to empty string for controlled Select
    importance: 0,
    start_date: dayjs(),
    due_date: dayjs(),
    category_id: 0,
    project_id: 0, // Default to empty string
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState<string>('');
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: number; title: string }[]>([]);
  const { loggedInUser } = useAuth();
  const [errors, setErrors] = useState<Errors>({
    title: false,
    description: false,
    category: false,
    importance: false,
    start_date: false,
    due_date: false,
    project_id: false,
  });
  const [loading, setLoading] = useState(false);
  const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

  useEffect(() => {
    if (open) {
      // Reset state and fetch data when modal opens
      setTask({
        title: '',
        description: '',
        status: 'scheduled',
        user_id: '',
        importance: 0,
        start_date: dayjs(),
        due_date: dayjs(),
        category_id: 0,
        project_id: 0,
        tags: [],
      });
      fetchCategories();
      fetchProjects();
      fetchAllTeamMembers();

      if (mode.mode === 'edit' || mode.mode === 'view') {
        getTaskById(`${mode.id}`).then((res) => {
          const taskWithConvertedDates = {
            ...res.data,
            start_date: dayjs(res.data.start_date),
            due_date: dayjs(res.data.due_date),
            user_id: res.data.user_id || '', // Ensure user_id is never undefined
            project_id: res.data.project_id,
          };
          setTask(taskWithConvertedDates);
        });
      }
    }
  }, [open, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAllTeamMembers = async () => {
    try {
      const response = await getAllTeamMembers(teamId);
      const data = response.members.map((member: any) => ({
        id: member.id,
        name: member.name,
      }));
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const data = response.data.categories.map((category: any) => ({
        id: category.id,
        title: category.title,
      }));
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getTeamProjects(teamId);
      const data = response.projects.map((project: any) => ({
        id: project.id,
        title: project.title,
      }));
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartDateChange = (newDate: Dayjs | null) => {
    setTask((prev) => ({ ...prev, start_date: newDate || dayjs() }));
  };

  const handleDueDateChange = (newDate: Dayjs | null) => {
    setTask((prev) => ({ ...prev, due_date: newDate || dayjs() }));
  };

  const handleAddTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(';')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag) {
        setTask((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setCurrentTag('');
    } else {
      setCurrentTag(value);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTask((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToDelete) }));
  };

  const verifyInputs = (): boolean => {
    const newErrors: Errors = {
      title: !task.title.trim(),
      description: !task.description.trim(),
      importance: task.importance === 0,
      start_date: !task.start_date,
      due_date: !task.due_date,
      category: task.category_id === 0,
      project_id: task.project_id === 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      const verification = await verifyInputs();
      if (!verification) return;

      let taskToSave = { ...task };
      // if (task.project_id === '' || task.project_id === 0) delete taskToSave.project_id; // Now valid with optional type
      if (task.user_id === '') taskToSave.user_id = loggedInUser.id; // Default to current user if not set

      const res = await createTask(taskToSave);
      if (res.status === 201) {
        updateTasks();
        handleClose();
      } else {
        console.error('Task creation failed with status:', res.status);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async () => {
    setLoading(true);
    try {
      const verification = await verifyInputs();
      if (!verification) return;

      let taskToUpdate = { ...task };
      //if (task.project_id === 0) delete taskToUpdate.project_id; // Now valid with optional type

      const res = await updateTask(taskToUpdate);
      if (res.status === 200) {
        updateTasks();
        handleClose();
      } else {
        console.error('Task update failed with status:', res.status);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal open={open} onClose={handleClose} sx={{ overflow: 'scroll' }}>
      <ModalContent isMobile={isMobile}>
        <TextField
          error={errors.title}
          fullWidth
          label="Title"
          variant="outlined"
          margin="normal"
          name="title"
          value={task.title}
          onChange={handleInputChange}
        />
        <TextField
          error={errors.description}
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          name="description"
          multiline
          rows={4}
          value={task.description}
          onChange={handleInputChange}
        />
        
        <FormRow>
          <FormControl fullWidth margin="normal">
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                  labelId="status-select-label"
                  id="status-select"
                  name="status"
                  value={task.status}
                  onChange={handleSelectChange}
                  label="Status"
              >
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="on_hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
              </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                  error={errors.importance}
                  labelId="priority-select-label"
                  id="priority-select"
                  name="importance"
                  value={task.importance}
                  onChange={handleSelectChange}
                  label="Priority"
              >
                  <MenuItem value="0"></MenuItem>
                  <MenuItem value="1">Urgent</MenuItem>
                  <MenuItem value="2">High</MenuItem>
                  <MenuItem value="3">Normal</MenuItem>
                  <MenuItem value="4">Low</MenuItem>
                  <MenuItem value="5">Long Term</MenuItem>
              </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                  error={errors.category}
                  labelId="category-select-label"
                  id="category-select"
                  name="category_id"
                  value={task.category_id}
                  onChange={handleSelectChange}
                  label="category"
              >
                  <MenuItem key={0} value={0}></MenuItem>
                  {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                          {category.title}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
      </FormRow>
        <DateTimeRow>
          <DateTimePicker
              sx={{ width: '100%', mb: 2 }}
              value={task.start_date}
              onChange={handleStartDateChange}
              referenceDate={dayjs('2022-04-17T15:30')}
              label="Start Date"
          />

          <DateTimePicker
              sx={{ width: '100%', mb: 2 }}
              value={task.due_date}
              onChange={handleDueDateChange}
              referenceDate={dayjs('2022-04-17T15:30')}
              label="End Date"
          />

          <FormControl sx={{ width: '100%' }}>
              <InputLabel id="project-select-label">Project</InputLabel>
              <Select
                  labelId="project-select-label"
                  id="project-select"
                  name="project_id"
                  value={task.project_id}
                  onChange={handleSelectChange}
                  label="Project"
              >
                  {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                          {project.title}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
        </DateTimeRow>
        <FormControl fullWidth margin="normal">
          <InputLabel id="members-select-label">Members</InputLabel>
          <Select
            labelId="members-select-label"
            name="user_id"
            value={task.user_id}
            onChange={handleSelectChange}
            label="Members"
          >
            <MenuItem value="">None</MenuItem>
            {members.map((member) => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Tags"
          variant="outlined"
          margin="normal"
          value={currentTag}
          onChange={handleAddTags}
          helperText="Type a tag and press ';' to add"
        />
        {task.tags.length > 0 && (
          <TagsBox>
            {task.tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} sx={{ m: 0.5 }} />
            ))}
          </TagsBox>
        )}
        {mode.mode !== 'view' && (
          <ActionButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={mode.mode === 'edit' ? handleUpdateClick : handleSaveClick}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </ActionButton>
        )}
      </ModalContent>
    </StyledModal>
  );
};

export default TeamTaskModal;