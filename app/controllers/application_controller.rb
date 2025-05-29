class ApplicationController < ActionController::API
  # Méthode pour vérifier l'authentification de l'utilisateur
  def verify_authentication
    token = request.headers['Authorization']&.split(' ')&.last
    Rails.logger.info "Tentative d'authentification avec le token: #{token ? 'présent' : 'absent'}"
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
