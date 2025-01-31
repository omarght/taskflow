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
end
