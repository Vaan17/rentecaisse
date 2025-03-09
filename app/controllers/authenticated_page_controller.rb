class AuthenticatedPageController < ApplicationController
  before_action :verify_authentication
  
  def index
    Rails.logger.info "=== État de premiere_connexion pour l'utilisateur #{@current_user.id} ==="
    Rails.logger.info "Valeur de premiere_connexion: #{@current_user.premiere_connexion}"
    Rails.logger.info "=== Fin du log ==="

    if @current_user.premiere_connexion
      render json: {
        success: false,
        redirect_to: '/complete-profil',
        message: "Veuillez compléter votre profil"
      }
      return
    end

    render json: {
      success: true,
      user: {
        id: @current_user.id,
        email: @current_user.email,
        nom: @current_user.nom,
        prenom: @current_user.prenom
      },
      message: "Vous êtes bien authentifié"
    }
  end

  def update_profile
    Rails.logger.info "=== Mise à jour du profil pour l'utilisateur #{@current_user.id} ==="
    Rails.logger.info "Valeur de premiere_connexion avant mise à jour: #{@current_user.premiere_connexion}"
    
    result = UserService.update_profile(@current_user, profile_params)
    
    Rails.logger.info "Valeur de premiere_connexion après mise à jour: #{@current_user.premiere_connexion}"
    Rails.logger.info "Résultat de la mise à jour: #{result.inspect}"
    Rails.logger.info "=== Fin du log ==="
    
    if result[:success]
      render json: {
        success: true,
        redirect_to: '/authenticated',
        message: "Profil mis à jour avec succès"
      }
    else
      render json: {
        success: false,
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:profile).permit(
      :prenom,
      :nom,
      :adresse,
      :ville,
      :code_postal,
      :pays,
      :telephone,
      :genre,
      :date_naissance,
      :categorie_permis
    )
  end

  def verify_authentication
    token = request.headers['Authorization']&.split(' ')&.last
    
    unless token
      render json: { 
        success: false, 
        message: "Authentification requise",
        redirect_to: '/login'
      }, status: :unauthorized
      return
    end

    @current_user = Utilisateur.find_by(session_token: token)
    
    unless @current_user && @current_user.session_token_expires_at&.future?
      render json: { 
        success: false, 
        message: "Session expirée",
        redirect_to: '/login'
      }, status: :unauthorized
      return
    end

    # Rafraîchit le token si nécessaire (par exemple si proche de l'expiration)
    if @current_user.session_token_expires_at < 30.minutes.from_now
      @current_user.update(session_token_expires_at: 24.hours.from_now)
    end
  end
end 