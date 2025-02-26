class AuthenticatedPageController < ApplicationController
  before_action :verify_authentication
  
  def index
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

  private

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