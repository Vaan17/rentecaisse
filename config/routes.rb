Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Demonstration routes
  get "demo" => "demo#say_hi"
  get "demo2" => "demo#say_goodbye"

  # Routes pour l"authentification
  post "/api/auth/login", to: "auth#login"
  post "/api/auth/register", to: "auth#register"
  post "/api/auth/confirm_email", to: "auth#confirm_email"
  post "/api/auth/forgot-password", to: "auth#forgot_password"
  post "/api/auth/reset-password", to: "auth#reset_password"
  post "/api/auth/logout", to: "auth#logout"

  # Routes pour les pages authentifiées
  get "/api/authenticated-page", to: "authenticated_page#index"
  post "/api/update_profile", to: "authenticated_page#update_profile"

  # Routes pour les entreprises et sites
  get "/api/get_entreprises", to: "authenticated_page#get_entreprises"
  get "/api/get_sites", to: "authenticated_page#get_sites"
  post "/api/verify_and_affect_user", to: "authenticated_page#verify_and_affect_user"
  post "/api/cancel_affectation", to: "authenticated_page#cancel_affectation"
  get "/api/users/profile-image", to: "authenticated_page#get_profile_image"

  # Routes pour le profil utilisateur
  get "/api/user/profile", to: "authenticated_page#get_user_profile"
  patch "/api/user/profile", to: "authenticated_page#update_user_profile"
  post "/api/user/profile/photo", to: "authenticated_page#update_profile_photo"

  # Routes pour les sites
  get "/api/sites" => "sites#fetch_all"

  # Routes pour les entreprises
  get "/api/entreprises" => "entreprises#fetch_all"
  get "/api/entreprises/:id" => "entreprises#fetch"
end
