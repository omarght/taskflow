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

        puts tasks.as_json(include: { category: { only: [:title] }, project: { only: [:title] }, tags: { only: [:title] } }), status: :ok
        render json: tasks.as_json(include: { category: { only: [:title] }, project: { only: [:title] }, tags: { only: [:title] } }), status: :ok
    end
end
