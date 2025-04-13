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
        
        if(team.manager_id)
            manager = User.find(team.manager_id)
            team.users << manager unless team.users.exists?(manager.id)
        end

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
                user: { only: [:id, :name] },
                category: { only: [:id, :title] },
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

    def get_team_members_with_task_counts
        team = Team.find(params[:id])
        # Get all project IDs for this team to filter tasks
        team_project_ids = team.projects.pluck(:id)
        
        # Include the manager with regular team members
        all_members = team.manager ? (team.users + [team.manager]).uniq : team.users
        
        members_with_task_counts = all_members.map do |member|
          # Filter tasks to only those in this team's projects
          member_tasks = member.tasks.where(project_id: team_project_ids)
          open_tasks = member_tasks.where.not(status: 'completed').size
          completed_tasks = member_tasks.where(status: 'completed').size
          member.as_json.merge(
            open_tasks: open_tasks,
            completed_tasks: completed_tasks,
            is_manager: member == team.manager
          )
        end
      
        render json: members_with_task_counts, status: :ok
    end

    def get_team_members
        team = Team.find(params[:id])
        # Include the manager with regular team members
        all_members = team.manager ? (team.users + [team.manager]).uniq : team.users
        render json: all_members, status: :ok
    end

    def get_all_members_by_project_id
        project = Project.find(params[:id])
        all_members = project.team.users
        all_members = project.team.manager ? (project.team.users + [project.team.manager]).uniq : project.team.users
        render json: all_members, status: :ok
    end 

    def non_members
        team = Team.find(params[:id])
        @non_members = User.non_members(team.id).select(:id, :name, :email) # Ensure only id and name are returned
    
        render json: @non_members, status: :ok
    end

    def add_member
        team = Team.find_by(id: params[:team_id])
        user = User.find_by(id: params[:user_id])
      
        if team.nil? || user.nil?
          return render json: { error: 'Team or user not found' }, status: :not_found
        end
      
        if team.users.exists?(user.id)
          return render json: { error: 'User is already in the team' }, status: :unprocessable_entity
        end
      
        team.users << user
        UserMailer.added_to_team(user, team).deliver_later
      
        render json: team.users, status: :ok
      end
      

    def remove_user
        team = Team.find(params[:team_id])
        user = User.find(params[:user_id])
        team.users.delete(user)
        render json: team.users, status: :ok
    end

    private

    def team_params
        params.require(:team).permit(:id, :name, :manager_id, project_ids: [], user_ids: [])
    end
end
