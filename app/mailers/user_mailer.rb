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
      to: [{ email: @user.email, name: @user.name }],
      subject: 'Confirmez votre compte',
      htmlContent: "<html><head></head><body><p>Bonjour,</p><p>Veuillez confirmer votre compte en cliquant sur le lien suivant : <a href='#{@confirmation_url}'>#{@confirmation_url}</a></p></body></html>"
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    puts response.body
  end
end