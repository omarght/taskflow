class Api::TeamsController < ApplicationController
    before_action :authenticate_user!
    
    def index
        teams = Team.all
        render json: teams.map { |team| team.as_json(include: 
            { 
                manager: { only: [:name] },
                projects: { only: [:id, :name] },
            })
            .merge(
                task_count: team.tasks.count,
                project_count: team.projects.size,
                user_count: team.users.size
            )
        }, status: :ok
    end

    def show
        team = Team.find(params[:id])
        render json: team.as_json(include: 
            { 
                manager: { only: [:name] },
                projects: { only: [:id, :title] },
            })
            .merge(
                task_count: team.tasks.count,
                project_count: team.projects.size,
                user_count: team.users.size
            ), status: :ok
    end

    def create
        project_ids = params[:team][:project_ids]
        user_ids = params[:team][:user_ids]

        team_with_projects_and_users = team_params.merge(project_ids: project_ids, user_ids: user_ids)

        team = Team.new(team_with_projects_and_users)
        if team.save
            render json: team.as_json(include: 
            { 
                manager: { only: [:name] },
                projects: { only: [:id, :title] },
            })
            .merge(
                task_count: team.tasks.count,
                project_count: team.projects.size,
                user_count: team.users.size
            ), status: :created
        else
            render json: { errors: team.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        team = Team.find(params[:id])
        project_ids = params[:team][:project_ids]
        user_ids = params[:team][:user_ids]

        team_with_projects_and_users = team_params.merge(project_ids: project_ids, user_ids: user_ids)

        if team.update(team_with_projects_and_users)
            render json: team.as_json(include:
            {
                manager: { only: [:name] },
                projects: { only: [:id, :title] },
            })
            .merge(
                task_count: team.tasks.count,
                project_count: team.projects.size,
                user_count: team.users.size
            ), status: :ok
        else
            render json: { errors: team.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def team_tasks
        team = Team.find(params[:id])
        tasks = team.tasks

        render json: tasks.map { |task| task.as_json(include:
            {
                project: { only: [:id, :title] },
                user: { only: [:id, :name] }
            })
        }, status: :ok
    end

    def team_projects
        team = Team.find(params[:id])
        projects = team.projects
        
        projects_with_task_count = projects.map do |project|
            completed_task_count = project.tasks.where(status: 'completed').size
            project.attributes.merge(task_count: project.tasks.size, completed_task_count: completed_task_count, open_tasks: project.tasks.size - completed_task_count)
        end

        render json: projects_with_task_count, status: :ok
    end

    def destroy
        team = Team.find(params[:id])
        team.destroy
        render json: { message: "Team deleted" }, status: :ok
    end
    
    private

    def team_params
        params.require(:team).permit(:id, :name, :manager_id, project_ids: [], user_ids: [])
    end
end
