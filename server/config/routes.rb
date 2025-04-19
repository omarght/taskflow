Rails.application.routes.draw do
  namespace :api do
    # Auth
    post '/login', to: 'auth#login'
    post '/logout', to: 'auth#logout'
    get '/check', to: 'auth#check_authentication'

    # Users
    post '/create-user', to: 'users#create'
    get '/user/:id', to: 'users#get_user'
    get '/current-user', to: 'users#get_current_user'
    get '/profile', to: 'users#show'
    post '/invite', to: 'users#invite'

    # Password Resets
    post '/password_resets', to: 'password_resets#create'
    put '/password_resets/:token', to: 'password_resets#update'

    # Tasks
    get '/current-user-tasks', to: 'tasks#current_user_tasks'
    post '/create-task', to: 'tasks#create'
    get '/task/:id', to: 'tasks#show'
    put '/update-task/:id', to: 'tasks#update'
    delete '/delete-task/:id', to: 'tasks#destroy'

    # Projects
    get '/projects', to: 'projects#index'
    post '/create-project', to: 'projects#create'
    get '/teams/:team_id/projects/:id', to: 'projects#show'
    get '/team-projects/:id', to: 'teams#team_projects'
    get '/get-team-projects/:id', to: 'projects#get_team_projects'
    get '/teams/:team_id/project-tasks/:id', to: 'projects#project_tasks'
    put '/update-project/:id', to: 'projects#update'
    delete '/delete-project/:id', to: 'projects#destroy'

    # Categories
    get '/categories', to: 'categories#index'

    # Teams
    get '/teams', to: 'teams#index'
    get '/teams/:id', to: 'teams#show'
    post '/create-team', to: 'teams#create'
    put '/update-team/:id', to: 'teams#update'
    delete '/delete-team/:id', to: 'teams#destroy'

    # Team Membership
    get '/team-members/:id', to: 'teams#get_team_members_with_task_counts'
    get '/all-team-members/:id', to: 'teams#get_team_members'
    get '/all-team-members-by-project/:id', to: 'teams#get_all_members_by_project_id'
    get '/non-team-members/:id', to: 'teams#non_members'
    post '/add-team-member', to: 'teams#add_member'
    delete '/remove-team-member', to: 'teams#remove_user'

    # Team-Scoped Data
    get '/team-tasks/:id', to: 'teams#team_tasks'
  end
end
