class AuthController < ApplicationController
  skip_before_action :verify_authentication, raise: false

  def login
    Rails.logger.info "Tentative de connexion avec l'email: #{user_params[:email]}"

    service = AuthenticationService.new(user_params[:email], user_params[:password])
    user = service.authenticate

    if user
      # Génère un token de session
      session_token = SecureRandom.hex(32)
      user.update(
        session_token: session_token,
        session_token_expires_at: 24.hours.from_now
      )

      Rails.logger.info "Connexion réussie pour l'utilisateur: #{user.email}"

      # Vérification si le compte est en attente de suppression
      if user.desactive
        render json: {
          success: true,
          session_token: session_token,
          redirect_to: '/cancellation-account',
          message: "Votre compte est en cours de suppression",
          user: {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            admin_entreprise: user.admin_entreprise,
            admin_rentecaisse: user.admin_rentecaisse
          }
        }
      elsif user.premiere_connexion
        render json: {
          success: true,
          session_token: session_token,
          redirect_to: '/complete-profil',
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
        render json: {
          success: true,
          session_token: session_token,
          user: {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            admin_entreprise: user.admin_entreprise,
            admin_rentecaisse: user.admin_rentecaisse
          }
        }
      end
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

  def logout
    token = request.headers['Authorization']&.split(' ')&.last
    user = Utilisateur.find_by(session_token: token)

    if user
      user.update(session_token: nil, session_token_expires_at: nil)
      render json: { success: true, message: 'Déconnexion réussie' }
    else
      render json: { success: false, message: 'Session invalide' }, status: :unauthorized
    end
  end

  def register
    Rails.logger.info "Tentative d'inscription avec l'email: #{user_params[:email]}"

    # Utiliser le service d'authentification pour l'inscription
    result = AuthenticationService.register_user(
      user_params[:email],
      user_params[:password]
    )

    if result[:success]
      Rails.logger.info "Inscription réussie pour l'utilisateur: #{result[:user].email}"

      # Génération du token de confirmation
      service = AuthenticationService.new(result[:user].email, result[:user].password)
      token = service.generate_auth_token(result[:user])

      # Envoi de l'email de confirmation
      confirmation_url = "#{ENV['URL_SITE']}/confirm_email?token=#{result[:user].confirmation_token}"
      UserMailer.send_mail(
        email: result[:user].email,
        subject: "Confirmez votre compte",
        htmlContent: "
          <html>
            <head></head>
            <body>
              <p>Bonjour,</p>
              <p>Veuillez confirmer votre compte en cliquant sur le lien suivant : <a href='#{confirmation_url}'>#{confirmation_url}</a></p>
            </body>
          </html>
        "
      ).deliver_later

      render json: {
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.'
      }
    else
      Rails.logger.warn "Échec de l'inscription: #{result[:errors].join(', ')}"
      render json: { 
        success: false, 
        message: result[:errors].join(', '),
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

  def forgot_password
    Rails.logger.info "Tentative de réinitialisation de mot de passe pour l'email: #{user_params[:email]}"

    service = AuthenticationService.new(user_params[:email], nil)
    token = service.request_password_reset

    if token
      Rails.logger.info "Email de réinitialisation envoyé à: #{user_params[:email]}"
      render json: {
        success: true,
        message: 'Si un compte existe avec cette adresse e-mail, vous recevrez un e-mail contenant les instructions pour réinitialiser votre mot de passe.'
      }
    else
      Rails.logger.info "Tentative de réinitialisation pour un email inexistant: #{user_params[:email]}"
      render json: {
        success: true,
        message: 'Si un compte existe avec cette adresse e-mail, vous recevrez un e-mail contenant les instructions pour réinitialiser votre mot de passe.'
      }
    end
  rescue StandardError => e
    Rails.logger.error "Erreur lors de la demande de réinitialisation: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { 
      success: false, 
      message: 'Une erreur est survenue lors de la demande de réinitialisation',
      error_code: 'SERVER_ERROR'
    }, status: :internal_server_error
  end

  def reset_password
    Rails.logger.info "Tentative de réinitialisation de mot de passe avec un token"

    service = AuthenticationService.new(nil, nil)
    if service.reset_password(reset_password_params[:token], reset_password_params[:password])
      Rails.logger.info "Mot de passe réinitialisé avec succès"
      render json: {
        success: true,
        message: 'Votre mot de passe a été réinitialisé avec succès.'
      }
    else
      Rails.logger.warn "Échec de la réinitialisation du mot de passe"
      render json: {
        success: false,
        message: 'Le lien de réinitialisation est invalide ou a expiré.',
        error_code: 'INVALID_TOKEN'
      }, status: :unauthorized
    end
  rescue StandardError => e
    Rails.logger.error "Erreur lors de la réinitialisation du mot de passe: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { 
      success: false, 
      message: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
      error_code: 'SERVER_ERROR'
    }, status: :internal_server_error
  end

  private

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def reset_password_params
    params.require(:user).permit(:token, :password)
  end
end
