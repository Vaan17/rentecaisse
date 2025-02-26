Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "demo" => "demo#say_hi"
  get "demo2" => "demo#say_goodbye"

  post '/api/auth/login', to: 'auth#login'
  post '/api/auth/register', to: 'auth#register'
  post '/api/auth/confirm_email', to: 'auth#confirm_email'
  post '/api/auth/forgot-password', to: 'auth#forgot_password'
  post '/api/auth/reset-password', to: 'auth#reset_password'
end
