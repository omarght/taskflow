class Api::TasksController < ApplicationController
    before_action :authenticate_user!
  
    # GET /tasks
    def index
      render json: { message: "This is a protected route. DONE!!!" }, status: :ok
    end

    def current_user_tasks
        puts "current_user_tasks"
        tasks = @current_user.tasks
        puts tasks
        puts @current_user.id
        puts @current_user.email

        render json: tasks.as_json(include: { category: { only: [:title] }, project: { only: [:title] }, tags: { only: [:title] } }), status: :ok
    end

    def show
      task = Task.find(params[:id])
      render json: task.as_json(include: { category: { only: [:title] }, project: { only: [:title] }, tags: { only: [:title] } }), status: :ok
    end

    def create
      # Create or find tags
      tag_ids = params[:task][:tags].map do |tag_id|
        tag = Tag.find_or_create_by(title: tag_id)
        tag.id
      end
    
      # Merge the resolved tag_ids into the task parameters
      task_params_with_tags = task_params.merge(tag_ids: tag_ids)
      
      # Add the user_id to the task
      unless params[:task][:member_id].nil?
        task_params_with_tags = task_params_with_tags.merge({user_id: params[:task][:member_id]})
      end
      
      # Create the task
      task = Task.new(task_params_with_tags)
      if task.save
        render json: task, status: :created
      else
        Rails.logger.error "Task creation failed: #{task.errors.full_messages}"
        render json: { error: task.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def update
      # Create or find tags
      tag_ids = params[:task][:tags].map do |tag_id|
        tag = Tag.find_or_create_by(title: tag_id)
        tag.id
      end
    
      # Find the task
      task = Task.find(params[:id])
    
      # Check if project_id is 0 and set it to nil
      updated_params = task_params.to_h
      if updated_params[:project_id].to_i == 0
        updated_params[:project_id] = nil
      end
    
      # Merge the updated attributes
      task_params_with_tags = updated_params.merge(tag_ids: tag_ids)
    
      # Update the task with the new attributes
      if task.update(task_params_with_tags)
        render json: task, status: :ok
      else
        render json: { error: task.errors.full_messages }, status: :unprocessable_entity
      end
    end    
    

    def destroy
      task = Task.find(params[:id])

      if task.destroy
        render json: { message: "Task deleted" }, status: :ok
      else
        render json: { error: task.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def task_params
      params.require(:task).permit(:title, :description, :start_date, :due_date, :status, :importance, :user_id, :category_id, :project_id, tag_ids: [])
    end
end
