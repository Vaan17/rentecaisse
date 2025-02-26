class AuthController < ApplicationController
  def login
    Rails.logger.info "Tentative de connexion avec l'email: #{user_params[:email]}"
    
    service = AuthenticationService.new(user_params[:email], user_params[:password])
    user = service.authenticate

    if user
      Rails.logger.info "Connexion réussie pour l'utilisateur: #{user.email}"
      render json: {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          admin_entreprise: user.admin_entreprise,
          admin_rentecaisse: user.admin_rentecaisse
        }
      }
    else
      Rails.logger.warn "Échec de la connexion"
      render json: { 
        success: false, 
        message: 'Email ou mot de passe incorrect',
        error_code: 'INVALID_CREDENTIALS'
      }, status: :unauthorized
    end
  rescue StandardError => e
    Rails.logger.error "Erreur lors de l'authentification: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { 
      success: false, 
      message: 'Une erreur est survenue lors de la connexion',
      error_code: 'SERVER_ERROR'
    }, status: :internal_server_error
  end

  def register
    Rails.logger.info "Tentative d'inscription avec l'email: #{user_params[:email]}"
    
    user = Utilisateur.new(
      email: user_params[:email],
      password: user_params[:password],
      email_confirme: false,
      admin_entreprise: false,
      admin_rentecaisse: false,
      premiere_connexion: true,
      date_creation_utilisateur: Time.current,
      date_modification_utilisateur: Time.current
    )

    if user.save
      Rails.logger.info "Inscription réussie pour l'utilisateur: #{user.email}"
      
      # Génération du token de confirmation
      service = AuthenticationService.new(user.email, user.password)
      token = service.generate_auth_token(user)
      
      # Envoi de l'email de confirmation
      UserMailer.confirmation_email(user).deliver_later

      render json: {
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.'
      }
    else
      Rails.logger.warn "Échec de l'inscription: #{user.errors.full_messages.join(', ')}"
      render json: { 
        success: false, 
        message: user.errors.full_messages.join(', '),
        error_code: 'VALIDATION_ERROR'
      }, status: :unprocessable_entity
    end
  rescue StandardError => e
    Rails.logger.error "Erreur lors de l'inscription: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { 
      success: false, 
      message: 'Une erreur est survenue lors de l\'inscription',
      error_code: 'SERVER_ERROR'
    }, status: :internal_server_error
  end

  def confirm_email
    Rails.logger.info "Tentative de confirmation d'email avec le token: #{params[:token]}"
    
    service = AuthenticationService.new(nil, nil)
    result = service.confirm_email(params[:token])
    
    if result[:success]
      Rails.logger.info "Email confirmé avec succès"
      render json: { 
        success: true, 
        message: result[:message]
      }
    else
      Rails.logger.warn "Échec de la confirmation: #{result[:message]}"
      render json: { 
        success: false, 
        message: result[:message],
        error_code: 'TOKEN_ERROR'
      }, status: :unauthorized
    end
  rescue StandardError => e
    Rails.logger.error "Erreur lors de la confirmation de l'email: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { 
      success: false, 
      message: 'Une erreur est survenue lors de la confirmation de l\'email',
      error_code: 'SERVER_ERROR'
    }, status: :internal_server_error
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end
end