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
  end

end