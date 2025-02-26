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
      raise TokenExpiredError, "Le lien de confirmation a expiré. Un nouveau mail de confirmation vous a été envoyé."
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

    user.update(
      password: new_password,
      reset_password_token: nil
    )
  end

  def update_last_connection
    return false unless @user

    @user.update(
      derniere_connexion: Time.current,
      premiere_connexion: false
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
    # À implémenter avec ActionMailer
    # UserMailer.reset_password_email(@user).deliver_later
  end

  def self.token_expired?(token, expiration_hours = 24)
    return true if token.nil?

    user = Utilisateur.find_by(confirmation_token: token)
    return true unless user

    if user.respond_to?(:token_created_at)
      return true if user.token_created_at.nil?
      user.token_created_at < expiration_hours.hours.ago
    else
      false
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