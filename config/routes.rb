Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "demo" => "demo#say_hi"
  get "demo2" => "demo#say_goodbye"
end
