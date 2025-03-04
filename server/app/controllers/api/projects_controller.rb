class Api::ProjectsController < ApplicationController
    before_action :authenticate_user!, only: [:index, :show, :create, :update, :destroy]

    # GET /projects
    def index
        projects = Project.all
        render json: { projects: projects }, status: :ok
    end

    def show
        project = Project.find(params[:id])
        render json: { project: project }, status: :ok
    end

    def project_tasks
        project = Project.find(params[:id])
        tasks = project.tasks
        render json: tasks.as_json(include: { category: { only: [:title] }, project: { only: [:title] }, tags: { only: [:title] } }), status: :ok
    end

    def create
        project = Project.new(project_params)
        if project.save
            render json: { project: project }, status: :created
        else
            Rails.logger.error "Project creation failed: #{project.errors.full_messages}"
            render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        project = Project.find(params[:id])

        if project.update(project_params)
            render json: { project: project }, status: :ok
        else
            Rails.logger.error "Project update failed: #{project.errors.full_messages}"
            render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        project = Project.find(params[:id])
        if project.destroy
            render json: { project: project }, status: :ok
        else
            Rails.logger.error "Project deletion failed: #{project.errors.full_messages}"
            render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def get_team_projects
        team = Team.find(params[:id])
        projects = team.projects
        render json: projects, status: :ok
    end
    
    private

    # app/controllers/api/projects_controller.rb
    def project_params
        params.require(:project).permit(
            :title,
            :description,
            :start_date,
            :end_date,
            :team_id # Add this line
        )
    end
end
