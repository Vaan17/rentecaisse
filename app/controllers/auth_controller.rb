class AuthController < ApplicationController
  def login
    Rails.logger.info "Paramètres reçus: #{params.inspect}"
    Rails.logger.info "Corps de la requête brut: #{request.raw_post}"
    Rails.logger.info "Content-Type: #{request.content_type}"

    # Récupérer les paramètres email et password
    user_params = params[:user] || {}
    email = user_params[:email]
    hashed_password = user_params[:password]

    Rails.logger.info "Email extrait: #{email}"
    Rails.logger.info "Password haché reçu ? #{!hashed_password.nil?}"

    # Validation du format et présence des champs
    if email.blank? || hashed_password.blank?
      Rails.logger.warn "Email ou mot de passe manquant"
      return render json: { 
        success: false, 
        message: 'Email et mot de passe requis',
        error_code: 'MISSING_FIELDS'
      }, status: :bad_request # 400
    end

    # Validation du format email
    unless email =~ /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
      Rails.logger.warn "Format d'email invalide"
      return render json: { 
        success: false, 
        message: 'Format d\'email invalide',
        error_code: 'INVALID_EMAIL_FORMAT'
      }, status: :bad_request # 400
    end

    # Rechercher l'utilisateur dans la base de données
    query = "SELECT * FROM UTILISATEUR WHERE email = ? AND password = ? LIMIT 1"
    
    Rails.logger.info "Exécution de la requête SQL..."
    
    begin
      result = ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.send(:sanitize_sql_array, [query, email, hashed_password])
      )
      
      Rails.logger.info "Résultat de la requête: #{result.inspect}"

      if result.any?
        user = result.first
        Rails.logger.info "Utilisateur trouvé: #{user['email']}"
        render json: {
          success: true,
          user: {
            id: user['id_user'],
            email: user['email'],
            nom: user['nom'],
            prenom: user['prenom'],
            admin_entreprise: user['admin_entreprise'],
            admin_rentecaisse: user['admin_rentecaisse']
          }
        }
      else
        Rails.logger.warn "Aucun utilisateur trouvé avec ces identifiants"
        render json: { 
          success: false, 
          message: 'Email ou mot de passe incorrect',
          error_code: 'INVALID_CREDENTIALS'
        }, status: :unauthorized # 401
      end
    rescue => e
      Rails.logger.error "Erreur lors de l'authentification: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { 
        success: false, 
        message: 'Une erreur est survenue lors de la connexion',
        error_code: 'SERVER_ERROR'
      }, status: :internal_server_error # 500
    end
  end

  def register
    Rails.logger.info "Paramètres reçus pour l'inscription: #{params.inspect}"
    
    # Récupérer les paramètres
    user_params = params[:user] || {}
    email = user_params[:email]
    hashed_password = user_params[:password]

    # Validation des champs requis
    if email.blank? || hashed_password.blank?
      return render json: { 
        success: false, 
        message: 'Email et mot de passe requis',
        error_code: 'MISSING_FIELDS'
      }, status: :bad_request
    end

    # Validation du format email
    unless email =~ /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/
      return render json: { 
        success: false, 
        message: 'Format d\'email invalide',
        error_code: 'INVALID_EMAIL_FORMAT'
      }, status: :bad_request
    end

    # Vérifier si l'email existe déjà
    check_query = "SELECT COUNT(*) as count FROM UTILISATEUR WHERE email = ?"
    begin
      result = ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.send(:sanitize_sql_array, [check_query, email])
      )
      
      if result.first['count'] > 0
        return render json: { 
          success: false, 
          message: 'Cet email est déjà utilisé',
          error_code: 'EMAIL_TAKEN'
        }, status: :conflict
      end

      # Insérer le nouvel utilisateur
      insert_query = "INSERT INTO UTILISATEUR (email, password, date_creation_utilisateur, date_modification_utilisateur) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
      
      ActiveRecord::Base.connection.execute(
        ActiveRecord::Base.send(:sanitize_sql_array, [insert_query, email, hashed_password])
      )

      render json: {
        success: true,
        message: 'Inscription réussie'
      }
    rescue => e
      Rails.logger.error "Erreur lors de l'inscription: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { 
        success: false, 
        message: 'Une erreur est survenue lors de l\'inscription',
        error_code: 'SERVER_ERROR'
      }, status: :internal_server_error
    end
  end
end 