Rails.application.routes.draw do
  namespace :api do
    post '/login', to: 'auth#login'
    post '/logout', to: 'auth#logout'

    get '/profile', to: 'users#show'

    get '/check', to: 'auth#check_authentication'

    get '/current-user-tasks', to: 'tasks#current_user_tasks'

    get '/categories', to: 'categories#index'

    get '/projects', to: 'projects#index'

    post '/create-task', to: 'tasks#create'

    get '/task/:id', to: 'tasks#show'

    put '/update-task/:id', to: 'tasks#update'

    delete '/delete-task/:id', to: 'tasks#destroy'

    get '/teams', to: 'teams#index'

    get '/team/:id', to: 'teams#show'

    post '/create-team', to: 'teams#create'

    put '/update-team/:id', to: 'teams#update'

    delete '/delete-team/:id', to: 'teams#destroy'

    get '/team-tasks/:id', to: 'teams#team_tasks'

    get '/team-projects/:id', to: 'teams#team_projects'

    get '/project/:id', to: 'projects#show'

    get '/project-tasks/:id', to: 'projects#project_tasks'

    post '/create-project', to: 'projects#create'

    put '/update-project/:id', to: 'projects#update'

    delete '/delete-project/:id', to: 'projects#destroy'

    get '/get-team-projects/:id', to: 'projects#get_team_projects'

    post '/create-user', to: 'users#create'

    get '/team-members/:id', to: 'teams#get_team_members_with_task_counts'

    get '/all-team-members/:id', to: 'teams#get_team_members'

    get '/all-team-members-by-project/:id', to: 'teams#get_all_members_by_project_id'
  end

end