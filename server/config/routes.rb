Rails.application.routes.draw do
  namespace :api do
    post '/login', to: 'auth#login'
    post '/logout', to: 'auth#logout'

    get '/profile', to: 'users#show'

    get '/check', to: 'auth#check_authentication'

    get '/current-user-tasks', to: 'tasks#current_user_tasks'
  end

end