require 'net/http'
require 'uri'
require 'json'
require 'dotenv'
Dotenv.load

class UserMailer < ApplicationMailer
  def confirmation_email(user)
    @user = user
    @confirmation_url = "#{ENV['URL_SITE']}/confirm_email?token=#{user.confirmation_token}"
    uri = URI.parse('https://api.brevo.com/v3/smtp/email')
    request = Net::HTTP::Post.new(uri)
    request['accept'] = 'application/json'
    request['api-key'] = ENV['API_KEY_BREVO']
    request['content-type'] = 'application/json'
    request.body = {
      sender: { name: ENV['SENDER_NAME'], email: ENV['EMAIL_SENDER'] },
      to: [{ email: @user.email }],
      subject: 'Confirmez votre compte',
      htmlContent: "<html><head></head><body><p>Bonjour,</p><p>Veuillez confirmer votre compte en cliquant sur le lien suivant : <a href='#{@confirmation_url}'>#{@confirmation_url}</a></p></body></html>"
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    puts response.body
  end

  def reset_password_email(user)
    @user = user
    @reset_url = "#{ENV['URL_SITE']}/reset-password?token=#{user.reset_password_token}"
    uri = URI.parse('https://api.brevo.com/v3/smtp/email')
    request = Net::HTTP::Post.new(uri)
    request['accept'] = 'application/json'
    request['api-key'] = ENV['API_KEY_BREVO']
    request['content-type'] = 'application/json'
    request.body = {
      sender: { name: ENV['SENDER_NAME'], email: ENV['EMAIL_SENDER'] },
      to: [{ email: @user.email }],
      subject: 'Réinitialisation de votre mot de passe',
      htmlContent: "<html><head></head><body><p>Bonjour,</p><p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien suivant pour procéder à la réinitialisation : <a href='#{@reset_url}'>#{@reset_url}</a></p><p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p></body></html>"
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    puts response.body
  end
end