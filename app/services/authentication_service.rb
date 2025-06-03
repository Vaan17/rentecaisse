require 'digest'

class AuthenticationService
  class AuthenticationError < StandardError; end
  class InvalidEmailError < AuthenticationError; end
  class InvalidPasswordError < AuthenticationError; end
  class AccountNotConfirmedError < AuthenticationError; end
  class AccountLockedError < AuthenticationError; end
  class TokenExpiredError < AuthenticationError; end

  def initialize(email, password)
    @email = email&.downcase
    @password = password
    @user = nil
  end

  def authenticate
    find_user
    check_password
    check_account_status
    generate_session
    @user
  rescue AuthenticationError => e
    # On pourrait logger l'erreur ici
    nil
  end

  def self.authenticate_with_token(token)
    return nil if token.blank?

    user = Utilisateur.find_by(confirmation_token: token)
    return nil unless user && !token_expired?(user.confirmation_token)

    user
  end

  def confirm_email(token)
    user = Utilisateur.find_by(confirmation_token: token)
    return { success: false, message: "Token invalide" } unless user

    if self.class.token_expired?(token)
      # Générer un nouveau token et envoyer un nouveau mail
      new_token = generate_auth_token(user)
      UserMailer.confirmation_email(user).deliver_later
      return { success: false, message: "Le lien de confirmation a expiré. Un nouveau mail de confirmation vous a été envoyé." }
    end

    if user.update(email_confirme: true, confirmation_token: nil)
      { success: true, message: "Votre email a été confirmé avec succès" }
    else
      { success: false, message: "Une erreur est survenue lors de la confirmation" }
    end
  end

  def request_password_reset
    find_user
    token = generate_reset_token
    send_reset_password_email
    token
  rescue AuthenticationError => e
    nil
  end

  def reset_password(token, new_password)
    user = Utilisateur.find_by(reset_password_token: token)
    return false unless user && !self.class.token_expired?(token)

    # Vérifie si le mot de passe est déjà haché
    hashed_password = is_sha256?(new_password) ? new_password : Digest::SHA256.hexdigest(new_password)

    user.update(
      password: hashed_password,
      reset_password_token: nil,
      reset_password_sent_at: nil
    )
  end

  def update_last_connection
    return false unless @user

    @user.update(
      derniere_connexion: Time.current
    )
  end

  def generate_auth_token(user)
    token = SecureRandom.hex(32)
    user.update(
      confirmation_token: token,
      token_created_at: Time.current
    )
    token
  end

  def self.hash_password(password)
    Digest::SHA256.hexdigest(password)
  end

  def self.verify_password(password, hashed_password)
    Digest::SHA256.hexdigest(password) == hashed_password
  end

  def self.register_user(email, password)
    # Hasher le mot de passe
    hashed_password = hash_password(password)
    
    # Créer l'utilisateur avec le mot de passe hashé
    user = Utilisateur.new(
      email: email,
      password: hashed_password,
      email_confirme: false,
      admin_entreprise: false,
      admin_rentecaisse: false,
      premiere_connexion: true,
    )

    if user.save
      { success: true, user: user }
    else
      { success: false, errors: user.errors.full_messages }
    end
  end

  def self.authenticate(email, password)
    user = Utilisateur.find_by(email: email)
    return nil unless user

    if verify_password(password, user.password)
      user
    else
      nil
    end
  end

  private

  def find_user
    @user = Utilisateur.find_by(email: @email)
    raise InvalidEmailError, "Email non trouvé" unless @user
  end

  def check_password
    return if valid_password?(@user)
    
    # Ici on pourrait implémenter un compteur de tentatives échouées
    @user.increment!(:failed_attempts) if @user.respond_to?(:failed_attempts)
    raise InvalidPasswordError, "Mot de passe incorrect"
  end

  def check_account_status
    raise AccountNotConfirmedError, "Email non confirmé" unless @user.email_confirme
    # Vous pouvez ajouter d'autres vérifications ici (compte bloqué, etc.)
  end

  def valid_password?(user)
    return false unless is_sha256?(@password) && is_sha256?(user.password)
    user.password == @password
  end

  def is_sha256?(string)
    return false unless string.is_a?(String)
    return false unless string.length == 64
    string.match?(/\A[a-f0-9]{64}\z/i)
  end

  def generate_session
    token = generate_auth_token(@user)
    update_last_connection
    token
  end

  def generate_reset_token
    token = SecureRandom.hex(32)
    @user.update(
      reset_password_token: token,
      reset_password_sent_at: Time.current
    )
    token
  end

  def send_reset_password_email
    UserMailer.reset_password_email(@user).deliver_later
  end

  def self.token_expired?(token, expiration_hours = 24)
    return true if token.nil?

    user = Utilisateur.find_by(reset_password_token: token) || Utilisateur.find_by(confirmation_token: token)
    return true unless user

    if user.reset_password_token == token
      return true if user.reset_password_sent_at.nil?
      user.reset_password_sent_at < expiration_hours.hours.ago
    elsif user.confirmation_token == token
      return true if user.token_created_at.nil?
      user.token_created_at < expiration_hours.hours.ago
    else
      true
    end
  end

  def log_failed_attempt
    # Vous pourriez implémenter ici une logique pour tracer les tentatives échouées
    # Par exemple, stocker dans une table authentication_attempts
  end

  def check_rate_limiting
    # Vous pourriez implémenter ici une logique de rate limiting
    # Pour éviter les attaques par force brute
  end
end 