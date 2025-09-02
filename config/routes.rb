Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Demonstration routes
  get "demo" => "demo#say_hi"
  get "demo2" => "demo#say_goodbye"

  # Routes pour l"authentification
  post "/api/auth/login" => "auth#login"
  post "/api/auth/register" => "auth#register"
  post "/api/auth/confirm_email" => "auth#confirm_email"
  post "/api/auth/forgot-password" => "auth#forgot_password"
  post "/api/auth/reset-password" => "auth#reset_password"
  post "/api/auth/logout" => "auth#logout"

  # Routes pour les pages authentifiées
  get "/api/authenticated-page" => "authenticated_page#index"
  post "/api/update_profile" => "authenticated_page#update_profile"

  # Routes pour les entreprises et sites
  get "/api/get_entreprises" => "authenticated_page#get_entreprises"
  get "/api/get_sites" => "authenticated_page#get_sites"
  post "/api/verify_and_affect_user" => "authenticated_page#verify_and_affect_user"
  post "/api/cancel_affectation" => "authenticated_page#cancel_affectation"
  get "/api/users/profile-image" => "authenticated_page#get_profile_image"

  # Routes pour les utilisateurs
  get "/api/user/self" => "utilisateurs#fetch_self"
  get "/api/utilisateurs" => "utilisateurs#fetch_all"
  get "/api/utilisateurs/pending_count" => "utilisateurs#get_pending_count"
  post "/api/utilisateurs" => "utilisateurs#invite"
  put "/api/utilisateurs/inscriptions/:id" => "utilisateurs#accept"
  put "/api/utilisateurs" => "utilisateurs#update"
  put "/api/utilisateurs/:id" => "utilisateurs#kick"

  # Routes pour les sites
  get "/api/sites" => "sites#fetch_all"
  get "/api/sites/:id" => "sites#fetch"
  post "/api/sites" => "sites#create"
  put "/api/sites" => "sites#update"
  delete "/api/sites/:id" => "sites#delete"
  post "/api/sites/:id/photo" => "sites#update_photo"

  # Routes pour les voitures
  get "/api/voitures" => "voitures#fetch_all"
  post "/api/voitures" => "voitures#create"
  put "/api/voitures" => "voitures#update"
  delete "/api/voitures/:id" => "voitures#delete"
  get "/api/voitures/site/:user_id" => "voitures#fetch_voitures_site"
  post "/api/voitures/:id/photo" => "voitures#update_photo"

  # Routes pour les clés
  get "/api/cles" => "cles#fetch_all"
  get "/api/cles/voiture/:voiture_id" => "cles#fetch_by_voiture"
  get "/api/cles/disponibles/voiture/:voiture_id" => "cles#fetch_disponibles_by_voiture"

  # Routes pour les localisations
  get "/api/localisations" => "localisations#fetch_all"
  get "/api/localisations/:id" => "localisations#fetch"
  post "/api/localisations" => "localisations#create"
  put "/api/localisations/:id" => "localisations#update"
  delete "/api/localisations/:id" => "localisations#destroy"

  # Routes pour les listes de passagers
  get "/api/utilisateurs/site/:user_id" => "liste_passager#fetch_utilisateurs_site"
  get "/api/passagers/liste/:liste_id" => "liste_passager#fetch_passagers_liste"

  # Routes pour les clés
  get "/api/cles" => "cles#fetch_all"
  post "/api/cles" => "cles#create"
  put "/api/cles" => "cles#update"
  delete "/api/cles/:id" => "cles#delete"

  # Routes pour les entreprises
  get "/api/entreprises" => "entreprises#fetch_all"
  get "/api/entreprises/:id" => "entreprises#fetch"

  # Routes pour le profil utilisateur
  get "/api/user/profile" => "authenticated_page#get_user_profile"
  patch "/api/user/profile" => "authenticated_page#update_user_profile"
  post "/api/user/profile/photo" => "authenticated_page#update_profile_photo"

  # Routes pour les emprunts
  get "/api/emprunts" => "emprunts#fetch_all"
  get "/api/emprunts/multiple_voitures" => "emprunts#get_emprunts_par_multiple_voitures"
  get "/api/emprunts/voiture/:voiture_id" => "emprunts#get_emprunts_par_voiture"
  get "/api/emprunts/pending_count" => "emprunts#get_pending_count"
  get "/api/emprunts/to_complete_count" => "emprunts#get_to_complete_count"
  get "/api/emprunts/:id" => "emprunts#get_emprunts_by_id"
  post "/api/emprunts" => "emprunts#create"
  post "/api/emprunts/:id/valider" => "emprunts#valider"
  post "/api/emprunts/:id/terminer" => "emprunts#terminer"
  post "/api/emprunts/:id/soumettre_validation" => "emprunts#soumettre_validation"
  put "/api/emprunts" => "emprunts#update"
  delete "/api/emprunts/:id" => "emprunts#delete"
  delete "/api/emprunts/:id" => "emprunts#destroy"
  # Routes pour la gestion de suppression de compte
  post "/api/user/request_deletion" => "authenticated_page#request_account_deletion"
  post "/api/user/cancel_deletion" => "authenticated_page#cancel_deletion_request"
  get "/api/user/deletion_details" => "authenticated_page#get_deletion_details"
end
